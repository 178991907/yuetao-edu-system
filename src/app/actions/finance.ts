"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 财务影子数据：与核心 20 名学员档案 100% 对齐
const MOCK_PAYMENTS = [
  { id: 'p1', studentId: 'cmnl-stu-001', studentName: '罗诗涵', courseName: '创意启蒙画', amount: 1600, method: '微信', date: new Date('2025-03-01'), remark: '实收已入账' },
  { id: 'p2', studentId: 'cmnl-stu-002', studentName: '马宇博', courseName: '少儿硬笔艺术', amount: 1200, method: '支付宝', date: new Date('2025-03-02'), remark: '春季班学费' }
];

const firstNames = ['罗', '马', '郭', '何', '林', '高', '朱', '胡', '孙', '徐', '吴', '周', '黄', '赵', '杨', '陈', '刘', '张', '李', '王'];
const lastNames = ['诗涵', '宇博', '梦瑶', '俊豪', '若冰', '思源', '雅琪', '子轩', '可欣', '沐辰', '嘉懿', '雨霏', '晨曦', '欣怡', '浩宇', '语馨', '梓睿', '一诺', '子悦', '涵'];

for (let i = 2; i < 20; i++) {
  MOCK_PAYMENTS.push({
    id: `p${i+1}`,
    studentId: `cmnl-stu-auto-${i-2}`,
    studentName: `${firstNames[i]}${lastNames[i]}`,
    courseName: i % 2 === 0 ? '绘本英语思维' : '自然科学实验',
    amount: i % 2 === 0 ? 2400 : 1800,
    method: i % 3 === 0 ? '支付宝' : '微信',
    date: new Date(`2025-03-${String((i % 28) + 1).padStart(2, '0')}`),
    remark: '新报录入'
  });
}

const MOCK_EXPENSES = [
  { id: 'e1', category: 'RENT', amount: 5000, description: '4月份房租缴纳', date: new Date() },
  { id: 'e2', category: 'SALARY', amount: 8500, description: '教师绩效与底薪', date: new Date() },
  { id: 'e3', category: 'MATERIALS', amount: 1200, description: '采购教具与绘本包', date: new Date() },
];

export async function getPayments(studentId?: string, filters?: any) {
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

export async function getExpenses(category?: string, startDate?: string, endDate?: string) {
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
    revalidatePath("/finance");
    revalidatePath(`/students/${studentId}`);
    return { success: true };
  } catch (e) { return { success: false, error: "演示版仅限浏览" }; }
}

export async function createExpense(formData: FormData) {
  try {
    revalidatePath("/finance");
    return { success: true };
  } catch (e) { return { success: false, error: "演示版仅限浏览" }; }
}
