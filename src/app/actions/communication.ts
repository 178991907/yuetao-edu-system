"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const MOCK_COMMUNICATIONS = [
  { id: 'c1', studentId: 'cmnl-stu-001', studentName: '罗诗涵', teacherFeedback: 'Sherry 在色彩极其敏锐，构图非常有想象力。今天要特别表扬今天的构图完整度。', parentRequest: '希望能关注一下拼写。', followUpPlan: '待发送反馈卡 (重要)', date: new Date() },
  { id: 'c2', studentId: 'cmnl-stu-002', studentName: '马宇博', teacherFeedback: 'Kevin 宇博在硬笔书写力量控制上有明显提升，结构愈发稳健。建议平时多进行悬腕平衡练习。', parentRequest: '好的老师，谢谢录的小视频。', followUpPlan: '待跟进：周五测评', date: new Date() },
  { id: 'c3', studentId: 'cmnl-stu-auto-0', studentName: '郭梦瑶', teacherFeedback: '绘本英语读音标准，互动热情高涨。已完成 Level D 级别词汇测评。', parentRequest: '在家里也会听绘本。', followUpPlan: '常规反馈：课后回访', date: new Date() }
];

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
    const teacherFeedback = formData.get("teacherFeedback") as string;
    if (!studentId || !teacherFeedback) return { success: false, error: "Missing required fields" };
    
    await prisma.communicationLog.create({
      data: { studentId, teacherFeedback, date: new Date() }
    });
    revalidatePath("/communication");
    revalidatePath(`/students/${studentId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: "演示版仅限浏览" };
  }
}

export async function deleteCommunication(id: string, studentId?: string) {
  try {
    await prisma.communicationLog.delete({ where: { id } });
    revalidatePath("/communication");
    if (studentId) revalidatePath(`/students/${studentId}`);
    return { success: true };
  } catch (e) { return { success: false, error: "演示数据受保护" }; }
}
