"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createCourse, deleteCourse, updateCourse } from "../actions/course";

export function EditCourseDialog({ course }: { course: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const res = await updateCourse(course.id, formData);
    if (res.success) {
      setOpen(false);
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="link" className="h-auto p-0 text-indigo-600">编辑信息</Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>编辑课程信息</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                课程名称
              </Label>
              <Input id="edit-name" name="name" defaultValue={course.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                课程类型
              </Label>
              <Input id="edit-type" name="type" defaultValue={course.type} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                单价 (¥)
              </Label>
              <Input id="edit-price" name="price" type="number" step="0.01" defaultValue={course.price} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-totalSessions" className="text-right">
                总课时
              </Label>
              <Input id="edit-totalSessions" name="totalSessions" type="number" defaultValue={course.totalSessions} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                课程简介
              </Label>
              <Input id="edit-description" name="description" defaultValue={course.description || ""} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-indigo-600">
              {loading ? "更新中..." : "保存修改"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateCourseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    await createCourse(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            创建新课程
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>创建新课程</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                课程名称
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                课程类型
              </Label>
              <Input id="type" name="type" placeholder="如：COMPREHENSIVE / PHONICS" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                价格 (¥)
              </Label>
              <Input id="price" name="price" type="number" step="0.01" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalSessions" className="text-right">
                总课时数
              </Label>
              <Input id="totalSessions" name="totalSessions" type="number" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                课程简介
              </Label>
              <Input id="description" name="description" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存记录"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteCourseButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-2 h-auto p-1"
      disabled={loading}
      onClick={async () => {
        if (confirm("确定删除该课程吗？这可能会导致相关历史数据异常。")) {
          setLoading(true);
          const res = await deleteCourse(id);
          if (!res.success) {
            alert(res.error);
          }
          setLoading(false);
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
