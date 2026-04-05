"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    const users = await (prisma as any).user.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: users };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: "系统异常，获取账号列表失败" };
  }
}

export async function createUser(data: any) {
  try {
    const user = await (prisma as any).user.create({
      data: {
        username: data.username,
        password: data.password,
        name: data.name,
        role: data.role || "TEACHER",
        email: data.email || null
      }
    });
    revalidatePath("/users");
    return { success: true, data: user };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "该用户名已存在，请更换" };
    }
    return { success: false, error: "创建账号失败" };
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const user = await (prisma as any).user.update({
      where: { id },
      data: {
        username: data.username,
        password: data.password,
        name: data.name,
        role: data.role,
        email: data.email || null
      }
    });
    revalidatePath("/users");
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "更新账号失败" };
  }
}

export async function deleteUser(id: string) {
  try {
    // 禁止删除唯一的 admin 账号 (假设这是核心账号)
    const user = await (prisma as any).user.findUnique({ where: { id } });
    if (user?.username === 'admin') {
      return { success: false, error: "受保护的系统级账号禁止删除" };
    }

    await (prisma as any).user.delete({ where: { id } });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "删除账号失败" };
  }
}
