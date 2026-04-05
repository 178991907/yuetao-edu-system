"use server";

import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!username || !password) {
    return { success: false, error: "请输入用户名和密码" };
  }

  try {
    // 演示账号后门 (即使数据库挂了或不存在，也允许进入)
    const DEMO_USERS = [
      { id: 'admin', username: 'admin', password: 'admin123', name: '系统管理员', role: 'ADMIN' },
      { id: 'teacher', username: 'teacher', password: 'teacher123', name: '演示教师', role: 'TEACHER' }
    ];

    const matchDemo = DEMO_USERS.find(u => u.username === username && u.password === password);
    
    // 1. 尝试从数据库查询
    let user = null;
    try {
      user = await (prisma as any).user.findUnique({
        where: { username }
      });
    } catch (prismaError) {
      console.warn("⚠️ [数据库异常] 正在尝试演示帐号回退:", prismaError);
    }

    // 2. 逻辑判定：数据库优先，否则回退到演示账号
    if (!user) {
      // 如果库里没用户，看是否匹配演示账号
      if (matchDemo) {
        return { 
          success: true, 
          isDemo: true,
          user: { id: matchDemo.id, name: matchDemo.name, role: matchDemo.role } 
        };
      }
      return { success: false, error: "该用户不存在" };
    }

    // 3. 校验数据库密码
    if (user.password !== password) {
      return { success: false, error: "密码错误，请检查大小写" };
    }

    return { 
      success: true, 
      user: { id: user.id, name: user.name, role: user.role }
    };
  } catch (error: any) {
    console.error("Login critical error:", error);
    return { success: false, error: `登录系统异常: ${error.message || '未知错误'}` };
  }
}
