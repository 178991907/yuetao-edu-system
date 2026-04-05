"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const MOCK_COURSES = [
  { id: 'c-1', name: '创意启蒙画', type: '艺术类', price: 1600, totalSessions: 48, description: 'L1-L2 创意启蒙课全套画笔与纸材', _count: { enrollments: 12 } },
  { id: 'c-2', name: '少儿硬笔艺术', type: '书法类', price: 1200, totalSessions: 16, description: 'Yuetao 专属米字格渐进式字贴', _count: { enrollments: 8 } },
  { id: 'c-3', name: '绘本英语思维', type: '语言类', price: 2400, totalSessions: 24, description: '包含 5 本分级读物与 1 本练习册', _count: { enrollments: 6 } },
];

const MOCK_ENROLLMENTS = [
  { id: 'e1', studentId: 'cmnl-stu-001', studentName: '罗诗涵', courseName: '创意启蒙画', remainingSessions: 32, status: 'ACTIVE', createdAt: new Date('2025-03-01') },
  { id: 'e2', studentId: 'cmnl-stu-002', studentName: '马宇博', courseName: '少儿硬笔艺术', remainingSessions: 8, status: 'ACTIVE', createdAt: new Date('2025-03-02') }
];

const firstNames = ['罗', '马', '郭', '何', '林', '高', '朱', '胡', '孙', '徐', '吴', '周', '黄', '赵', '杨', '陈', '刘', '张', '李', '王'];
const lastNames = ['诗涵', '宇博', '梦瑶', '俊豪', '若冰', '思源', '雅琪', '子轩', '可欣', '沐辰', '嘉懿', '雨霏', '晨曦', '欣怡', '浩宇', '语馨', '梓睿', '一诺', '子悦', '涵'];

for (let i = 2; i < 20; i++) {
  MOCK_ENROLLMENTS.push({
    id: `e${i+1}`,
    studentId: `cmnl-stu-auto-${i-2}`,
    studentName: `${firstNames[i]}${lastNames[i]}`,
    courseName: i % 2 === 0 ? '绘本英语思维' : '创意启蒙画',
    remainingSessions: 24 - (i % 5),
    status: 'ACTIVE',
    createdAt: new Date(`2025-03-${String((i % 28) + 1).padStart(2, '0')}`)
  });
}

export async function getCourses(studentId?: string) {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { enrollments: { where: { status: "ACTIVE" } } },
        },
        enrollments: studentId ? { where: { studentId } } : false,
      },
      orderBy: { createdAt: "desc" },
    });
    
    if (courses.length === 0) return { success: true, isDemo: true, data: MOCK_COURSES };
    return { success: true, data: courses };
  } catch (error) {
    return { success: true, isDemo: true, data: MOCK_COURSES };
  }
}

export async function getEnrollmentsByStudent(studentId: string) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true },
      orderBy: { createdAt: "desc" },
    });
    
    if (enrollments.length === 0) {
      const filtered = MOCK_ENROLLMENTS.filter(e => e.studentId === studentId);
      return { 
        success: true, 
        isDemo: true, 
        data: filtered.map(e => ({
          ...e,
          course: { name: e.courseName, totalSessions: 48 }
        })) 
      };
    }
    return { success: true, data: enrollments };
  } catch (error) {
    return { success: true, isDemo: true, data: MOCK_ENROLLMENTS.map(e => ({ ...e, course: { name: e.courseName, totalSessions: 48 } })) };
  }
}

export async function createCourse(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const price = parseFloat(formData.get("price") as string);
    const totalSessions = parseInt(formData.get("totalSessions") as string);
    await prisma.course.create({ data: { name, type, price, totalSessions } });
    revalidatePath("/courses");
    return { success: true };
  } catch (e) { return { success: false, error: "演示版仅限浏览" }; }
}

export async function updateCourse(id: string, formData: FormData) {
  try {
    revalidatePath("/courses");
    return { success: true };
  } catch (e) { return { success: false, error: "演示版运行中" }; }
}

export async function deleteCourse(id: string) {
  try {
    revalidatePath("/courses");
    return { success: true };
  } catch (e) { return { success: false, error: "演示版本保护中" }; }
}

export async function upsertEnrollment(id: string | null, formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    revalidatePath(`/students/${studentId}`);
    revalidatePath("/courses");
    return { success: true };
  } catch (e) { return { success: false, error: "演示版受限" }; }
}
