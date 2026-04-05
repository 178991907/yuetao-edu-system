"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { School, GraduationCap, Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"ADMIN" | "TEACHER">("ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.success) {
      // 模拟登录态存储
      localStorage.setItem("user", JSON.stringify(result.user));
      router.push("/dashboard");
    } else {
      setError(result.error || "登录失败");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* 背景图层 */}
      <div 
        className="absolute inset-0 z-0 scale-105"
        style={{ 
          backgroundImage: 'url("/images/login-bg.png")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px) brightness(0.8)'
        }}
      />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900/60 z-10" />

      <Card className="relative z-20 w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-xl rounded-[2rem] overflow-hidden">
        <div className="h-2 bg-blue-600 w-full" />
        <CardHeader className="pt-10 pb-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-blue-200">
              阅
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-slate-900">欢迎回来</CardTitle>
          <CardDescription className="text-slate-500 mt-2 font-medium italic">
            阅陶管家 · 数字化教务管理
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          {/* 角色切换 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setRole("ADMIN")}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                role === "ADMIN" 
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
                  : "border-slate-100 bg-slate-50 text-slate-400 grayscale hover:grayscale-0"
              }`}
            >
              <School className="w-6 h-6" />
              <span className="text-xs font-bold">机构管理</span>
            </button>
            <button
              onClick={() => setRole("TEACHER")}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                role === "TEACHER" 
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
                  : "border-slate-100 bg-slate-50 text-slate-400 grayscale hover:grayscale-0"
              }`}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-xs font-bold">个人教师</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 font-semibold ml-1">用户名 / 手机号</Label>
              <div className="relative group">
                <div className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <Input
                  id="username"
                  name="username"
                  placeholder={role === "ADMIN" ? "admin" : "teacher"}
                  required
                  className="pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 bg-slate-50/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-slate-700 font-semibold">登录密码</Label>
                <button type="button" className="text-xs text-blue-600 hover:underline font-medium">忘记密码？</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="请输入 123 结尾的测试密码"
                  required
                  className="pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 bg-slate-50/50 transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="flex flex-col gap-1 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 animate-shake">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-bold">服务反馈</span>
                </div>
                <p className="text-xs opacity-80 pl-6">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  确认登录 <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-8 font-medium">
             测试说明：Admin 密码 admin123 / Teacher 密码 teacher123
          </p>
        </CardContent>
      </Card>
      
      {/* 底部版权 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">
        Yuetao Edu Management System 2.0
      </div>
    </div>
  );
}
