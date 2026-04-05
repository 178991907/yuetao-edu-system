"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import React from "react"
import { LogOut, User, Settings } from "lucide-react"

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  
  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // 对于分发出去填写的调查表，导航页，以及登录页，隐藏后台管理的侧边栏
  if (pathname === "/" || pathname === "/login" || pathname.includes("/surveys/parent") || pathname.includes("/surveys/english-level")) {
    return <main className="min-h-screen bg-slate-50/50">{children}</main>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden overflow-y-auto">
        <header className="h-16 shrink-0 border-b bg-white/50 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50 transition-all">
          <h1 className="text-lg font-semibold text-slate-800">管理中心</h1>
          <div className="flex items-center gap-4 relative">
            <div className="text-sm text-slate-500 hidden sm:block">欢迎回来，校长</div>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors shadow-sm active:scale-95"
            >
              阅
            </button>

            {/* 个人中心弹出菜单 */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 top-12 w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-2xl z-50 p-2 animate-in fade-in zoom-in duration-200">
                  <div className="px-3 py-2 mb-2 border-b border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">当前登录</p>
                    <p className="text-sm font-black text-slate-700">阅陶校长 (Admin)</p>
                  </div>
                  <button 
                    onClick={() => { router.push("/users"); setShowProfileMenu(false); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4" /> 个人资料
                  </button>
                  <button 
                    onClick={() => { router.push("/users"); setShowProfileMenu(false); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> 账户设置
                  </button>
                  <div className="h-px bg-slate-50 my-2 mx-2" />
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> 退出登录
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
