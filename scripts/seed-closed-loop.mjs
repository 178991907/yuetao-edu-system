import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 准备全系统全业务闭环同步 (v2.1.8)...');

  // 0. 清理旧数据并同步模板
  // 注意：在 Vercel 临时库中这些操作是安全的
  try {
    await prisma.studentActivity.deleteMany({});
    await prisma.communicationLog.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.surveyResponse.deleteMany({});
    await prisma.surveyTemplate.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.student.deleteMany({});
    console.log('🧹 临时环境已清理。');
  } catch (e) {
    console.warn('⚠️ 清理过程跳过，可能是新环境。');
  }

  // 1. 初始化全套模板
  const templates = [
    { name: '学员入学访谈表', slug: 'entry-interview' },
    { name: '家长满意度调研', slug: 'satisfaction-survey' },
    { name: '结业能力测评表', slug: 'graduation-assessment' }
  ];
  for (const t of templates) {
    await prisma.surveyTemplate.create({ data: { name: t.name, slug: t.slug, isActive: true } });
  }

  const coursePool = [
    { name: '创意启蒙画', type: '艺术类', price: 1600, sessions: 48 },
    { name: '绘本英语思维', type: '语言类', price: 2400, sessions: 24 },
    { name: '少儿硬笔艺术', type: '艺术类', price: 1200, sessions: 16 },
    { name: '自然科学实验', type: '素质类', price: 1800, sessions: 20 },
    { name: '高阶素描进修', type: '艺术类', price: 3200, sessions: 32 }
  ];

  const firstNames = ['罗', '马', '郭', '何', '林', '高', '朱', '胡', '孙', '徐', '吴', '周', '黄', '赵', '杨', '陈', '刘', '张', '李', '王'];
  const lastNames = ['诗涵', '宇博', '梦瑶', '俊豪', '若冰', '思源', '雅琪', '子轩', '可欣', '沐辰', '嘉懿', '雨霏', '晨曦', '欣怡', '浩宇', '语馨', '梓睿', '一诺', '子悦', '涵'];

  for (let i = 0; i < 20; i++) {
    const name = `${firstNames[i]}${lastNames[i]}`;
    const status = i < 5 ? 'GRADUATED' : 'ACTIVE'; // 前5个设为结业，模拟最后阶段
    const birthYear = 2026 - (Math.floor(Math.random() * 6) + 5); 

    const student = await prisma.student.create({
      data: {
        name,
        gender: i % 2 === 0 ? 'male' : 'female',
        age: 2026 - birthYear,
        birthDate: new Date(birthYear, 5, 12),
        parentName: `${firstNames[(i+2)%20]}女士`,
        parentPhone: `13${800000000 + i*12345}`,
        parentRelation: '妈妈',
        status: status,
        remarks: status === 'GRADUATED' ? '该学员已于今日完成全部课程，考核通过并正式结业。' : '演示数据：正常在读学员。',
        enrollmentDate: new Date(2025, 0, i+1)
      },
    });

    // 为每个学生根据状态生成完整的课程/财务/沟通链条
    for (const cp of coursePool.slice(0, 2)) {
      let course = await prisma.course.findFirst({
        where: { name: cp.name }
      });
      
      if (!course) {
        course = await prisma.course.create({
          data: { name: cp.name, type: cp.type, price: cp.price, totalSessions: cp.sessions, description: '全能系统演示课程' }
        });
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          remainingSessions: status === 'GRADUATED' ? 0 : cp.sessions - 5,
          status: status === 'GRADUATED' ? 'COMPLETED' : 'ACTIVE'
        }
      });

      await prisma.payment.create({
        data: { 
          studentId: student.id, 
          courseId: course.id, 
          amount: cp.price, 
          method: i % 2 === 0 ? '微信' : '支付宝', 
          remark: '同步演示环境流水',
          date: new Date(2025, 0, i+2)
        }
      });

      // 消课与活动记录同步
      await prisma.studentActivity.create({
        data: { 
          studentId: student.id, 
          type: 'PAYMENT', 
          title: '完成缴费', 
          description: `缴纳课程: ${course.name}，金额 ¥${cp.price}`, 
          amount: cp.price,
          date: new Date(2025, 0, i+2)
        }
      });

      if (status === 'GRADUATED') {
        await prisma.studentActivity.create({
          data: { 
            studentId: student.id, 
            type: 'GRADUATION', 
            title: '荣誉结业', 
            description: `恭喜完成课程: ${course.name}！系统已自动发放结业证书。`,
            date: new Date()
          }
        });
      }
    }

    // 每一名学生都补齐一份问卷结果
    const t = await prisma.surveyTemplate.findFirst();
    if (t) {
      await prisma.surveyResponse.create({
        data: { 
          studentId: student.id, 
          templateId: t.id, 
          childNameCn: name, 
          parentName: '张女士', 
          phone: '13800000000', 
          surveyType: 'PARENT',
          createdAt: new Date() 
        }
      });
    }

    console.log(`✅ [${i + 1}/20] 同步进度: ${name} (${status}) 闭环建立完毕。`);
  }

  // 模拟一些机构开支
  const categories = ['RENT', 'SALARY', 'MATERIALS', 'MARKETING'];
  for (const cat of categories) {
    await prisma.transaction.create({
      data: { type: 'EXPENSE', category: cat, amount: 2000 + Math.random()*5000, description: '演示环境运营支出', date: new Date() }
    });
  }

  console.log('\n🚀 全系统全链路数据已 100% 同步！当前部署即拥有完美本地测试体验。');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
