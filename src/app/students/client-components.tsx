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
import { createStudent, deleteStudent } from "../actions/student";

export function CreateStudentDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 用于根据出生日期计算年龄
  const [birthDate, setBirthDate] = useState("");
  const calculatedAge = birthDate ? new Date().getFullYear() - new Date(birthDate).getFullYear() : "";

  // 用于控制家长关系是否为自定义
  const [relationType, setRelationType] = useState("");
  const [customRelation, setCustomRelation] = useState("");

  async function handleAction(formData: FormData) {
    setLoading(true);
    try {
      // 如果是自定义关系，将其覆盖表单中的 parentRelation 字段
      if (relationType === "custom") {
        formData.set("parentRelation", customRelation);
      } else {
        formData.set("parentRelation", relationType);
      }
      
      // 提交自动生成的年龄
      if (calculatedAge !== "") {
        formData.set("age", calculatedAge.toString());
      }

      const res = await createStudent(formData);
      
      if (res.success) {
        // 成功后重置所有本地状态
        setBirthDate("");
        setRelationType("");
        setCustomRelation("");
        setOpen(false);
        // 使用 setTimeout 确保在弹窗关闭动画后再提示，防止冲突
        setTimeout(() => alert("学员信息已成功保存！"), 100);
      } else {
        alert("保存失败: " + res.error);
      }
    } catch (e) {
      console.error(e);
      alert("系统错误，请检查后台日志");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all hover:shadow">
            <Plus className="mr-2 h-4 w-4" />
            新增学员
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleAction}>
          <DialogHeader>
            <DialogTitle>新增学员</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                中文姓名
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="englishName" className="text-right">
                英文名
              </Label>
              <Input id="englishName" name="englishName" className="col-span-3" placeholder="例如: Leo" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                性别
              </Label>
              <select name="gender" className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required>
                <option value="">请选择性别</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthDate" className="text-right">
                出生日期
              </Label>
              <div className="col-span-3 flex gap-2 items-center">
                <Input 
                  id="birthDate" 
                  name="birthDate" 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm text-slate-500 whitespace-nowrap min-w-[50px]">
                  {calculatedAge !== "" ? `${calculatedAge} 岁` : ""}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentRelation" className="text-right">家长关系</Label>
              <div className="col-span-3 flex gap-2">
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={relationType}
                  onChange={(e) => setRelationType(e.target.value)}
                  required
                >
                  <option value="">请选择关系</option>
                  <option value="爸爸">爸爸</option>
                  <option value="妈妈">妈妈</option>
                  <option value="爷爷">爷爷</option>
                  <option value="奶奶">奶奶</option>
                  <option value="custom">自定义内容...</option>
                </select>
                {relationType === "custom" && (
                  <Input 
                    placeholder="请输入关系" 
                    value={customRelation}
                    onChange={(e) => setCustomRelation(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentName" className="text-right">
                家长姓名
              </Label>
              <Input id="parentName" name="parentName" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentPhone" className="text-right">
                联系电话
              </Label>
              <Input id="parentPhone" name="parentPhone" className="col-span-3" />
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

export function DeleteStudentButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg ml-2"
      disabled={loading}
      onClick={async () => {
        if (confirm("确定删除该学员吗？此操作无法撤销。")) {
          setLoading(true);
          await deleteStudent(id);
          setLoading(false);
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
