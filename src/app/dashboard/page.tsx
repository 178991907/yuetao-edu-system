import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, BookOpen, CircleDollarSign, TrendingUp, Presentation, Clock, ChevronRight, MessageSquare, Plus } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "../actions/dashboard"
import { DashboardCharts } from "../dashboard-charts"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const result = await getDashboardStats()
  const stats = result.success ? result.data : null

  if (!stats) {
    return <div className="p-10 text-center text-slate-500">数据加载失败，请检查数据库配置。</div>
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">阅陶管家 核心看板</h2>
          <p className="text-sm text-slate-500 mt-2">实时汇总在读、财务、沟通与库存的核心数据闭环图谱。</p>
        </div>
        <div className="flex gap-2">
           <Link href="/courses">
             <Button size="sm" variant="outline" className="rounded-xl border-slate-200">
               <BookOpen className="w-3.5 h-3.5 mr-1" /> 课程体系
             </Button>
           </Link>
           <Link href="/students">
             <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700">
               <Plus className="w-3.5 h-3.5 mr-1" /> 新生录入
             </Button>
           </Link>
        </div>
      </div>
      
      {/* 顶部统计卡片 */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { 
            title: "在读学员总数", 
            value: stats.activeStudentCount, 
            unit: "人", 
            trend: `+${stats.newStudentCount} 本月新增`, 
            icon: Users, 
            color: "blue",
            href: "/students" 
          },
          { 
            title: "本月学费总收入", 
            value: `¥ ${stats.totalIncome.toLocaleString()}`, 
            unit: "", 
            trend: "较上月 +12.5%", 
            icon: CircleDollarSign, 
            color: "emerald",
            href: "/finance" 
          },
          { 
            title: "本月运营开支", 
            value: `¥ ${stats.totalExpense.toLocaleString()}`, 
            unit: "", 
            trend: `占收入 ${(stats.totalIncome > 0 ? (stats.totalExpense / stats.totalIncome * 100).toFixed(0) : 0)}%`, 
            icon: Presentation, 
            color: "orange",
            href: "/finance" 
          },
          { 
            title: "近期新开设课程", 
            value: stats.coursesSummary.length, 
            unit: "个", 
            trend: "新增 1 门艺术类", 
            icon: BookOpen, 
            color: "purple",
            href: "/courses" 
          }
        ].map((card, idx) => (
          <Link href={card.href} key={idx}>
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur transition-all hover:shadow-md hover:-translate-y-1 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{card.title}</CardTitle>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors bg-${card.color}-50 group-hover:bg-${card.color}-100`}>
                   <card.icon className={`h-5 w-5 text-${card.color}-600`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {card.value} <span className="text-sm font-normal text-slate-500">{card.unit}</span>
                </div>
                <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${card.trend.includes('新增') ? 'text-blue-500' : 'text-emerald-500'}`}>
                  <TrendingUp className="h-3 w-3" /> {card.trend}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 图表展示区 */}
        <div className="lg:col-span-2">
          <DashboardCharts 
            pieData={stats.pieData} 
            trendData={stats.trendData}
            radarData={stats.radarData}
            scatterData={stats.scatterData}
          />
        </div>

        {/* 待跟进事项 */}
        <Card className="border-0 shadow-sm bg-white/80">
          <CardHeader className="py-4 border-b border-slate-50">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              待跟进家校沟通
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {stats.pendingCommunications.length > 0 ? (
              stats.pendingCommunications.map(comm => (
                <Link href={`/students/${comm.studentId}`} key={comm.id} className="block group">
                  <div className={`p-4 border rounded-xl transition-all ${
                    comm.priority === 'HIGH' ? 'border-orange-100 bg-orange-50/30 group-hover:bg-orange-50' : 'border-slate-50 group-hover:bg-slate-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        {comm.studentName} 家长
                        {comm.priority === 'HIGH' && (
                          <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-red-100">高优</span>
                        )}
                      </h4>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">{comm.content}</p>
                    <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" />
                      记录于 {new Date(comm.date).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-10 opacity-50 space-y-2">
                <p className="text-sm">暂时没有需要紧急跟进的事项</p>
                <p className="text-xs">沟通记录中包含“待跟进”关键字将显示在此处</p>
              </div>
            )}
            {stats.pendingCommunications.length > 0 && (
              <Link href="/students" className="block mt-4 text-center text-xs text-blue-600 font-medium hover:underline">
                查看所有学员沟通档案
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 近期收支流水 */}
        <Card className="border-0 shadow-sm bg-white/80">
          <CardHeader className="py-4 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CircleDollarSign className="w-4 h-4 text-blue-500" /> 
              近期收支明细流水
            </CardTitle>
            <Link href="/finance">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 rounded-lg">查看全部流水</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              {stats.recentTransactions.map((trx, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/80 transition-all border border-transparent hover:border-slate-100 group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">收</div>
                    <div>
                      <Link href={`/students/${trx.studentId}`} className="font-bold text-slate-800 hover:text-blue-600 transition-colors">
                        {trx.studentName}
                      </Link>
                      <span className="text-slate-400 mx-2 text-xs">录入了</span>
                      <span className="text-slate-600 text-xs font-medium">{trx.courseName}</span>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(trx.date).toLocaleString()} • {trx.method === 'ALIPAY' ? '支付宝' : trx.method === 'WECHAT' ? '微信' : '现金'}</p>
                    </div>
                  </div>
                  <div className="font-bold text-emerald-600 text-lg">+ ¥{trx.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 课程分类看板 */}
        <Card className="border-0 shadow-sm bg-white/80 overflow-hidden">
          <CardHeader className="py-4 border-b border-slate-50 flex flex-row justify-between items-center bg-fuchsia-50/30">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-fuchsia-500" /> 近期特色课程看板
            </CardTitle>
            <span className="px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-600 font-bold text-[10px]">NEW</span>
          </CardHeader>
          <div className="p-3 grid gap-3">
            {stats.coursesSummary.map(course => (
              <Link href={`/courses?id=${course.id}`} key={course.id}>
                <div className="p-4 rounded-xl border border-slate-100 bg-white hover:border-fuchsia-200 hover:shadow-sm transition-all group">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-fuchsia-700 transition-colors">{course.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-fuchsia-600 font-bold text-sm">¥ {course.price}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{course.totalSessions} 课时</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
