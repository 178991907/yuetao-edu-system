"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
      return {
        success: true,
        isDemo: true,
        data: [
          { id: 'c1', student: { name: '罗诗涵' }, teacherFeedback: '孩子对色彩极其敏感，构图大胆非常有层次感。', parentRequest: '希望能多关注一下孩子的发音细节。', followUpPlan: '待跟进：周五前反馈测评结果 (高优)', date: new Date() },
          { id: 'c2', student: { name: '马宇博' }, teacherFeedback: '罗文老师反馈：宇博在硬笔练习时手部力量稍显不稳。', parentRequest: '建议平时如何练习？', followUpPlan: '待跟进：录制 1 分钟握笔执笔小视频发送家长', date: new Date(Date.now() - 86400000) },
          { id: 'c3', student: { name: '郭梦瑶' }, teacherFeedback: '绘本英语思维表现优异，已完成 L1 阶段测评。', parentRequest: '好的，谢谢老师。', followUpPlan: '常规反馈：课后回访', date: new Date(Date.now() - 172800000) }
        ]
      };
    }
    return { success: true, data: logs };
  } catch (error) {
    console.warn("⚠️ [数据库异常] 正在回退至沟通反馈预览模式");
    return { success: true, isDemo: true, data: [{ id: 'cd', student: { name: '演示学员' }, teacherFeedback: '反馈内容预览', date: new Date() }] };
  }
}

export async function createCommunication(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    const date = new Date((formData.get("date") as string) || new Date());
    const teacherFeedback = formData.get("teacherFeedback") as string;
    const parentRequest = formData.get("parentRequest") as string | null;
    const followUpPlan = formData.get("followUpPlan") as string | null;

    if (!studentId || !teacherFeedback) {
      return { success: false, error: "Missing required fields" };
    }

    const log = await prisma.communicationLog.create({
      data: {
        studentId,
        date,
        teacherFeedback,
        parentRequest,
        followUpPlan,
      },
    });

    // 同步到学员档案流水
    await prisma.studentActivity.create({
      data: {
        studentId,
        type: 'COMMUNICATION',
        title: '家校沟通记录',
        description: `教师反馈: ${teacherFeedback.substring(0, 50)}${teacherFeedback.length > 50 ? '...' : ''}`,
        date,
        refId: log.id
      }
    });

    revalidatePath("/communication");
    revalidatePath(`/students/${studentId}`);
    return { success: true, data: log };
  } catch (error) {
    console.error("Failed to create communication log:", error);
    return { success: false, error: "Failed to create log" };
  }
}

export async function updateCommunication(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const studentId = formData.get("studentId") as string;
    const teacherFeedback = formData.get("teacherFeedback") as string;
    const parentRequest = formData.get("parentRequest") as string | null;
    const followUpPlan = formData.get("followUpPlan") as string | null;
    const dateInput = formData.get("date") as string;
    const date = dateInput ? new Date(dateInput) : undefined;

    if (!id || !teacherFeedback) {
      return { success: false, error: "Missing required fields" };
    }

    const log = await prisma.communicationLog.update({
      where: { id },
      data: {
        teacherFeedback,
        parentRequest,
        followUpPlan,
        date,
      },
    });

    revalidatePath("/communication");
    if (studentId) {
      revalidatePath(`/students/${studentId}`);
    }
    return { success: true, data: log };
  } catch (error) {
    console.error("Failed to update communication log:", error);
    return { success: false, error: "Failed to update log" };
  }
}

export async function deleteCommunication(id: string, studentId?: string) {
  try {
    await prisma.communicationLog.delete({ where: { id } });
    revalidatePath("/communication");
    if (studentId) {
      revalidatePath(`/students/${studentId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to delete communication log:", error);
    return { success: false, error: "Failed to delete log" };
  }
}
