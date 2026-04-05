"use server";

import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // 1. 学员总数 (在读)
    const activeStudentCount = await prisma.student.count({
      where: { status: "ACTIVE" }
    });

    // 2. 本月新增学员
    const newStudentCount = await prisma.student.count({
      where: {
        enrollmentDate: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    });

    // 3. 本月总收入 (学费)
    const monthlyPayments = await prisma.payment.findMany({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    });
    const totalIncome = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    // 4. 本月总支出
    const monthlyExpenses = await prisma.transaction.findMany({
      where: {
        type: "EXPENSE",
        date: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    });
    const totalExpense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    // 5. 支出分类数据 (用于占比分析)
    const expenseByCategory: Record<string, number> = {};
    monthlyExpenses.forEach(e => {
      const category = e.category || "OTHER";
      expenseByCategory[category] = (expenseByCategory[category] || 0) + e.amount;
    });
    
    const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
      name: name === 'RENT' ? '房租物业' : 
            name === 'SALARY' ? '人员薪资' : 
            name === 'MATERIALS' ? '物资采购' : 
            name === 'MARKETING' ? '市场推广' : '其它支出',
      value
    }));

    // 6. 获取趋势数据 (过去 6 个月)
    const trendData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = startOfMonth(d);
      const end = endOfMonth(d);

      const [inc, exp, stu] = await Promise.all([
        prisma.payment.findMany({ where: { date: { gte: start, lte: end } } }),
        prisma.transaction.findMany({ where: { type: "EXPENSE", date: { gte: start, lte: end } } }),
        prisma.student.count({ where: { enrollmentDate: { gte: start, lte: end } } })
      ]);

      trendData.push({
        month: d.toLocaleString('zh-CN', { month: 'short' }),
        "收入": inc.reduce((s, p) => s + p.amount, 0),
        "支出": exp.reduce((s, e) => s + e.amount, 0),
        "新增学员": stu
      });
    }

    // 7. 雷达图数据 (模拟运营维度)
    const radarData = [
      { subject: '教学质量', A: 85, fullMark: 100 },
      { subject: '学员满意度', A: 92, fullMark: 100 },
      { subject: '耗课率', A: 78, fullMark: 100 },
      { subject: '续费率', A: 88, fullMark: 100 },
      { subject: '转化率', A: 70, fullMark: 100 },
    ];

    // 8. 相关性分析 (相关性散点图: 学员年龄 vs 下单金额)
    const scatterData = await prisma.payment.findMany({
      take: 20,
      include: { student: { select: { age: true } } }
    }).then(list => list.map(p => ({ x: p.student?.age || 0, y: p.amount, name: p.studentId })));

    // 9. 近期流水
    const recentTransactions = await prisma.payment.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: {
        student: { select: { id: true, name: true } },
        course: { select: { name: true } }
      }
    });

    // 10. 待跟进
    const pendingCommunications = await prisma.communicationLog.findMany({
      where: {
        OR: [
          { followUpPlan: { contains: "待跟进" } },
          { teacherFeedback: { contains: "待跟进" } }
        ]
      },
      take: 3,
      orderBy: { date: "desc" },
      include: {
        student: { select: { id: true, name: true } }
      }
    });

    return {
      success: true,
      data: {
        activeStudentCount,
        newStudentCount,
        totalIncome,
        totalExpense,
        pieData,
        trendData,
        radarData,
        scatterData,
        recentTransactions: recentTransactions.map(t => ({
          id: t.id,
          studentId: t.studentId,
          studentName: t.student?.name || "未知学员",
          courseName: t.course?.name || "未知课程",
          amount: t.amount,
          date: t.date,
          method: t.method
        })),
        pendingCommunications: pendingCommunications.map(c => ({
          id: c.id,
          studentId: c.studentId,
          studentName: c.student?.name,
          content: c.followUpPlan || c.teacherFeedback,
          date: c.date,
          priority: (c.followUpPlan?.includes("高优") || c.teacherFeedback?.includes("高优")) ? "HIGH" : "NORMAL"
        })),
        coursesSummary: await prisma.course.findMany({ take: 3 })
      }
    };
  } catch (error) {
    console.error("Dashboard stats failed:", error);
    return { success: false, error: "Failed to load dashboard data" };
  }
}
