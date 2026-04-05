"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCourses(studentId?: string) {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { enrollments: { where: { status: "ACTIVE" } } },
        },
        enrollments: studentId ? {
          where: { studentId },
        } : false,
      },
      orderBy: { createdAt: "desc" },
    });
    
    if (courses.length === 0) {
      return { 
        success: true, 
        isDemo: true,
        data: [
          { id: 'c-1', name: '创意启蒙画 (演示)', type: '艺术类', price: 1600, totalSessions: 48, _count: { enrollments: 12 } },
          { id: 'c-2', name: '绘本英语思维 (演示)', type: '语言类', price: 2400, totalSessions: 24, _count: { enrollments: 8 } },
          { id: 'c-3', name: '少儿硬笔艺术 (演示)', type: '艺术类', price: 1200, totalSessions: 16, _count: { enrollments: 15 } },
          { id: 'c-4', name: '自然科学实验 (演示)', type: '素质类', price: 1800, totalSessions: 20, _count: { enrollments: 6 } }
        ]
      };
    }
    return { success: true, data: courses };
  } catch (error) {
    console.warn("⚠️ [数据库异常] 正在回退至演示课程体系");
    return { 
      success: true, 
      isDemo: true,
      data: [{ id: 'c-1', name: '精品录入课程 (演示)', type: '综合类', price: 0, totalSessions: 0, _count: { enrollments: 0 } }]
    };
  }
}

export async function getEnrollmentsByStudent(studentId: string) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: enrollments };
  } catch (error) {
    console.error("Failed to fetch enrollments:", error);
    return { success: false, error: "Failed to fetch enrollments" };
  }
}

export async function createCourse(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const totalSessions = parseInt(formData.get("totalSessions") as string) || 0;
    const description = formData.get("description") as string | null;

    if (!name || !type) {
      return { success: false, error: "Name and type are required" };
    }

    const course = await prisma.course.create({
      data: {
        name,
        type,
        price,
        totalSessions,
        description,
      },
    });

    revalidatePath("/courses");
    return { success: true, data: course };
  } catch (error) {
    console.error("Failed to create course:", error);
    return { success: false, error: "Failed to create course" };
  }
}

export async function deleteCourse(id: string) {
  try {
    // First delete related records if necessary depending on ON DELETE cascade or do it manually
    // Currently Prisma schema does not have cascade set, we either add it to schema or delete manually.
    // For simplicity, just delete course (it will fail if there are enrollments without cascade).
    await prisma.course.delete({
      where: { id },
    });
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete course:", error);
    return { success: false, error: "删除失败，该课程可能已有学生报名，无法直接物理删除" };
  }
}

export async function updateCourse(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const totalSessions = parseInt(formData.get("totalSessions") as string) || 0;
    const description = formData.get("description") as string | null;

    if (!id || !name || !type) {
      return { success: false, error: "缺少必要字段" };
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        name,
        type,
        price,
        totalSessions,
        description,
      },
    });

    revalidatePath("/courses");
    return { success: true, data: course };
  } catch (error) {
    console.error("Failed to update course:", error);
    return { success: false, error: "更新课程失败" };
  }
}

export async function upsertEnrollment(id: string | null, formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    const courseId = formData.get("courseId") as string;
    const remainingSessions = parseInt(formData.get("remainingSessions") as string) || 0;
    
    // 这里增加排课信息逻辑
    const weeklyFrequency = formData.get("weeklyFrequency") ? parseInt(formData.get("weeklyFrequency") as string) : null;
    const sessionsPerTime = formData.get("sessionsPerTime") ? parseInt(formData.get("sessionsPerTime") as string) : 1;
    const scheduleDescription = formData.get("scheduleDescription") as string | null;
    const status = formData.get("status") as string || "ACTIVE";

    if (!studentId || !courseId) {
      return { success: false, error: "缺少学员或课程ID" };
    }

    const data = {
      studentId,
      courseId,
      remainingSessions,
      weeklyFrequency,
      sessionsPerTime,
      scheduleDescription,
      status
    };

    let enrollment;
    if (id) {
       enrollment = await prisma.enrollment.update({
         where: { id },
         data
       });
    } else {
       enrollment = await prisma.enrollment.upsert({
         where: { studentId_courseId: { studentId, courseId } },
         update: data,
         create: data
       });

       // 只有在新报名时才记录学生动态
       await prisma.studentActivity.create({
         data: {
           studentId,
           type: 'ENROLLMENT',
           title: `课程报名: ${courseId}`, // FIXME: 这里如果能传课程名更好，但 Prisma 操作已足够
           description: `初始剩余课时: ${remainingSessions}`,
           date: new Date(),
           refId: enrollment.id
         }
       });
    }

    revalidatePath(`/students/${studentId}`);
    revalidatePath("/courses");
    return { success: true, data: enrollment };
  } catch (error: any) {
    console.error("Failed to save enrollment:", error);
    return { success: false, error: "保存报名或排课设置失败: " + error.message };
  }
}

