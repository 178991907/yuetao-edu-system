"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, CircleDollarSign, MessageSquare, Package, ClipboardList, LogOut, UserCog, RefreshCw } from "lucide-react"
import { SystemInitDialog } from "./SystemInitDialog"

const navItems = [
  { title: "仪表盘", href: "/dashboard", icon: LayoutDashboard },
  { title: "学员管理", href: "/students", icon: Users },
  { title: "课程管理", href: "/courses", icon: BookOpen },
  { title: "财务收支", href: "/finance", icon: CircleDollarSign },
  { title: "家校沟通", href: "/communication", icon: MessageSquare },
  { title: "进销存管理", href: "/inventory", icon: Package },
  { title: "问卷管理", href: "/surveys-manage", icon: ClipboardList },
  { title: "教职账号", href: "/users", icon: UserCog },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white/50 backdrop-blur-xl">
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600 tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-lg">阅</span>
          </div>
          阅陶教育
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                isActive 
                  ? "bg-blue-50 text-blue-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-[0.98]"
        >
          <LogOut className="h-5 w-5" />
          退出登录
        </button>
        <div className="h-px bg-slate-100 my-1"></div>
        <SystemInitDialog />
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
          <h4 className="font-semibold text-xs tracking-wider uppercase opacity-80">系统状态</h4>
          <p className="mt-1 text-xs font-black truncate">v2.3.3 Pro</p>
          <div className="mt-4 h-1 w-full rounded-full bg-white/20">
            <div className="h-full w-2/3 rounded-full bg-white shadow-sm shadow-white/50"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
