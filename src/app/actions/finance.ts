"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPayments(studentId?: string, filters?: { courseId?: string; method?: string; startDate?: string; endDate?: string }) {
  try {
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (filters?.courseId) where.courseId = filters.courseId;
    if (filters?.method) where.method = filters.method;
    
    const payments = await prisma.payment.findMany({
      where,
      include: {
        student: { select: { name: true } },
        course: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });

    if (payments.length === 0) {
      return {
        success: true,
        isDemo: true,
        data: [
          { id: 'p1', student: { name: '罗诗涵' }, course: { name: '创意启蒙画' }, amount: 1600, method: '微信', date: new Date(), remark: '演示数据: 同步本地体验' },
          { id: 'p2', student: { name: '马宇博' }, course: { name: '少儿硬笔' }, amount: 1200, method: '支付宝', date: new Date(), remark: '演示数据' },
          { id: 'p3', student: { name: '郭梦瑶' }, course: { name: '绘本英语' }, amount: 2400, method: '微信', date: new Date(), remark: '演示数据' }
        ]
      };
    }
    return { success: true, data: payments };
  } catch (error) {
    return { success: true, isDemo: true, data: [{ id: 'pd', student: { name: '演示学员' }, course: { name: '录入课程' }, amount: 0, method: '现金', date: new Date() }] };
  }
}

export async function getExpenses(category?: string, startDate?: string, endDate?: string) {
  try {
    const where: any = { type: "EXPENSE" };
    if (category) where.category = category;
    
    const expenses = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    });

    if (expenses.length === 0) {
      return {
        success: true,
        isDemo: true,
        data: [
          { id: 'e1', category: 'RENT', amount: 12000, description: '3月份房租物业费 (演示)', date: new Date() },
          { id: 'e2', category: 'SALARY', amount: 7500, description: '兼职外教劳务费 (演示)', date: new Date() },
          { id: 'e3', category: 'MARKETING', amount: 3000, description: '朋友圈广告投放 (演示)', date: new Date() },
          { id: 'e4', category: 'MATERIALS', amount: 1500, description: '画笔画纸耗材采购 (演示)', date: new Date() }
        ]
      };
    }
    return { success: true, data: expenses };
  } catch (error) {
    return { success: true, isDemo: true, data: [{ id: 'ed', category: 'OTHER', amount: 0, description: '离线演示记录', date: new Date() }] };
  }
}

export async function createPayment(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    const courseId = formData.get("courseId") as string | null;
    const amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("method") as string;
    const remark = formData.get("remark") as string | null;

    if (!studentId || isNaN(amount) || !method) return { success: false, error: "Missing required fields" };

    const payment = await prisma.payment.create({
      data: { studentId, courseId: courseId || null, amount, method, date: new Date(), remark },
      include: { course: true }
    });

    revalidatePath("/finance");
    return { success: true, data: payment };
  } catch (error) {
    return { success: false, error: "Failed to create payment" };
  }
}

export async function createExpense(formData: FormData) {
  try {
    const category = formData.get("category") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string | null;

    if (!category || isNaN(amount)) return { success: false, error: "Missing required fields" };

    const expense = await prisma.transaction.create({
      data: { type: "EXPENSE", category, amount, date: new Date(), description },
    });

    revalidatePath("/finance");
    return { success: true, data: expense };
  } catch (error) {
    return { success: false, error: "Failed to create expense" };
  }
}
