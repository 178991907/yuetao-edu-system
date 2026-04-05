import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courses = [
  { name: '创意启蒙画', type: '艺术类', price: 1600, sessions: 20 },
  { name: '绘本英语思维', type: '语言类', price: 2400, sessions: 24 },
  { name: '少儿硬笔艺术', type: '艺术类', price: 1200, sessions: 16 },
  { name: '自然科学实验', type: '素质类', price: 1800, sessions: 20 },
];

async function main() {
  console.log('🚀 开始生成 20 组业务闭环演示数据...');

  const firstNames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
  const lastNames = ['子涵', '悦', '一诺', '梓睿', '语馨', '浩宇', '欣怡', '晨曦', '雨霏', '嘉懿', '沐辰', '可欣', '子轩', '雅琪', '思源', '若冰', '俊豪', '梦瑶', '宇博', '诗涵'];

  for (let i = 0; i < 20; i++) {
    const name = `${firstNames[i]}${lastNames[i]}`;
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const parentName = `${firstNames[(i + 5) % 20]}女士`;
    const parentPhone = `13${Math.floor(Math.random() * 900000000 + 100000000)}`;

    // 1. 创建学员
    const student = await prisma.student.create({
      data: {
        name,
        gender,
        parentName,
        parentPhone,
        parentRelation: '妈妈',
        status: 'ACTIVE',
        remarks: `演示数据：该学员已完成缴费并处于正常消课状态（编号 ${i + 1}）。`,
      },
    });

    // 2. 选择一门课程进行报名
    const courseData = courses[Math.floor(Math.random() * courses.length)];
    let course = await prisma.course.findFirst({ where: { name: courseData.name } });
    if (!course) {
      course = await prisma.course.create({
        data: {
          name: courseData.name,
          type: courseData.type,
          price: courseData.price,
          totalSessions: courseData.sessions,
        },
      });
    }

    // 3. 创建报名信息 (初始剩余 0)
    const takenSessions = Math.floor(Math.random() * 8) + 2; // 模拟已消课 2-10 次
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        remainingSessions: courseData.sessions - takenSessions,
        status: 'ACTIVE',
      },
    });

    // 4. 财务缴费闭环
    await prisma.payment.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        amount: courseData.price,
        method: Math.random() > 0.5 ? '微信' : '支付宝',
        remark: '全额预缴',
      },
    });

    // 5. 自动同步动态记录 (消课记录)
    await prisma.studentActivity.create({
      data: {
        studentId: student.id,
        type: 'ENROLLMENT',
        title: `报名课程: ${course.name}`,
        description: `课程总课时 ${course.totalSessions} 次。`,
      },
    });

    await prisma.studentActivity.create({
      data: {
        studentId: student.id,
        type: 'PAYMENT',
        title: `完成缴费: ${course.name}`,
        description: `实收金额 ¥${course.price}`,
        amount: course.price,
      },
    });

    await prisma.studentActivity.create({
      data: {
        studentId: student.id,
        type: 'CONSUMPTION',
        title: `消课确认: ${course.name}`,
        description: `今日已消 1 课时，剩余 ${enrollment.remainingSessions} 课时。`,
      },
    });

    // 6. 添加 1 条家校沟通
    await prisma.communicationLog.create({
      data: {
        studentId: student.id,
        teacherFeedback: `${name}同学在今天的课程中表现非常积极，已经能够熟练掌握课堂核心知识点。`,
        parentRequest: '希望能多关注一下孩子的发音细节。',
      },
    });

    console.log(`✅ [${i + 1}/20] 已完成 ${name} 的全闭环数据同步。`);
  }

  console.log('\n✨ 所有演示数据已同步完成，系统正处于最佳演示状态！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
