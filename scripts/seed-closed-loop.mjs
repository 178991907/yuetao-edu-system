import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 准备全系统 ID 镜像同步 (v2.2.5)...');

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
    console.warn('⚠️ 清理过程跳过。');
  }

  // 1. 初始化全套模板
  const t1 = await prisma.surveyTemplate.create({ data: { name: '学员入学访谈表', slug: 'entry-interview', isActive: true } });

  const coursePool = [
    { name: '创意启蒙画', type: '艺术类', price: 1600, sessions: 48 },
    { name: '绘本英语思维', type: '语言类', price: 2400, sessions: 24 },
    { name: '少儿硬笔艺术', type: '艺术类', price: 1200, sessions: 16 }
  ];

  const firstNames = ['罗', '马', '郭', '何', '林', '高', '朱', '胡', '孙', '徐', '吴', '周', '黄', '赵', '杨', '陈', '刘', '张', '李', '王', '沈', '韩', '杨', '唐', '董'];
  const lastNames = ['诗涵', '宇博', '梦瑶', '俊豪', '若冰', '思源', '雅琪', '子轩', '可欣', '沐辰', '嘉懿', '雨霏', '晨曦', '欣怡', '浩宇', '语馨', '梓睿', '一诺', '子悦', '涵', '星辰', '书宇', '芷晴', '亦凡', '佳琪'];

  for (let i = 0; i < 25; i++) {
    // 严格对齐 student.ts 的影子数据
    const name = `${firstNames[i]}${lastNames[i]}`;
    const studentId = i < 2 ? `cmnl-stu-00${i+1}` : `cmnl-stu-auto-${i-2}`;
    
    let gender = i % 2 === 0 ? 'female' : 'male';
    let age = 6 + (i % 4);
    let status = 'ACTIVE'; // 统一设为在读，确保与档案一致

    if (i === 0) { gender = 'female'; age = 7; }
    else if (i === 1) { gender = 'male'; age = 8; }

    const student = await prisma.student.create({
      data: {
        id: studentId,
        name,
        gender,
        age,
        birthDate: new Date(2018, 5, 12),
        parentName: '陈女士',
        parentPhone: '13812345678',
        parentRelation: '妈妈',
        status: status,
        remarks: i === 0 ? '该学员对色彩极其敏感，构图大胆非常有层次感。目前已完成 L1 阶段创意美术测评。' : (i === 1 ? '近期在硬笔书写力量控制上有明显提升。' : '该学员由系统影子同步，确保云端档案 100% 详实。'),
        enrollmentDate: i >= 20 ? new Date('2026-04-05') : (i === 0 ? new Date('2025-03-01') : (i === 1 ? new Date('2025-03-02') : new Date('2025-03-03')))
      },
    });

    // 报课业务链条
    const cp = coursePool[i % 3];
    let course = await prisma.course.findFirst({ where: { name: cp.name } });
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
        method: '微信', 
        remark: '系统初始化同步',
        date: i >= 20 ? new Date(2026, 3, 5) : new Date(2025, 2, 1)
      }
    });

    // 沟通链条
    await prisma.communicationLog.create({
      data: {
        studentId: student.id,
        date: i >= 20 ? new Date(2026, 3, 5) : new Date(2025, 2, 1),
        teacherFeedback: '孩子表现很有灵气，沟通通顺。',
        parentRequest: '希望能加强发音。',
        followUpPlan: i >= 20 ? '待跟进：新学员四月摸底追踪' : '待发送反馈卡'
      }
    });

    console.log(`✅ [${i + 1}/25] 同步进度: ${name} (${studentId}) 闭环建立完毕。`);
  }

  console.log('\n🚀 全系统镜像同步已 100% 完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
