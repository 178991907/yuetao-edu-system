import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function supplement() {
  console.log('📦 开始补全物资领用与问卷记录数据...');

  // 1. 确保有基础物资
  const items = [
    { name: '阅陶定制书包', category: '周边', unit: '个', price: 128 },
    { name: '级别 A 教材套装', category: '教材', unit: '套', price: 299 },
    { name: '分级阅读绘本', category: '图书', unit: '本', price: 45 },
  ];

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { id: item.name }, // 简单用名称当 ID 演示或通过 findFirst
      update: {},
      create: {
        name: item.name,
        category: item.category,
        unit: item.unit,
        price: item.price,
        quantity: 100,
      }
    }).catch(() => {
        // 如果 ID 冲突则找现有的
    });
  }

  const inventoryItems = await prisma.inventoryItem.findMany();
  
  // 2. 确保有问卷模板
  const template = await prisma.surveyTemplate.upsert({
    where: { slug: 'entrance-survey' },
    update: {},
    create: {
      name: '学员入学会访谈表',
      slug: 'entrance-survey',
      description: '用于收集学员入学基础信息及学习目标',
    }
  });

  // 3. 获取最近生成的 20 名学员
  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  for (const student of students) {
    // 补充物资领用
    const item = inventoryItems[Math.floor(Math.random() * inventoryItems.length)];
    await prisma.inventoryTransaction.create({
      data: {
        studentId: student.id,
        itemId: item.id,
        itemName: item.name,
        type: 'OUT',
        quantity: 1,
        remark: '随课赠送/领用',
      }
    });

    // 补充问卷记录
    await prisma.surveyResponse.create({
      data: {
        studentId: student.id,
        templateId: template.id,
        surveyType: 'ENTRANCE',
        childNameCn: student.name,
        childNameEn: student.name + ' (En)',
        gender: student.gender || 'unknown',
        birthDate: '2018-05-12',
        parentName: student.parentName || '未知',
        relationship: student.parentRelation || '家长',
        phone: student.parentPhone || '13800000000',
        address: '广深市南山区阅陶路 101 号',
        ageExposedEnglish: '2年',
        razLevel: 'Level D',
        oxfordTreeLevel: 'Stage 3',
        readingMethod: '亲子共读',
        weeklyBooksCount: '3-5本',
        parentChildCommFreq: '每天',
        parentsEnglishLevel: '中等',
        learningGoal: '培养孩子的阅读兴趣，提高英语口语自信心。',
        offlineInstitute: '无',
        specialNotes: '孩子性格稍显内向，建议多给予鼓励。',
      }
    });

    console.log(`✅ 已补全学员 [${student.name}] 的物资及问卷数据。`);
  }

  console.log('\n✨ 物资领用与问卷记录已补全完毕！');
}

supplement()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
