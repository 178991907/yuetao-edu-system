import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const students = await prisma.student.count();
  const enrollments = await prisma.enrollment.count();
  const payments = await prisma.payment.count();
  const communications = await prisma.communicationLog.count();
  const activities = await prisma.studentActivity.count();

  console.log(`--- 数据库现状统计 ---`);
  console.log(`学员总数: ${students}`);
  console.log(`报名总数: ${enrollments}`);
  console.log(`缴费记录: ${payments}`);
  console.log(`沟通日志: ${communications}`);
  console.log(`动态记录: ${activities}`);
}

check().then(() => prisma.$disconnect());
