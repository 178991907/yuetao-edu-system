"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * 系统一键初始化逻辑
 * 清空所有业务数据，重置系统到出厂状态。
 */
export async function initializeSystem(password: string) {
  try {
    // 1. 二次身份验证 (验证管理员密码)
    const admin = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (!admin || admin.password !== password) {
      return { success: false, error: "管理员密码校验失败，请重试。" };
    }

    // 2. 事务性清空所有业务数据 (按依赖顺序倒序)
    await prisma.$transaction([
      // 业务过程数据
      prisma.surveyResponse.deleteMany(),
      prisma.inventoryTransaction.deleteMany(),
      prisma.communicationLog.deleteMany(),
      prisma.payment.deleteMany(),
      prisma.studentActivity.deleteMany(),
      
      // 核心业务关联
      prisma.enrollment.deleteMany(),
      
      // 基础业务数据
      prisma.student.deleteMany(),
      prisma.inventoryItem.deleteMany(),
      prisma.transaction.deleteMany(),
      
      // 模板类数据 (可选是否清空，此处按“完全出厂”逻辑清空)
      prisma.surveyQuestion.deleteMany(),
      prisma.surveyTemplate.deleteMany(),
      
      // 课程由于是资产，根据需求通常也建议清空
      prisma.course.deleteMany(),
    ]);

    // 3. 强制刷新所有页面数据
    revalidatePath("/", "layout");
    
    return { success: true, message: "系统初始化成功，业务数据已全部清空。" };
  } catch (error: any) {
    console.error("Initialization Error:", error);
    return { success: false, error: "系统初始化失败: " + (error?.message || "由于数据库级异常无法执行。") };
  }
}
