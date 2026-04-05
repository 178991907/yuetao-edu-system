"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet, FileText, User, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { IncomeDialog, ExpenseDialog } from "./client-components"

interface FinanceClientProps {
  payments: any[]
  expenses: any[]
  students: any[]
  courses: any[]
  existingCategories: string[]
  studentId?: string
}

const expenseCategories = [
  { value: "", label: "全部类别" },
  { value: "SALARY", label: "教学薪资" },
  { value: "MATERIALS", label: "教具材料" },
  { value: "RENT", label: "场地租费" },
  { value: "UTILITIES", label: "物业水电" },
  { value: "OTHERS", label: "杂费" },
]

const paymentMethods = [
  { value: "", label: "全部方式" },
  { value: "WECHAT", label: "微信" },
  { value: "ALIPAY", label: "支付宝" },
  { value: "BANK", label: "银行卡" },
  { value: "CASH", label: "现金" },
]

export function FinanceClient({ payments, expenses, students, courses, existingCategories, studentId }: FinanceClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [incomeFilters, setIncomeFilters] = useState({
    studentId: studentId || searchParams.get("student") || "",
    courseId: searchParams.get("course") || "",
    method: searchParams.get("method") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  })
  
  const [expenseFilters, setExpenseFilters] = useState({
    category: searchParams.get("category") || "",
    startDate: searchParams.get("expStartDate") || "",
    endDate: searchParams.get("expEndDate") || "",
  })

  const filteredStudent = studentId ? students.find((s: any) => s.id === studentId) : null

  const applyIncomeFilters = (newFilters: Partial<typeof incomeFilters>) => {
    const updated = { ...incomeFilters, ...newFilters }
    setIncomeFilters(updated)
    const params = new URLSearchParams()
    if (updated.studentId) params.set("student", updated.studentId)
    if (updated.courseId) params.set("course", updated.courseId)
    if (updated.method) params.set("method", updated.method)
    if (updated.startDate) params.set("startDate", updated.startDate)
    if (updated.endDate) params.set("endDate", updated.endDate)
    router.push(`/finance?${params.toString()}`)
  }

  const applyExpenseFilters = (newFilters: Partial<typeof expenseFilters>) => {
    const updated = { ...expenseFilters, ...newFilters }
    setExpenseFilters(updated)
    const params = new URLSearchParams()
    if (studentId) params.set("student", studentId)
    if (updated.category) params.set("category", updated.category)
    if (updated.startDate) params.set("expStartDate", updated.startDate)
    if (updated.endDate) params.set("expEndDate", updated.endDate)
    router.push(`/finance?${params.toString()}`)
  }

  const clearFilters = (type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncomeFilters({ studentId: studentId || "", courseId: "", method: "", startDate: "", endDate: "" })
      router.push(studentId ? `/finance?student=${studentId}` : "/finance")
    } else {
      setExpenseFilters({ category: "", startDate: "", endDate: "" })
      router.push(studentId ? `/finance?student=${studentId}` : "/finance")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wallet className="h-6 w-6 text-emerald-500" />
            财务收支管理
          </h2>
          <p className="text-sm text-slate-500 mt-2">打卡登记与汇总阅陶教育的缴费、支出及运营成本。</p>
        </div>
      </div>

      {filteredStudent && (
        <Card className="border-0 shadow-sm bg-blue-50/50">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">学员档案专属财务详情：</span>
              <span className="font-semibold text-blue-800 text-lg">{filteredStudent.name}</span>
            </div>
            <Link href={`/students/${studentId}`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-4 w-4 mr-1" /> 返回档案
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="income" className="w-full">
        {!studentId && (
          <TabsList className="grid w-[400px] grid-cols-2 bg-slate-100/80 p-1 rounded-xl">
            <TabsTrigger value="income" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">学费与收入记录</TabsTrigger>
            <TabsTrigger value="expense" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">课程与运营支出</TabsTrigger>
          </TabsList>
        )}
        
        <TabsContent value="income" className="mt-6 space-y-4">
          {!studentId && (
            <Card className="border-0 shadow-sm bg-slate-50/50">
              <CardContent className="py-3 flex flex-wrap items-center gap-3">
                <select 
                  value={incomeFilters.studentId}
                  onChange={(e) => applyIncomeFilters({ studentId: e.target.value })}
                  className="h-8 rounded-lg border border-slate-200 px-2 text-sm bg-white"
                >
                  <option value="">全部学员</option>
                  {students.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <select 
                  value={incomeFilters.courseId}
                  onChange={(e) => applyIncomeFilters({ courseId: e.target.value })}
                  className="h-8 rounded-lg border border-slate-200 px-2 text-sm bg-white"
                >
                  <option value="">全部课程</option>
                  {courses.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select 
                  value={incomeFilters.method}
                  onChange={(e) => applyIncomeFilters({ method: e.target.value })}
                  className="h-8 rounded-lg border border-slate-200 px-2 text-sm bg-white"
                >
                  {paymentMethods.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <Input 
                  type="date" 
                  value={incomeFilters.startDate}
                  onChange={(e) => applyIncomeFilters({ startDate: e.target.value })}
                  className="h-8 w-36 rounded-lg"
                  placeholder="开始日期"
                />
                <span className="text-slate-400">至</span>
                <Input 
                  type="date" 
                  value={incomeFilters.endDate}
                  onChange={(e) => applyIncomeFilters({ endDate: e.target.value })}
                  className="h-8 w-36 rounded-lg"
                  placeholder="结束日期"
                />
                <Button variant="ghost" size="sm" onClick={() => clearFilters('income')} className="text-slate-500">
                  <X className="h-4 w-4 mr-1" /> 清除
                </Button>
              </CardContent>
            </Card>
          )}
          
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" /> 学员缴费记录报表
                <span className="text-sm font-normal text-slate-400 ml-2">({payments.length}条)</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <IncomeDialog students={students} courses={courses} studentId={studentId} />
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">导出报表</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-emerald-50/50">
                  <TableRow>
                    <TableHead className="w-[120px] pl-6 font-semibold">缴费日期</TableHead>
                    <TableHead className="font-semibold">学员姓名</TableHead>
                    <TableHead className="font-semibold">缴费课程</TableHead>
                    <TableHead className="font-semibold">金额 (¥)</TableHead>
                    <TableHead className="font-semibold">支付方式</TableHead>
                    <TableHead className="font-semibold">明细备注</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((row: any) => (
                    <TableRow key={row.id} className="hover:bg-emerald-50/30 transition-colors">
                      <TableCell className="pl-6 text-slate-500">{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium text-slate-800">{row.student?.name || '未知学员'}</TableCell>
                      <TableCell className="text-blue-600 font-medium">{row.course?.name || '---'}</TableCell>
                      <TableCell className="font-bold text-emerald-600">+{row.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-500">
                        {row.method === 'WECHAT' && '微信'}
                        {row.method === 'ALIPAY' && '支付宝'}
                        {row.method === 'BANK' && '银行卡'}
                        {row.method === 'CASH' && '现金'}
                      </TableCell>
                      <TableCell className="text-slate-500">{row.remark || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">暂无缴费记录</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expense" className="mt-6 space-y-4">
          <Card className="border-0 shadow-sm bg-slate-50/50">
            <CardContent className="py-3 flex flex-wrap items-center gap-3">
              <select 
                value={expenseFilters.category}
                onChange={(e) => applyExpenseFilters({ category: e.target.value })}
                className="h-8 rounded-lg border border-slate-200 px-2 text-sm bg-white"
              >
                {expenseCategories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <Input 
                type="date" 
                value={expenseFilters.startDate}
                onChange={(e) => applyExpenseFilters({ startDate: e.target.value })}
                className="h-8 w-36 rounded-lg"
                placeholder="开始日期"
              />
              <span className="text-slate-400">至</span>
              <Input 
                type="date" 
                value={expenseFilters.endDate}
                onChange={(e) => applyExpenseFilters({ endDate: e.target.value })}
                className="h-8 w-36 rounded-lg"
                placeholder="结束日期"
              />
              <Button variant="ghost" size="sm" onClick={() => clearFilters('expense')} className="text-slate-500">
                <X className="h-4 w-4 mr-1" /> 清除
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-600" /> 支出流水账
                <span className="text-sm font-normal text-slate-400 ml-2">({expenses.length}条)</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <ExpenseDialog existingCategories={existingCategories} />
                <Button size="sm" variant="outline" className="rounded-lg border-orange-200 text-orange-700 hover:bg-orange-50">导出报表</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-orange-50/50">
                  <TableRow>
                    <TableHead className="w-[120px] pl-6 font-semibold">日期</TableHead>
                    <TableHead className="font-semibold">支出分类</TableHead>
                    <TableHead className="font-semibold">金额 (¥)</TableHead>
                    <TableHead className="font-semibold">明细描述/对象</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((row: any) => (
                    <TableRow key={row.id} className="hover:bg-orange-50/30 transition-colors">
                      <TableCell className="pl-6 text-slate-500">{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${['UTILITIES', 'RENT'].includes(row.category) ? 'bg-slate-100 text-slate-700' : 'bg-orange-100 text-orange-700'}`}>
                          {row.category === 'SALARY' && '教学薪资'}
                          {row.category === 'MATERIALS' && '教具材料'}
                          {row.category === 'RENT' && '场地租费'}
                          {row.category === 'UTILITIES' && '物业水电'}
                          {row.category === 'OTHERS' && '杂费'}
                          {!['SALARY', 'MATERIALS', 'RENT', 'UTILITIES', 'OTHERS'].includes(row.category) && row.category}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-red-600">-{row.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-700">{row.description}</TableCell>
                    </TableRow>
                  ))}
                  {expenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-500">暂无支出记录</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
