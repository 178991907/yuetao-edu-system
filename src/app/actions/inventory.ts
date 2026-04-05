"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const MOCK_ITEMS = [
  { id: 'iv1', name: '儿童节定制绘本包', category: '教学库', units: '套', quantity: 154, price: 68.0, description: '包含 5 本分级读物与 1 本练习册' },
  { id: 'iv2', name: '创意启蒙画教具套装', category: '耗材库', units: '份', quantity: 24, price: 45.0, description: 'L1-L2 创意启蒙课全套画笔与纸材' },
  { id: 'iv3', name: '书法硬笔专属练字贴', category: '耗材库', units: '本', quantity: 82, price: 12.0, description: 'Yuetao 专属米字格渐进式字贴' },
];

const MOCK_TRANSACTIONS = [
  { id: 'it1', studentId: 'cmnl-stu-001', studentName: '罗诗涵', itemName: '创意启蒙画教具套装', quantity: 1, type: 'OUT', date: new Date(), remark: '学员领用' },
  { id: 'it2', studentId: 'cmnl-stu-002', studentName: '马宇博', itemName: '书法硬笔专属练字贴', quantity: 1, type: 'OUT', date: new Date(), remark: '学员领用' }
];

const firstNames = ['罗', '马', '郭', '何', '林', '高', '朱', '胡', '孙', '徐', '吴', '周', '黄', '赵', '杨', '陈', '刘', '张', '李', '王'];
const lastNames = ['诗涵', '宇博', '梦瑶', '俊豪', '若冰', '思源', '雅琪', '子轩', '可欣', '沐辰', '嘉懿', '雨霏', '晨曦', '欣怡', '浩宇', '语馨', '梓睿', '一诺', '子悦', '涵'];

for (let i = 2; i < 20; i++) {
  MOCK_TRANSACTIONS.push({
    id: `it${i+1}`,
    studentId: `cmnl-stu-auto-${i-2}`,
    studentName: `${firstNames[i]}${lastNames[i]}`,
    itemName: i % 2 === 0 ? '儿童节定制绘本包' : '创意启蒙画教具套装',
    quantity: 1,
    type: 'OUT',
    date: new Date(`2025-03-${String((i % 28) + 1).padStart(2, '0')}`),
    remark: '学员领用'
  });
}

export async function getInventory() {
  try {
    const items = await prisma.inventoryItem.findMany({ orderBy: { name: "asc" } });
    if (items.length === 0) return { success: true, isDemo: true, data: MOCK_ITEMS };
    return { success: true, data: items };
  } catch (error) {
    return { success: true, isDemo: true, data: MOCK_ITEMS };
  }
}

export async function getInventoryTransactions(studentId?: string) {
  try {
    const transactions = await prisma.inventoryTransaction.findMany({
      where: studentId ? { studentId } : undefined,
      include: { student: { select: { name: true } } },
      orderBy: { date: "desc" },
    });

    if (transactions.length === 0) {
      const filtered = studentId ? MOCK_TRANSACTIONS.filter(t => t.studentId === studentId) : MOCK_TRANSACTIONS;
       return { 
        success: true, 
        isDemo: true, 
        data: filtered.map(t => ({
          ...t,
          student: { name: t.studentName }
        })) 
      };
    }
    return { success: true, data: transactions };
  } catch (error) {
    return { success: true, isDemo: true, data: MOCK_TRANSACTIONS.map(t => ({ ...t, student: { name: t.studentName } })) };
  }
}

export async function getInventoryItems() {
  return getInventory();
}

export async function createInventoryItem(formData: FormData) {
  try {
    revalidatePath("/inventory");
    return { success: true };
  } catch (e) { return { success: false, error: "演示版仅限浏览" }; }
}

export async function deleteInventoryItem(id: string) {
  try {
    revalidatePath("/inventory");
    return { success: true };
  } catch (e) { return { success: false, error: "演示数据保护中" }; }
}

export async function recordInventoryTransaction(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    revalidatePath("/inventory");
    if (studentId) revalidatePath(`/students/${studentId}`);
    return { success: true };
  } catch (e) { return { success: false, error: "演示版运行中" }; }
}
