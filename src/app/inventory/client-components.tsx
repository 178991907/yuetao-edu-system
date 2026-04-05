"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowUpRight, ArrowDownRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createInventoryItem, recordInventoryTransaction, deleteInventoryItem } from "../actions/inventory";
import { Trash2 } from "lucide-react";

export function CreateInventoryDialog({ existingCategories = [] }: { existingCategories?: string[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categoryType, setCategoryType] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // 合并预设分类与数据库已有的分类
  const baseCategories = ["BOOK", "MATERIAL", "DEVICE", "OTHER"];
  const displayCategories = Array.from(new Set([...baseCategories, ...existingCategories]))
    .filter(c => c !== "custom"); // 过滤掉逻辑占位符

  // 格式化显示名称
  const getCategoryName = (c: string) => {
    switch(c) {
      case 'BOOK': return '教材书籍';
      case 'MATERIAL': return '教具材料';
      case 'DEVICE': return '设备设施';
      case 'OTHER': return '其它分类';
      default: return c; // 自定义分类直接显示名称
    }
  };

  async function onSubmit(formData: FormData) {
    setLoading(true);
    if (categoryType === "custom") {
      formData.set("category", customCategory);
    } else {
      formData.set("category", categoryType);
    }
    await createInventoryItem(formData);
    setLoading(false);
    setOpen(false);
    setCategoryType("");
    setCustomCategory("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            新增库存品类
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>新增库存品类</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">物品名称</Label>
              <Input name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">分类</Label>
              <div className="col-span-3 flex flex-col gap-2">
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  required
                >
                  <option value="">请选择分类</option>
                  {displayCategories.map(cat => (
                    <option key={cat} value={cat}>{getCategoryName(cat)}</option>
                  ))}
                  <option value="custom" className="text-cyan-600 font-bold">+ 自定义内容...</option>
                </select>
                {categoryType === "custom" && (
                  <Input 
                    placeholder="请输入新分类名称" 
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">初始库存</Label>
              <Input name="quantity" type="number" defaultValue="0" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">单位</Label>
              <Input name="unit" defaultValue="个/本" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">进货均价(¥)</Label>
              <Input name="costPrice" type="number" step="0.01" defaultValue="0" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">发售价格(¥)</Label>
              <Input name="price" type="number" step="0.01" defaultValue="0" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-cyan-600">
              {loading ? "保存中..." : "保存类别"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function InventoryActionDialog({ item, type, students, studentId }: { item: any, type: "IN" | "OUT", students?: any[], studentId?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const res = await recordInventoryTransaction(formData);
    if (!res.success) {
      alert(res.error);
    } else {
      setOpen(false);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-8 ${type === 'IN' ? 'border-cyan-200 text-cyan-700 hover:bg-cyan-50' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}`}
          >
            {type === "IN" ? <><ArrowUpRight className="w-3 h-3 mr-1" /> 入库补货</> : <><ArrowDownRight className="w-3 h-3 mr-1" /> 发放/出库</>}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <input type="hidden" name="itemId" value={item.id} />
          <input type="hidden" name="type" value={type} />
          
          <DialogHeader>
            <DialogTitle>{type === "IN" ? "入库进货" : "物品发放/消耗"} - {item.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">当前库存</Label>
              <div className="col-span-3 font-semibold">{item.quantity} {item.unit}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">数量</Label>
              <Input name="quantity" type="number" min="1" max={type === "OUT" ? item.quantity : undefined} defaultValue="1" className="col-span-3" required />
            </div>

             {type === "OUT" && students && (
                <div className={`grid grid-cols-4 items-center gap-4 ${studentId ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                  <Label className="text-right">领用学员</Label>
                  {studentId ? (
                    <div className="col-span-3">
                      <Input value={students.find(s => s.id === studentId)?.name || ''} disabled className="bg-slate-50 font-semibold h-9" />
                      <input type="hidden" name="studentId" value={studentId} />
                    </div>
                  ) : (
                    <select name="studentId" className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required>
                      <option value="">-- 非学员消耗 --</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  )}
                </div>
             )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">备注说明</Label>
              <Input name="remark" placeholder="非必填" className="col-span-3" />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading} className={type === "IN" ? "bg-cyan-600" : "bg-orange-600"}>
              {loading ? "执行中..." : "确认"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useTransition } from "react";

export function DeleteInventoryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPending) return;

    console.log("CLIENT: User clicked delete for item ID:", id);
    if (window.confirm("确定删除该库存台账项目吗？纯进销存的调拨记录将被清理，但凡是已绑定学员的领用/发放记录将继续保留以供查阅。此操作不可恢复。")) {
      console.log("CLIENT: Confirmation accepted. Starting transition...");
      startTransition(async () => {
        try {
          const res = await deleteInventoryItem(id);
          console.log("CLIENT: Server action result:", res);
          if (res.success) {
             // 成功由 revalidatePath 刷新
          } else {
            alert("删除失败：" + (res.error || "未知原因"));
          }
        } catch (err: any) {
          console.error("CLIENT: Critical error during delete action:", err);
          alert("删除操作发生网络或本地异常，请检查控制台");
        }
      });
    } else {
      console.log("CLIENT: Delete confirmation cancelled by user.");
    }
  };

  return (
    <Button 
      type="button"
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      disabled={isPending}
      className={`text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer ${isPending ? 'opacity-50' : ''}`}
      title="彻底删除"
    >
      <Trash2 className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
    </Button>
  );
}
