"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { enrollmentDate: "desc" },
    });
    return { success: true, data: students };
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return { success: false, error: "Failed to fetch students" };
  }
}

export async function createStudent(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const englishName = formData.get("englishName") as string | null;
    const gender = formData.get("gender") as string | null;
    const ageValue = formData.get("age");
    const age = ageValue ? parseInt(ageValue as string) : null;
    const birthDateStr = formData.get("birthDate") as string | null;
    
    // 增加严格的时间转换检查
    let birthDate = null;
    if (birthDateStr && birthDateStr.trim() !== "") {
       const d = new Date(birthDateStr);
       if (!isNaN(d.getTime())) {
          birthDate = d;
       }
    }

    const parentRelation = formData.get("parentRelation") as string | null;
    const parentName = formData.get("parentName") as string | null;
    const parentPhone = formData.get("parentPhone") as string | null;
    const remarks = formData.get("remarks") as string | null;
    const status = (formData.get("status") as string) || "ACTIVE";

    console.log("Saving student:", { name, englishName, birthDate });

    if (!name) {
      return { success: false, error: "请填写学员姓名" };
    }

    const student = await prisma.student.create({
      data: {
        name,
        englishName,
        gender,
        age,
        birthDate,
        parentRelation,
        parentName,
        parentPhone,
        remarks,
        status,
      },
    });

    revalidatePath("/students");
    return { success: true, data: student };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: error?.message || "由于数据库异常保存失败" };
  }
}

export async function updateStudent(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const englishName = formData.get("englishName") as string | null;
    const gender = formData.get("gender") as string | null;
    const ageValue = formData.get("age");
    const age = ageValue ? parseInt(ageValue as string) : null;
    const birthDateStr = formData.get("birthDate") as string | null;
    
    let birthDate = null;
    if (birthDateStr && birthDateStr.trim() !== "") {
       const d = new Date(birthDateStr);
       if (!isNaN(d.getTime())) {
          birthDate = d;
       }
    }

    const parentRelation = formData.get("parentRelation") as string | null;
    const parentName = formData.get("parentName") as string | null;
    const parentPhone = formData.get("parentPhone") as string | null;
    const remarks = formData.get("remarks") as string | null;
    const status = (formData.get("status") as string) || "ACTIVE";

    if (!name) {
      return { success: false, error: "请填写学员姓名" };
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        name,
        englishName,
        gender,
        age,
        birthDate,
        parentRelation,
        parentName,
        parentPhone,
        remarks,
        status,
      },
    });

    revalidatePath("/students");
    revalidatePath(`/students/${id}`);
    return { success: true, data: student };
  } catch (error: any) {
    console.error("Update Action Error:", error);
    return { success: false, error: error?.message || "由于数据库异常更新失败" };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({
      where: { id },
    });
    revalidatePath("/students");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete student:", error);
    return { success: false, error: "Failed to delete student" };
  }
}

export async function getStudentById(id: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { course: true },
          orderBy: { createdAt: "desc" },
        },
        payments: {
          include: { course: true },
          orderBy: { date: "desc" },
        },
        communications: {
          orderBy: { date: "desc" },
        },
        inventoryTransactions: {
          orderBy: { date: "desc" },
        },
        surveys: {
          include: { template: true },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          orderBy: { date: "desc" },
          take: 50,
        },
      },
    });
    return { success: true, data: student };
  } catch (error) {
    console.error("Failed to fetch student:", error);
    return { success: false, error: "Failed to fetch student" };
  }
}
