"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, RefreshCw, ShieldAlert, KeyRound } from "lucide-react";
import { initializeSystem } from "@/app/actions/system";

export function SystemInitDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInit = async () => {
    if (!password) {
      setError("请输入管理员密码确认操作");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await initializeSystem(password);
      if (result.success) {
        alert("系统已成功初始化，业务数据已清空。页面即将刷新。");
        window.location.reload();
      } else {
        setError(result.error || "初始化失败");
      }
    } catch (err) {
      setError("执行过程中发生异常");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-[0.98]">
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            系统初始化
          </button>
        }
      />
      <DialogContent className="sm:max-w-[500px] border-red-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="h-6 w-6" />
            系统深度初始化确认
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
            <div className="flex gap-3 text-red-700">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">
                此操作将从数据库中永久移除以下所有业务数据：
                <ul className="mt-2 ml-4 list-disc space-y-1 opacity-90">
                  <li>所有学员档案及基本信息</li>
                  <li>所有课程定义及报名记录</li>
                  <li>所有财务流水及支付记录</li>
                  <li>所有家校沟通日志与物资领用数据</li>
                  <li>所有问卷模板及回收的答卷</li>
                </ul>
                <p className="mt-4 font-black">警告：此操作不可撤销，数据一旦丢失无法恢复。</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm font-bold">
              <KeyRound className="h-4 w-4" />
              身份验证与授权
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">请输入管理员(admin)密码</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="请输入密码确认身份"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg border-slate-200 focus:ring-red-500/20 focus:border-red-500"
              />
              {error && <p className="text-xs text-red-600 font-bold mt-1">{error}</p>}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl h-12"
          >
            取消操作
          </Button>
          <Button
            onClick={handleInit}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-red-100"
          >
            {loading ? "正在重置数据库..." : "确认并执行初始化"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
