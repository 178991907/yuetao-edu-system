import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("正在重置数据库数据...");
  
  await prisma.user.deleteMany({});
  await prisma.studentActivity.deleteMany({});
  await prisma.inventoryTransaction.deleteMany({});
  await prisma.surveyResponse.deleteMany({});
  await prisma.surveyQuestion.deleteMany({});
  await prisma.surveyTemplate.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.communicationLog.deleteMany({});
  await prisma.student.deleteMany({});

  console.log("0. 创建系统用户...");
  await prisma.user.createMany({
    data: [
      { username: "admin", password: "admin123", name: "阅陶校长", role: "ADMIN" },
      { username: "teacher", password: "teacher123", name: "莉莉老师", role: "TEACHER" }
    ]
  });

  console.log("1. 创建课程体系...");
  const c1 = await prisma.course.create({
    data: {
      name: "RAZ 启蒙 A 级精品课",
      type: "ENGLISH",
      totalSessions: 24,
      price: 2400,
      description: "专为零基础设计的英语启蒙课程",
    },
  });

  const c2 = await prisma.course.create({
    data: {
      name: "牛津树分级阅读精读",
      type: "ENGLISH",
      totalSessions: 48,
      price: 4800,
      description: "深度精读牛津树，提升综合阅读力",
    },
  });

  const c3 = await prisma.course.create({
    data: {
      name: "少儿硬笔书法基础",
      type: "ART",
      totalSessions: 20,
      price: 2000,
      description: "端正坐姿，规范运笔",
    },
  });

  console.log("2. 创建学员并构建业务闭环...");
  
  // 学员1: 张小明 (活跃全能型)
  const s1 = await prisma.student.create({
    data: {
      name: "张小明",
      englishName: "Kevin",
      gender: "male",
      age: 8,
      birthDate: new Date("2016-05-20"),
      parentName: "张大山",
      parentPhone: "13800138000",
      parentRelation: "爸爸",
      status: "ACTIVE",
      enrollmentDate: new Date("2026-03-01"),
    },
  });

  // 报名课程 & 支付
  const e1 = await prisma.enrollment.create({
    data: {
      studentId: s1.id,
      courseId: c1.id,
      remainingSessions: 20,
      weeklyFrequency: 2,
      sessionsPerTime: 1,
      scheduleDescription: "周三 18:30, 周六 09:00",
      status: "ACTIVE",
    },
  });

  await prisma.payment.create({
    data: {
      studentId: s1.id,
      courseId: c1.id,
      amount: 2400,
      method: "ALIPAY",
      date: new Date("2026-03-01"),
      remark: "全款缴费 - 包含赠送教材",
    },
  });

  // 领用教材
  const inv1 = await prisma.inventoryItem.create({
    data: {
      name: "RAZ A级点读教材 (套装)",
      category: "BOOK",
      quantity: 45,
      unit: "套",
      price: 400,
      costPrice: 280,
    },
  });

  await prisma.inventoryTransaction.create({
    data: {
      studentId: s1.id,
      itemId: inv1.id,
      itemName: inv1.name,
      quantity: 1,
      type: "OUT",
      date: new Date("2026-03-02"),
      remark: "开课大礼包领取",
    },
  });

  // 沟通记录 (待跟进)
  await prisma.communicationLog.create({
    data: {
      studentId: s1.id,
      date: new Date(),
      teacherFeedback: "张小明今日上课稍微分心。对单词 'Apple' 记忆不清。",
      parentRequest: "家长希望老师能进行二次测试，并告知录像地址。",
      followUpPlan: "待跟进：明日回访家长，确认录像观看权限。",
    },
  });

  // 学员2: 李美美 (艺术特长生)
  const s2 = await prisma.student.create({
    data: {
      name: "李美美",
      englishName: "Lily",
      gender: "female",
      age: 7,
      birthDate: new Date("2017-08-15"),
      parentName: "李建国",
      parentPhone: "13900139000",
      parentRelation: "爸爸",
      status: "ACTIVE",
      enrollmentDate: new Date("2026-03-15"),
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: s2.id,
      courseId: c3.id,
      remainingSessions: 18,
      weeklyFrequency: 1,
      sessionsPerTime: 2,
      scheduleDescription: "周日 14:00 (连报两节)",
      status: "ACTIVE",
    },
  });

  await prisma.payment.create({
    data: {
      studentId: s2.id,
      courseId: c3.id,
      amount: 2000,
      method: "CASH",
      date: new Date("2026-03-15"),
      remark: "现金预缴",
    },
  });

  // 学员3: 王语涵 (待跟进典型)
  const s3 = await prisma.student.create({
    data: {
      name: "王语涵",
      gender: "female",
      age: 6,
      parentName: "张雅欣",
      parentPhone: "18611112222",
      parentRelation: "妈妈",
      status: "ACTIVE",
      enrollmentDate: new Date("2026-04-01"),
    },
  });

  await prisma.communicationLog.create({
    data: {
      studentId: s3.id,
      date: new Date(),
      teacherFeedback: "语涵第一节试听课表现内敛，发音标准。",
      parentRequest: "询问最近启蒙课堂的专注力提升方案。",
      followUpPlan: "待跟进：周五前制定英语学习专注力训练方案。高优处理。",
    },
  });

  console.log("3. 创建运营性收支...");
  await prisma.transaction.create({
    data: {
      amount: 5000,
      type: "EXPENSE",
      category: "RENT",
      date: new Date("2026-04-01"),
      description: "第一季度教室租金",
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 1200,
      type: "EXPENSE",
      category: "MARKETING",
      date: new Date("2026-04-02"),
      description: "地推物料采购",
    },
  });

  console.log("数据闭环构建完成！已创建：");
  console.log("- 3 位核心学员及其业务轨迹");
  console.log("- 3 门特色课程体系");
  console.log("- 多项财务流转记录");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
