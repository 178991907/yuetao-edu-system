import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfill() {
  console.log('开始同步历史数据到学员档案流水表...');

  // 1. 同步缴费记录
  const payments = await prisma.payment.findMany({
    include: { student: true, course: true }
  });
  for (const p of payments) {
    await prisma.studentActivity.create({
      data: {
        studentId: p.studentId,
        type: 'PAYMENT',
        title: `缴费: ¥${p.amount}`,
        description: `支付方式: ${p.method}${p.course ? ` | 课程: ${p.course.name}` : ''}${p.remark ? ` | 备注: ${p.remark}` : ''}`,
        amount: p.amount,
        date: p.date,
        refId: p.id
      }
    });
  }
  console.log(`同步了 ${payments.length} 条缴费记录`);

  // 2. 同步物资记录
  const inventory = await prisma.inventoryTransaction.findMany({
    where: { studentId: { not: null } }
  });
  for (const t of inventory) {
    if (!t.studentId) continue;
    await prisma.studentActivity.create({
      data: {
        studentId: t.studentId,
        type: 'INVENTORY',
        title: `${t.type === 'OUT' ? '领用' : '归还'}物资: ${t.itemName}`,
        description: `${t.quantity} 件 | 备注: ${t.remark || '-'}`,
        date: t.date,
        refId: t.id
      }
    });
  }
  console.log(`同步了 ${inventory.length} 条物资记录`);

  // 3. 同步沟通记录
  const comms = await prisma.communicationLog.findMany();
  for (const c of comms) {
    await prisma.studentActivity.create({
      data: {
        studentId: c.studentId,
        type: 'COMMUNICATION',
        title: '家校沟通记录',
        description: `反馈: ${c.teacherFeedback.substring(0, 50)}...`,
        date: c.date,
        refId: c.id
      }
    });
  }
  console.log(`同步了 ${comms.length} 条沟通记录`);

  // 4. 同步问卷记录 (包含姓名匹配逻辑)
  const surveys = await prisma.surveyResponse.findMany();
  let surveyMatchCount = 0;
  for (const s of surveys) {
    let studentId = s.studentId;
    
    // 如果没有绑定ID, 尝试按姓名匹配
    if (!studentId) {
      const student = await prisma.student.findFirst({
        where: { name: s.childNameCn }
      });
      if (student) {
        studentId = student.id;
        // 永久绑定ID
        await prisma.surveyResponse.update({
          where: { id: s.id },
          data: { studentId: student.id }
        });
      }
    }

    if (studentId) {
      await prisma.studentActivity.create({
        data: {
          studentId: studentId,
          type: 'SURVEY',
          title: `问卷提交: ${s.surveyType}`,
          description: `提交人: ${s.parentName} (${s.relationship})`,
          date: s.createdAt,
          refId: s.id
        }
      });
      surveyMatchCount++;
    }
  }
  console.log(`同步了 ${surveyMatchCount} 条问卷记录 (已通过姓名匹配补全联系)`);

  console.log('数据同步完成！');
}

backfill()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
