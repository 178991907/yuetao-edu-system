"use server";

import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!username || !password) {
    return { success: false, error: "请输入用户名和密码" };
  }

  try {
    // 检查 Prisma Client 是否已准备好
    if (!prisma || !(prisma as any).user) {
      return { success: false, error: "系统数据库正在同步中，请刷新页面后重试 (Prisma Client Sync Missing User)" };
    }

    const user = await (prisma as any).user.findUnique({
      where: { username }
    });

    if (!user) {
      return { success: false, error: "该用户不存在" };
    }

    if (user.password !== password) {
      return { success: false, error: "密码错误，请检查大小写" };
    }

    // 登录成功后，返回用户信息 (这只是个简单的演示认证)
    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    };
  } catch (error: any) {
    console.error("Login critical error:", error);
    return { success: false, error: `登录系统异常: ${error.message || '未知错误'}` };
  }
}
