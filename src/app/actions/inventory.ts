"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInventoryItems() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (items.length === 0) {
      return {
        success: true,
        isDemo: true,
        data: [
          { id: 'i1', name: '全能绘本手工包', category: '耗材', unit: '套', quantity: 120, costPrice: 45, price: 88 },
          { id: 'i2', name: '英文原版教材 (A阶)', category: '教辅', unit: '本', quantity: 85, costPrice: 120, price: 299 },
          { id: 'i3', name: '阅陶定制帆布袋', category: '周边', unit: '个', quantity: 240, costPrice: 15, price: 59 },
          { id: 'i4', name: '素描练习套装 (基础)', category: '耗材', unit: '套', quantity: 50, costPrice: 65, price: 158 }
        ]
      };
    }
    return { success: true, data: items };
  } catch (error) {
    console.warn("⚠️ [数据库异常] 正在回退至物资库存预览模式");
    return { 
      success: true, 
      isDemo: true,
      data: [{ id: 'id', name: '演示物资-库存', category: '通用', unit: '件', quantity: 0, costPrice: 0, price: 0 }]
    };
  }
}

export async function getInventoryTransactions(studentId?: string) {
  try {
    const transactions = await prisma.inventoryTransaction.findMany({
      where: studentId ? { studentId } : undefined,
      include: { item: { select: { name: true } } },
      orderBy: { date: "desc" },
    });
    return { success: true, data: transactions };
  } catch (error) {
    console.error("Failed to fetch inventory transactions:", error);
    return { success: false, error: "Failed to fetch inventory transactions" };
  }
}

export async function createInventoryItem(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string || "件";
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const costPrice = parseFloat(formData.get("costPrice") as string) || 0;
    const price = parseFloat(formData.get("price") as string) || 0;

    if (!name || !category) {
      return { success: false, error: "Missing required fields" };
    }

    const item = await prisma.inventoryItem.create({
      data: { name, category, unit, quantity, costPrice, price },
    });

    revalidatePath("/inventory");
    return { success: true, data: item };
  } catch (error) {
    console.error("Failed to create inventory item:", error);
    return { success: false, error: "Failed to create inventory item" };
  }
}

export async function recordInventoryTransaction(formData: FormData) {
  try {
    const itemId = formData.get("itemId") as string;
    const type = formData.get("type") as string; // "IN" or "OUT"
    const quantity = parseInt(formData.get("quantity") as string);
    const studentId = formData.get("studentId") as string | null;
    const remark = formData.get("remark") as string | null;

    if (!itemId || !type || isNaN(quantity) || quantity <= 0) {
      return { success: false, error: "Invalid parameters" };
    }

    // Prisma Transaction: update stock and create log
    await prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error("Item not found");

      if (type === "OUT" && item.quantity < quantity) {
        throw new Error("Insufficient stock");
      }

      const log = await tx.inventoryTransaction.create({
        data: {
          itemId,
          itemName: item.name as string,
          type,
          quantity,
          studentId: studentId || null,
          remark,
        },
      });

      // 如果有关联学员，同步到学员档案流水
      if (studentId) {
        await tx.studentActivity.create({
          data: {
            studentId,
            type: 'INVENTORY',
            title: `${type === 'OUT' ? '领用' : '归还'}物资: ${item.name}`,
            description: `${quantity} 件${remark ? ` | 备注: ${remark}` : ''}`,
            date: new Date(),
            refId: log.id
          }
        });
      }

      await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          quantity: type === "IN" ? item.quantity + quantity : item.quantity - quantity,
        },
      });
    });

    if (studentId) {
      revalidatePath(`/students/${studentId}`);
    }
    revalidatePath("/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to record inventory transaction:", error);
    return { success: false, error: error.message || "Operation failed" };
  }
}

export async function deleteInventoryItem(id: string) {
  console.log("SERVER: Received delete request for item ID:", id);
  try {
    const item = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) {
      console.warn("SERVER: Item not found, aborting.");
      return { success: false, error: "物品不存在" };
    }
    console.log("SERVER: Found item:", item.name);

    // 1. 删除所有没有学员关联的纯库存流水
    const deleteCount = await prisma.inventoryTransaction.deleteMany({
      where: { itemId: id, studentId: null }
    });
    console.log(`SERVER: Deleted ${deleteCount.count} non-student transactions.`);
    
    // 2. 将有学员关联或其它重要备注的流水，断开与品类的硬连接
    const updateCount = await prisma.inventoryTransaction.updateMany({
      where: { itemId: id },
      data: {
        itemId: null as any,
        itemName: item.name
      }
    });
    console.log(`SERVER: Nullified ${updateCount.count} student-bound transactions.`);

    // 3. 最后删除品类台账本身
    await prisma.inventoryItem.delete({
      where: { id },
    });
    console.log("SERVER: Successfully deleted item record.");
    
    revalidatePath("/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("SERVER: Failed to delete inventory item:", error);
    return { success: false, error: "删除操作由于数据库约束失败：" + (error.message || "未知原因") };
  }
}
