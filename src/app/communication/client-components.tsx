"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createCommunication, updateCommunication } from "../actions/communication";

export function CreateCommunicationDialog({ students, studentId }: { students: any[], studentId?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    await createCommunication(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            记录新沟通
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>登记家校沟通记录</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            <div className={`flex flex-col gap-2 ${studentId ? 'opacity-60 grayscale-[0.5]' : ''}`}>
              <Label htmlFor="studentId" className="font-medium text-slate-700">选择学员</Label>
              {studentId ? (
                <>
                  <Input value={students.find(s => s.id === studentId)?.name || ''} disabled className="h-11 bg-slate-50 font-semibold" />
                  <input type="hidden" name="studentId" value={studentId} />
                </>
              ) : (
                <select 
                  id="studentId"
                  name="studentId" 
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all" 
                  required
                >
                  <option value="">-- 请点击选择关联学员 --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date" className="font-medium text-slate-700">沟通日期</Label>
              <Input 
                id="date"
                name="date" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]} 
                className="h-11 rounded-lg border-slate-200" 
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-medium text-slate-700">老师反馈/课堂表现</Label>
              <textarea 
                name="teacherFeedback" 
                rows={3} 
                className="flex min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all" 
                placeholder="请详细记录学员在校表现、RAZ分级阅读情况等..."
                required
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-medium text-slate-700">家长诉求/提问 (选填)</Label>
              <textarea 
                name="parentRequest" 
                rows={2} 
                className="flex min-h-[70px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
                placeholder="记录家长反馈的问题或提出的建议..."
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-medium text-slate-700">后续方案/改进建议 (选填)</Label>
              <textarea 
                name="followUpPlan" 
                rows={2} 
                className="flex min-h-[70px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
                placeholder="针对反馈制定接下来的学习计划或改进方案..."
              ></textarea>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={loading} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 h-11 text-base font-semibold rounded-xl transition-all">
              {loading ? "保存中..." : "保存沟通记录"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditCommunicationDialog({ log }: { log: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    await updateCommunication(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50">
            <Edit className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>修改沟通记录</DialogTitle>
          </DialogHeader>
          <input type="hidden" name="id" value={log.id} />
          <input type="hidden" name="studentId" value={log.studentId} />
          <div className="flex flex-col gap-5 py-4">
            <div className="flex flex-col gap-2 opacity-60">
              <Label className="font-medium text-slate-700">关联学员</Label>
              <Input value={log.student?.name || '---'} disabled className="h-11 bg-slate-50 font-semibold" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-date" className="font-medium text-slate-700">沟通日期</Label>
              <Input 
                id="edit-date"
                name="date" 
                type="date" 
                defaultValue={new Date(log.date).toISOString().split('T')[0]} 
                className="h-11 rounded-lg border-slate-200" 
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-medium text-slate-700">老师反馈/课堂表现</Label>
              <textarea 
                name="teacherFeedback" 
                rows={3} 
                defaultValue={log.teacherFeedback}
                className="flex min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all" 
                required
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-medium text-slate-700">家长诉求/提问 (选填)</Label>
              <textarea 
                name="parentRequest" 
                rows={2} 
                defaultValue={log.parentRequest || ''}
                className="flex min-h-[70px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-medium text-slate-700">后续方案/改进建议 (选填)</Label>
              <textarea 
                name="followUpPlan" 
                rows={2} 
                defaultValue={log.followUpPlan || ''}
                className="flex min-h-[70px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
              ></textarea>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={loading} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 h-11 text-base font-semibold rounded-xl transition-all">
              {loading ? "更新中..." : "保存修改"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CollapsibleText({ text, maxLength = 60, className = "" }: { text: string; maxLength?: number; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || text === "-") return <span className="text-slate-400">-</span>;
  if (text.length <= maxLength) return <span className={className}>{text}</span>;

  return (
    <div className="group">
      <span className={className}>
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </span>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-1 text-fuchsia-600 hover:text-fuchsia-700 text-xs font-medium inline-flex items-center gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity"
      >
        {isExpanded ? (
          <>收起 <ChevronUp className="w-3 h-3" /></>
        ) : (
          <>展开全部 <ChevronDown className="w-3 h-3" /></>
        )}
      </button>
    </div>
  );
}
