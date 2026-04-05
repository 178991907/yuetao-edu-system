"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const MOCK_COMMUNICATIONS = [
  { id: 'c1', studentId: 'cmnl-stu-001', studentName: '罗诗涵', teacherFeedback: 'Sherry 在色彩极其敏锐，构图非常有想象力。今天要特别表扬今天的构图完整度。', parentRequest: '希望能关注一下拼写。', followUpPlan: '待发送反馈卡 (重要)', date: new Date() },
  { id: 'c2', studentId: 'cmnl-stu-002', studentName: '马宇博', teacherFeedback: 'Kevin 宇博在硬笔书写力量控制上有明显提升，结构愈发稳健。建议平时多进行悬腕平衡练习。', parentRequest: '好的老师，谢谢录的小视频。', followUpPlan: '待跟进：周五测评', date: new Date() }
];

const firstNames = ['罗', '马', '郭', '何', '林', '高', '朱', '胡', '孙', '徐', '吴', '周', '黄', '赵', '杨', '陈', '刘', '张', '李', '王', '沈', '韩', '杨', '唐', '董'];
const lastNames = ['诗涵', '宇博', '梦瑶', '俊豪', '若冰', '思源', '雅琪', '子轩', '可欣', '沐辰', '嘉懿', '雨霏', '晨曦', '欣怡', '浩宇', '语馨', '梓睿', '一诺', '子悦', '涵', '星辰', '书宇', '芷晴', '亦凡', '佳琪'];

for (let i = 2; i < 25; i++) {
  MOCK_COMMUNICATIONS.push({
    id: `c${i+1}`,
    studentId: `cmnl-stu-auto-${i-2}`,
    studentName: `${firstNames[i]}${lastNames[i]}`,
    teacherFeedback: i % 2 === 0 ? '绘本英语读音标准，互动热情高涨。已完成 Level D 级别词汇测评。' : '本周科学实验表现出色，动手能力很强。',
    parentRequest: i % 3 === 0 ? '在家里也会听绘本。' : '上周感冒了目前刚恢复。',
    followUpPlan: i >= 20 ? '待跟进：新学员四月摸底追踪' : '常规反馈：课后回访',
    date: i < 20 ? new Date(Date.now() - (i % 5) * 86400000) : new Date('2026-04-05')
  });
}

export async function getCommunications(studentId?: string) {
  try {
    const logs = await prisma.communicationLog.findMany({
      where: studentId ? { studentId } : undefined,
      include: {
        student: { select: { name: true } }
      },
      orderBy: { date: "desc" },
    });

    if (logs.length === 0) {
      const filtered = studentId ? MOCK_COMMUNICATIONS.filter(c => c.studentId === studentId) : MOCK_COMMUNICATIONS;
      return { 
        success: true, 
        isDemo: true, 
        data: filtered.map(c => ({
          ...c,
          student: { name: c.studentName }
        })) 
      };
    }
    return { success: true, data: logs };
  } catch (error) {
    return { success: true, isDemo: true, data: MOCK_COMMUNICATIONS.map(c => ({ ...c, student: { name: c.studentName } })) };
  }
}

export async function createCommunication(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    revalidatePath("/communication");
    revalidatePath(`/students/${studentId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: "演示版仅限浏览" };
  }
}

export async function updateCommunication(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    revalidatePath("/communication");
    if (studentId) revalidatePath(`/students/${studentId}`);
    return { success: true };
  } catch (e) { return { success: false, error: "演示版运行中" }; }
}

export async function deleteCommunication(id: string, studentId?: string) {
  try {
    await prisma.communicationLog.delete({ where: { id } });
    revalidatePath("/communication");
    if (studentId) revalidatePath(`/students/${studentId}`);
    return { success: true };
  } catch (e) { return { success: false, error: "演示数据受保护" }; }
}
