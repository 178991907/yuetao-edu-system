"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const MOCK_STUDENTS = [
  { id: 'cmnla1', name: '罗诗涵', gender: 'female', age: 7, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla2', name: '马宇博', gender: 'male', age: 8, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla3', name: '郭梦瑶', gender: 'female', age: 6, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla4', name: '何俊豪', gender: 'male', age: 9, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla5', name: '林若冰', gender: 'female', age: 7, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla6', name: '高思源', gender: 'male', age: 10, status: 'GRADUATED', enrollmentDate: new Date('2025-09-01') },
  { id: 'cmnla7', name: '朱雅琪', gender: 'female', age: 5, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla8', name: '胡子轩', gender: 'male', age: 8, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla9', name: '孙可欣', gender: 'female', age: 6, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla10', name: '徐沐辰', gender: 'male', age: 7, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla11', name: '吴嘉懿', gender: 'female', age: 8, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla12', name: '周雨霏', gender: 'female', age: 9, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla13', name: '黄晨曦', gender: 'female', age: 6, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla14', name: '赵欣怡', gender: 'female', age: 7, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla15', name: '杨浩宇', gender: 'male', age: 8, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla16', name: '陈语馨', gender: 'female', age: 5, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla17', name: '刘梓睿', gender: 'male', age: 9, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla18', name: '张一诺', gender: 'female', age: 7, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla19', name: '李子悦', gender: 'female', age: 6, status: 'ACTIVE', enrollmentDate: new Date('2026-04-05') },
  { id: 'cmnla20', name: '王子涵', gender: 'male', age: 8, status: 'GRADUATED', enrollmentDate: new Date('2025-08-15') }
];

export async function getStudents() {
  try {
    const students = await prisma.student.findMany({ orderBy: { enrollmentDate: "desc" } });
    if (students.length === 0) return { success: true, isDemo: true, data: MOCK_STUDENTS };
    return { success: true, data: students };
  } catch (error) {
    return { success: true, isDemo: true, data: MOCK_STUDENTS };
  }
}

export async function getStudentById(id: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: { include: { course: true }, orderBy: { createdAt: "desc" } },
        payments: { include: { course: true }, orderBy: { date: "desc" } },
        communications: { orderBy: { date: "desc" } },
        inventoryTransactions: { orderBy: { date: "desc" } },
        surveys: { include: { template: true }, orderBy: { createdAt: "desc" } },
        activities: { orderBy: { date: "desc" }, take: 50 },
      },
    });

    if (!student) {
       // 根据 ID 后缀匹配 Mock 逻辑
       const mockInfo = MOCK_STUDENTS.find(s => s.id === id) || MOCK_STUDENTS[0];
       return {
         success: true,
         isDemo: true,
         data: {
           ...mockInfo,
           englishName: 'Demo Student', parentName: '王女士', parentPhone: '138****0000', parentRelation: '妈妈',
           birthDate: new Date('2018-05-12'), remarks: '演示数据: 本地数据同步案例',
           enrollments: [
             { id: 'e1', course: { name: '创意启蒙画', price: 1600, totalSessions: 48 }, remainingSessions: 22, status: 'ACTIVE' },
             { id: 'e2', course: { name: '自然科学实验', price: 1800, totalSessions: 24 }, remainingSessions: 0, status: 'COMPLETED' }
           ],
           payments: [
             { id: 'p1', course: { name: '创意启蒙画' }, amount: 1600, method: '微信', date: new Date('2026-04-05') },
             { id: 'p2', course: { name: '自然科学实验' }, amount: 1800, method: '支付宝', date: new Date('2025-12-20') }
           ],
           communications: [
             { id: 'c1', teacherFeedback: '孩子表现非常出色，罗文老师反馈今天上课积极互动，内容吸收很快。', parentRequest: '希望能多关注一下细节。', date: new Date() }
           ],
           surveys: [ { id: 's1', template: { title: '学员入学访谈表' }, score: 5, createdAt: new Date() } ],
           activities: [
             { id: 'a1', type: 'ENROLLMENT', title: '报名课程: 创意启蒙画', description: '消课顺利。', date: new Date() },
             { id: 'a2', type: 'PAYMENT', title: '缴纳学费', description: '实收 ¥1600', date: new Date() }
           ],
           inventoryTransactions: [
             { id: 'iv1', itemName: '分级阅读绘本', quantity: 1, type: 'OUT', date: new Date() }
           ]
         }
       };
    }
    return { success: true, data: student };
  } catch (error) {
    return { success: true, isDemo: true, data: { ...MOCK_STUDENTS[0], enrollments: [], payments: [], communications: [], surveys: [], activities: [] } };
  }
}

// ... createStudent, updateStudent, deleteStudent (保持不变)
export async function createStudent(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const student = await prisma.student.create({ data: { name, status: 'ACTIVE' } });
    revalidatePath("/students");
    return { success: true, data: student };
  } catch (e) { return { success: false, error: "写入失败" }; }
}
export async function updateStudent(id: string, formData: FormData) {
  try {
    const data: any = {};
    const name = formData.get("name") as string;
    const englishName = formData.get("englishName") as string;
    const gender = formData.get("gender") as string;
    const birthDate = formData.get("birthDate") as string;
    const parentName = formData.get("parentName") as string;
    const parentPhone = formData.get("parentPhone") as string;
    const parentRelation = formData.get("parentRelation") as string;
    const remarks = formData.get("remarks") as string;

    if (name) data.name = name;
    if (englishName !== null) data.englishName = englishName;
    if (gender !== null) data.gender = gender;
    if (birthDate) data.birthDate = new Date(birthDate);
    if (parentName !== null) data.parentName = parentName;
    if (parentPhone !== null) data.parentPhone = parentPhone;
    if (parentRelation !== null) data.parentRelation = parentRelation;
    if (remarks !== null) data.remarks = remarks;

    await prisma.student.update({ where: { id }, data });
    revalidatePath("/students");
    revalidatePath(`/students/${id}`);
    return { success: true };
  } catch (e) {
    console.error("Update failed:", e);
    return { success: false, error: "更新信息失败，请稍后重试" };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({ where: { id } });
    revalidatePath("/students");
    return { success: true };
  } catch (e) {
    return { success: false, error: "由于存在关联业务数据，删除失败" };
  }
}
