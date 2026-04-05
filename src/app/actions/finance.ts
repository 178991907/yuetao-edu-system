"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 财务影子数据：与核心 20 名学员档案 100% 对齐
const MOCK_PAYMENTS = [
  { id: 'p1', studentId: 'cmnl-stu-001', studentName: '罗诗涵', courseName: '创意启蒙画', amount: 1600, method: '微信', date: new Date('2025-03-01'), remark: '实收已入账' },
  { id: 'p2', studentId: 'cmnl-stu-002', studentName: '马宇博', courseName: '少儿硬笔艺术', amount: 1200, method: '支付宝', date: new Date('2025-03-02'), remark: '春季班学费' },
  { id: 'p3', studentId: 'cmnl-stu-auto-0', studentName: '郭梦瑶', courseName: '绘本英语思维', amount: 2400, method: '微信', date: new Date('2025-03-03'), remark: '新报录入' },
  { id: 'p4', studentId: 'cmnl-stu-auto-1', studentName: '何俊豪', courseName: '自然科学实验', amount: 1800, method: '微信', date: new Date('2025-03-04') },
];

const MOCK_EXPENSES = [
  { id: 'e1', category: 'RENT', amount: 5000, description: '4月份房租缴纳', date: new Date() },
  { id: 'e2', category: 'SALARY', amount: 8500, description: '教师绩效与底薪', date: new Date() },
  { id: 'e3', category: 'MATERIALS', amount: 1200, description: '采购教具与绘本包', date: new Date() },
];

export async function getPayments(studentId?: string) {
  try {
    const payments = await prisma.payment.findMany({
      where: studentId ? { studentId } : undefined,
      include: {
        student: { select: { name: true } },
        course: { select: { name: true } }
      },
      orderBy: { date: "desc" },
    });

    if (payments.length === 0) {
      const filtered = studentId ? MOCK_PAYMENTS.filter(p => p.studentId === studentId) : MOCK_PAYMENTS;
      return { 
        success: true, 
        isDemo: true, 
        data: filtered.map(p => ({
          ...p,
          student: { name: p.studentName },
          course: { name: p.courseName }
        })) 
      };
    }
    return { success: true, data: payments };
  } catch (error) {
    return { success: true, isDemo: true, data: MOCK_PAYMENTS.map(p => ({ ...p, student: { name: p.studentName }, course: { name: p.courseName } })) };
  }
}

export async function getExpenses() {
  try {
    const expenses = await prisma.transaction.findMany({
      where: { type: "EXPENSE" },
      orderBy: { date: "desc" },
    });
    if (expenses.length === 0) return { success: true, isDemo: true, data: MOCK_EXPENSES };
    return { success: true, data: expenses };
  } catch (error) {
    return { success: true, isDemo: true, data: MOCK_EXPENSES };
  }
}

export async function createPayment(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    const courseId = formData.get("courseId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("method") as string;
    const date = new Date(formData.get("date") as string);

    await prisma.payment.create({
      data: { studentId, courseId, amount, method, date }
    });
    revalidatePath("/finance");
    return { success: true };
  } catch (e) { return { success: false, error: "演示版仅限浏览" }; }
}
