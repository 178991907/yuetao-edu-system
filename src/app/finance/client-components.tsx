"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createPayment, createExpense } from "../actions/finance";

export function IncomeDialog({ students, courses, studentId }: { students: any[], courses: any[], studentId?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    await createPayment(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <ArrowDownRight className="mr-2 h-4 w-4" /> 记一笔收入
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>登记学费/收入</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className={`grid grid-cols-4 items-center gap-4 ${studentId ? 'opacity-60 grayscale-[0.5]' : ''}`}>
              <Label className="text-right">选择学员</Label>
              {studentId ? (
                <div className="col-span-3">
                  <Input value={students.find(s => s.id === studentId)?.name || ''} disabled className="bg-slate-50 font-semibold" />
                  <input type="hidden" name="studentId" value={studentId} />
                </div>
              ) : (
                <select name="studentId" className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required>
                  <option value="">-- 请选择 --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">报读课程</Label>
              <select name="courseId" className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                <option value="">-- 无对应课程 / 杂项收入 --</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">金额 (¥)</Label>
              <Input name="amount" type="number" step="0.01" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">支付方式</Label>
              <select name="method" className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required>
                <option value="WECHAT">微信支付</option>
                <option value="ALIPAY">支付宝</option>
                <option value="BANK">银行转账</option>
                <option value="CASH">现金</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">收款日期</Label>
              <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "提交中..." : "确认收款"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ExpenseDialog({ existingCategories = [] }: { existingCategories?: string[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [categoryType, setCategoryType] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const baseCategories = ["SALARY", "MATERIALS", "RENT", "UTILITIES", "OTHERS"];
  const displayCategories = Array.from(new Set([...baseCategories, ...existingCategories]))
    .filter(c => c !== "custom");

  const getCategoryName = (c: string) => {
    switch(c) {
      case 'SALARY': return '教学薪资';
      case 'MATERIALS': return '教具材料';
      case 'RENT': return '场地租费';
      case 'UTILITIES': return '物业水电';
      case 'OTHERS': return '杂费';
      default: return c;
    }
  };

  async function onSubmit(formData: FormData) {
    setLoading(true);
    if (categoryType === "custom") {
      formData.set("category", customCategory);
    } else {
      formData.set("category", categoryType);
    }
    await createExpense(formData);
    setLoading(false);
    setOpen(false);
    setCategoryType("");
    setCustomCategory("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50">
            <ArrowUpRight className="mr-2 h-4 w-4" /> 记一笔支出
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>记录支出明细</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">支出类别</Label>
              <div className="col-span-3 flex flex-col gap-2">
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  required
                >
                  <option value="">-- 请选择 --</option>
                  {displayCategories.map(cat => (
                    <option key={cat} value={cat}>{getCategoryName(cat)}</option>
                  ))}
                  <option value="custom" className="text-orange-600 font-bold">+ 自定义类别...</option>
                </select>
                {categoryType === "custom" && (
                  <Input 
                    placeholder="请输入新支出类别" 
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">金额 (¥)</Label>
              <Input name="amount" type="number" step="0.01" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">日期</Label>
              <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">明细/对象</Label>
              <Input max={100} name="description" placeholder="如：结算XX老师本月报酬" className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? "提交中..." : "确认记录"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
