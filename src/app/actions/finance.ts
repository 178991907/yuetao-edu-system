"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPayments(studentId?: string, filters?: { courseId?: string; method?: string; startDate?: string; endDate?: string }) {
  try {
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (filters?.courseId) where.courseId = filters.courseId;
    if (filters?.method) where.method = filters.method;
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }
    
    const payments = await prisma.payment.findMany({
      where,
      include: {
        student: { select: { name: true } },
        course: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });
    return { success: true, data: payments };
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return { success: false, error: "Failed to fetch payments" };
  }
}

export async function getExpenses(category?: string, startDate?: string, endDate?: string) {
  try {
    const where: any = { type: "EXPENSE" };
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    
    const expenses = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    });
    return { success: true, data: expenses };
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return { success: false, error: "Failed to fetch expenses" };
  }
}

export async function createPayment(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    const courseId = formData.get("courseId") as string | null;
    const amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("method") as string;
    const date = new Date(formData.get("date") as string || new Date());
    const remark = formData.get("remark") as string | null;

    if (!studentId || isNaN(amount) || !method) {
      return { success: false, error: "Missing required fields" };
    }

    const payment = await prisma.payment.create({
      data: {
        studentId,
        courseId: courseId || null,
        amount,
        method,
        date,
        remark,
      },
      include: { course: true }
    });

    // 同步到学员档案流水
    await prisma.studentActivity.create({
      data: {
        studentId,
        type: 'PAYMENT',
        title: `缴费: ¥${amount}`,
        description: `支付方式: ${method}${payment.course ? ` | 课程: ${payment.course.name}` : ''}${remark ? ` | 备注: ${remark}` : ''}`,
        amount,
        date,
        refId: payment.id
      }
    });

    revalidatePath("/finance");
    revalidatePath(`/students/${studentId}`);
    return { success: true, data: payment };
  } catch (error) {
    console.error("Failed to create payment:", error);
    return { success: false, error: "Failed to create payment" };
  }
}

export async function createExpense(formData: FormData) {
  try {
    const category = formData.get("category") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const date = new Date(formData.get("date") as string || new Date());
    const description = formData.get("description") as string | null;

    if (!category || isNaN(amount)) {
      return { success: false, error: "Missing required fields" };
    }

    const expense = await prisma.transaction.create({
      data: {
        type: "EXPENSE",
        category,
        amount,
        date,
        description,
      },
    });

    revalidatePath("/finance");
    return { success: true, data: expense };
  } catch (error) {
    console.error("Failed to create expense:", error);
    return { success: false, error: "Failed to create expense" };
  }
}
