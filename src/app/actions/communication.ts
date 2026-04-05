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
    return { success: true, data: logs };
  } catch (error) {
    console.error("Failed to fetch communication logs:", error);
    return { success: false, error: "Failed to fetch communication logs" };
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
