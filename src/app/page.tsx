import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Users, BookOpen, CircleDollarSign, ShieldCheck, 
  Zap, Star, LayoutDashboard, MessageSquare, Package, 
  ArrowRight, CheckCircle2, GraduationCap, School, TrendingUp
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 顶部导航 */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3 group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">阅</div>
          <span className="font-extrabold text-2xl tracking-tighter text-slate-900">阅陶管家</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
          <Link className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden md:block" href="#features">
            功能特性
          </Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden md:block" href="#audiences">
            适用对象
          </Link>
          <Link href="/login">
            <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100">
              立即登录系统 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center relative z-10">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold tracking-wide animate-bounce">
                  NEW: v2.3.3 稳定性增强版本已上线
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                  为教育者而生，<br />打造极致高效的教学管理
                </h1>
                <p className="mx-auto max-w-[800px] text-slate-500 md:text-xl/relaxed lg:text-2xl/relaxed font-medium">
                  阅陶管家是专为培训机构与个人教师设计的数字化管理闭环系统。从学员录入到物资分析，让教务管理不再繁琐。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="h-14 px-10 text-lg rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200">
                    进入管理系统
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-2xl border-slate-200 hover:bg-slate-50">
                  查看演示 Demo
                </Button>
              </div>
              <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-5 w-5" /> <span>私有化本地存储</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5" /> <span>极速秒开体验</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <LayoutDashboard className="h-5 w-5" /> <span>可视化数据指标</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-5 w-5" /> <span>极简交互设计</span>
                </div>
              </div>
            </div>
          </div>
          {/* 背景装饰 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/20 rounded-full blur-3xl -z-10" />
        </section>

        {/* 功能特性展示 */}
        <section id="features" className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">六大核心模块，撑起您的教务理想</h2>
              <p className="text-slate-500 max-w-[600px] mx-auto text-lg">基于 500+ 教育场景深度调研，打磨每一处管理细节。</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "全能学员档案",
                  desc: "从录入、缴费到日常沟通，360度全生命周期记录，让每一个孩子的发展都有迹可循。",
                  color: "bg-blue-50 text-blue-600"
                },
                {
                  icon: BookOpen,
                  title: "课程体系闭环",
                  desc: "支持排课管理与特色课程名片展示。包含课时费、总 sessions 以及课程详情预览。",
                  color: "bg-purple-50 text-purple-600"
                },
                {
                  icon: CircleDollarSign,
                  title: "精细财务中心",
                  desc: "月度收支流水、学费收入自动核算，八种专业图表提供深度盈利分析。支持 Excel 导出。",
                  color: "bg-emerald-50 text-emerald-600"
                },
                {
                  icon: MessageSquare,
                  title: "家校智能沟通",
                  desc: "不仅有电子调查问卷，更有核心“待跟进提醒”功能。自动捕捉家长诉求，决不漏掉一个细节。",
                  color: "bg-orange-50 text-orange-600"
                },
                {
                  icon: Package,
                  title: "物资进销存",
                  desc: "教具领用、库存余量预警。让机构的每一笔物资成本都能精确对应到具体学员与日期。",
                  color: "bg-pink-50 text-pink-600"
                },
                {
                  icon: TrendingUp,
                  title: "经营决策大脑",
                  desc: "实时仪表盘动态监测在读人数、新增率、教务效能。让校长通过数据看清校区未来。",
                  color: "bg-indigo-50 text-indigo-600"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all">
                  <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 适用对象 */}
        <section id="audiences" className="w-full py-20 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">谁在使用阅陶管家？</h2>
                <div className="space-y-6">
                  <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <School className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-slate-900">中小型培训机构</h4>
                      <p className="text-slate-500 mb-4">帮助校长从繁琐的表格中解脱，自动化统计人力成本、学费结转与耗课记录。支持多角色管理，快速构建标准校区管理流。</p>
                      <div className="flex gap-2 flex-wrap">
                        {["多课时排课", "团队绩效汇总", "物资成本核算"].map(t => <span key={t} className="text-[10px] px-2 py-1 bg-slate-100 rounded-md font-bold text-slate-400"># {t}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-slate-900">个人独立教师 / 工作室</h4>
                      <p className="text-slate-500 mb-4">极轻量级的部署方案。一位老师、一台电脑即可掌握所有学生学情，省掉昂贵的 SaaS 平台费用，本地数据存储更安全、更专注。</p>
                      <div className="flex gap-2 flex-wrap">
                        {["微信沟通回访", "学员档案闭环", "个人财务记账"].map(t => <span key={t} className="text-[10px] px-2 py-1 bg-slate-100 rounded-md font-bold text-slate-400"># {t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative p-2 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-3xl">
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl z-10 animate-bounce">
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                     <span className="font-bold text-sm">v2.3.3 核心闭环已就绪</span>
                   </div>
                </div>
                <div className="bg-slate-900 rounded-[22px] overflow-hidden shadow-2xl h-[400px] flex items-center justify-center p-8 group">
                   <div className="text-center space-y-6">
                      <div className="h-24 w-24 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-1000">
                        <Users className="text-white h-10 w-10" />
                      </div>
                      <h3 className="text-white text-2xl font-bold tracking-widest">DIGITAL TWIN</h3>
                      <div className="space-y-2 opacity-50">
                        <div className="h-1 w-48 bg-slate-700 rounded-full mx-auto" />
                        <div className="h-1 w-32 bg-slate-700 rounded-full mx-auto" />
                      </div>
                      <Link href="/login">
                        <Button className="mt-8 bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-10 h-12 font-bold uppercase transition-all hover:tracking-[0.2em]">
                          开启管家模式
                        </Button>
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 底部 CTA */}
        <section className="w-full py-20 bg-blue-600">
           <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold text-white md:text-5xl">准备好提升您的管理效能了吗？</h2>
              <p className="text-blue-100 text-lg max-w-[600px] mx-auto">无需复杂的配置，下载或拷贝项目即刻运行。让阅陶管家成为您的贴身助手。</p>
              <Link href="/login">
                <Button size="lg" className="h-14 px-12 text-lg rounded-2xl bg-white text-blue-600 hover:bg-blue-50 shadow-xl shadow-blue-800/20 font-bold">
                  进入系统 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
           </div>
        </section>
      </main>

      <footer className="w-full py-12 px-4 border-t border-slate-50 text-center text-slate-400">
        <p className="text-sm font-medium">© 2026 阅陶教育培训管理系统. Designed for Excellence.</p>
        <div className="mt-4 flex justify-center gap-6">
           <Link href="#" className="hover:text-blue-600 transition-colors">隐私政策</Link>
           <Link href="#" className="hover:text-blue-600 transition-colors">技术支持</Link>
           <Link href="#" className="hover:text-blue-600 transition-colors">意见反馈</Link>
        </div>
      </footer>
    </div>
  )
}
