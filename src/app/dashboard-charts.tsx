"use client"

import { useState } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  LayoutGrid, PieChart as PieChartIcon, TrendingUp, BarChart3, 
  Activity, Info, Focus, Layers, LineChart as LineChartIcon
} from "lucide-react"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e", "#64748b"]

type ChartProps = {
  pieData: { name: string; value: number }[];
  trendData: { month: string; "收入": number; "支出": number; "新增学员": number }[];
  radarData: { subject: string; A: number; fullMark: number }[];
  scatterData: { x: number; y: number; name: string }[];
}

export function DashboardCharts({ pieData, trendData, radarData, scatterData }: ChartProps) {
  const [activeTab, setActiveTab] = useState<"trend" | "proportion" | "comparison" | "radar" | "scatter">("trend")
  const [subType, setSubType] = useState<string>("line")

  const renderChart = () => {
    switch (activeTab) {
      case "trend":
        return subType === "line" ? (
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} width={40} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line type="monotone" dataKey="收入" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="支出" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: "#f43f5e" }} />
          </LineChart>
        ) : (
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} width={40} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
            <Area type="monotone" dataKey="收入" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
            <Area type="monotone" dataKey="支出" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
          </AreaChart>
        )
      case "comparison":
        return (
          <BarChart data={trendData} layout={subType === "bar" ? "horizontal" : "vertical"}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            {subType === "bar" ? (
              <>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} width={40} />
              </>
            ) : (
              <>
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis dataKey="month" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} width={60} />
              </>
            )}
            <Tooltip cursor={{ fill: "rgba(59, 130, 246, 0.05)" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="收入" fill="#3b82f6" radius={subType === "bar" ? [4, 4, 0, 0] : [0, 4, 4, 0]} barSize={24} />
            <Bar dataKey="支出" fill="#f43f5e" radius={subType === "bar" ? [4, 4, 0, 0] : [0, 4, 4, 0]} barSize={24} />
          </BarChart>
        )
      case "proportion":
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={subType === "pie" ? 0 : 60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        )
      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#64748b" }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
            <Radar name="得分" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
          </RadarChart>
        )
      case "scatter":
        return (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis type="number" dataKey="x" name="学员年龄" unit="岁" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis type="number" dataKey="y" name="缴费金额" unit="元" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: "12px", border: "none" }} />
            <Scatter name="学员分布" data={scatterData} fill="#3b82f6" />
          </ScatterChart>
        )
      default:
        return null
    }
  }

  return (
    <Card className="border-0 shadow-sm bg-white/80 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-5 border-b border-slate-50 bg-slate-50/30">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {activeTab === "trend" && <TrendingUp className="w-5 h-5 text-blue-500" />}
            {activeTab === "proportion" && <PieChartIcon className="w-5 h-5 text-emerald-500" />}
            {activeTab === "comparison" && <BarChart3 className="w-5 h-5 text-orange-500" />}
            {activeTab === "radar" && <Activity className="w-5 h-5 text-purple-500" />}
            {activeTab === "scatter" && <Focus className="w-5 h-5 text-fuchsia-500" />}
            {activeTab === "trend" ? "运营收支趋势概览" : 
             activeTab === "proportion" ? "本月支出结构占比" : 
             activeTab === "comparison" ? "月度收支对比分析" : 
             activeTab === "radar" ? "教务核心指标全景" : "学员消费相关性分析"}
          </CardTitle>
          <CardDescription>
            {activeTab === "trend" ? "通过折线/面积观察经营波动" : 
             activeTab === "proportion" ? "清晰透视各项成本分布" : 
             activeTab === "comparison" ? "直观对比盈亏平衡状态" : 
             activeTab === "radar" ? "多维度评估机构运行质量" : "挖掘年龄与消费能力的潜在联系"}
          </CardDescription>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1">
          {[
            { id: "trend", icon: LineChartIcon, label: "趋势", types: ["line", "area"] },
            { id: "proportion", icon: PieChartIcon, label: "占比", types: ["pie", "donut"] },
            { id: "comparison", icon: BarChart3, label: "对比", types: ["bar", "horizontal"] },
            { id: "radar", icon: Activity, label: "全景", types: ["radar"] },
            { id: "scatter", icon: Focus, label: "分析", types: ["scatter"] },
          ].map((tab) => (
            <Button 
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"} 
              size="sm" 
              className={`h-9 px-3 rounded-lg transition-all ${activeTab === tab.id ? "bg-white shadow-sm font-bold text-blue-600" : "text-slate-500"}`}
              onClick={() => {
                setActiveTab(tab.id as any)
                setSubType(tab.types[0])
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline ml-1.5 text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 relative">
          {/* 子类型切换器 */}
          {["trend", "proportion", "comparison"].includes(activeTab) && (
            <div className="absolute top-6 right-6 z-10 flex gap-2">
               {activeTab === "trend" && (
                 <>
                   <Button size="xs" variant={subType === "line" ? "outline" : "ghost"} onClick={() => setSubType("line")} className="text-[10px] h-6 px-2">折线图</Button>
                   <Button size="xs" variant={subType === "area" ? "outline" : "ghost"} onClick={() => setSubType("area")} className="text-[10px] h-6 px-2">面积图</Button>
                 </>
               )}
               {activeTab === "comparison" && (
                 <>
                   <Button size="xs" variant={subType === "bar" ? "outline" : "ghost"} onClick={() => setSubType("bar")} className="text-[10px] h-6 px-2">柱状图</Button>
                   <Button size="xs" variant={subType === "horizontal" ? "outline" : "ghost"} onClick={() => setSubType("horizontal")} className="text-[10px] h-6 px-2">条形图</Button>
                 </>
               )}
               {activeTab === "proportion" && (
                 <>
                   <Button size="xs" variant={subType === "pie" ? "outline" : "ghost"} onClick={() => setSubType("pie")} className="text-[10px] h-6 px-2">饼图</Button>
                   <Button size="xs" variant={subType === "donut" ? "outline" : "ghost"} onClick={() => setSubType("donut")} className="text-[10px] h-6 px-2">环形图</Button>
                 </>
               )}
            </div>
          )}

        <div className="h-[340px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart() || <div></div>}
          </ResponsiveContainer>
        </div>
        
        {/* 数据洞察脚标 */}
        <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
           <div className="flex gap-4">
             <span className="flex items-center gap-1"><Info className="w-3 h-3" /> 点击图表项可查看明细</span>
             <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> 数据每 10 分钟自动刷新</span>
           </div>
           <div className="font-medium text-slate-300 italic">Antigravity AI Engine Powered</div>
        </div>
      </CardContent>
    </Card>
  )
}
