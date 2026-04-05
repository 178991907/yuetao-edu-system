"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, CreditCard, MessageSquare, Package, ClipboardList, Download, FileText, Plus, Clock } from "lucide-react"
import Link from "next/link"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

import { updateStudent } from "../../actions/student"
import { upsertEnrollment } from "../../actions/course"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function EditStudentDialog({ student }: { student: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    const res = await updateStudent(student.id, formData);
    setLoading(false);
    if (res.success) {
      setOpen(false);
    } else {
      alert(res.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold px-3 rounded-lg">
            编辑信息
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <form action={handleAction}>
          <DialogHeader>
            <DialogTitle>编辑学员基本信息</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">学员姓名</Label>
                <Input id="name" name="name" defaultValue={student.name} required className="h-11 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="englishName">英文名</Label>
                <Input id="englishName" name="englishName" defaultValue={student.englishName || ""} className="h-11 rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">性别</Label>
                <select name="gender" defaultValue={student.gender || ""} className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="">点击选择...</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">出生日期</Label>
                <Input id="birthDate" name="birthDate" type="date" defaultValue={student.birthDate ? new Date(student.birthDate).toISOString().split('T')[0] : ""} className="h-11 rounded-lg" />
              </div>
            </div>

            <div className="h-px bg-slate-100 my-1"></div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">家长与联系人信息</div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentRelation">家长关系</Label>
                <Input id="parentRelation" name="parentRelation" placeholder="如：妈妈" defaultValue={student.parentRelation || ""} className="h-11 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentName">家长姓名</Label>
                <Input id="parentName" name="parentName" defaultValue={student.parentName || ""} className="h-11 rounded-lg" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentPhone">联系电话</Label>
              <Input id="parentPhone" name="parentPhone" defaultValue={student.parentPhone || ""} className="h-11 rounded-lg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">功能/业务备注</Label>
              <textarea 
                id="remarks" 
                name="remarks" 
                rows={3}
                defaultValue={student.remarks || ""}
                className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="在此输入学员相关的特殊备注信息..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 transition-all active:scale-[0.98]">
              {loading ? "正在同步更改..." : "保存基本信息"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EnrollDialog({ student, allCourses, enrollment }: { student: any, allCourses: any[], enrollment?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    formData.set("studentId", student.id);
    const res = await upsertEnrollment(enrollment?.id || null, formData);
    setLoading(false);
    if (res.success) {
      setOpen(false);
    } else {
      alert(res.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          enrollment ? (
            <Button variant="link" className="h-auto p-0 text-blue-600 hover:no-underline font-medium">修改设置</Button>
          ) : (
            <Button size="sm" variant="outline" className="rounded-lg h-8 border-blue-200 text-blue-700 hover:bg-blue-50">
              <Plus className="mr-1 h-3 w-3" /> 办理报名
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleAction}>
          <DialogHeader>
            <DialogTitle>{enrollment ? '修改排课安排' : '办理课程报名'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">选择课程</Label>
              {enrollment ? (
                <div className="p-2 px-3 bg-slate-50 rounded-lg border border-slate-100 text-sm font-semibold text-slate-700">{enrollment.course.name}</div>
              ) : (
                <select name="courseId" className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" required>
                  <option value="">点击选择课程...</option>
                  {allCourses.map(c => <option key={c.id} value={c.id}>{c.name} (共{c.totalSessions}节)</option>)}
                </select>
              )}
              {enrollment && <input type="hidden" name="courseId" value={enrollment.courseId} />}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="remainingSessions">剩余课时计数</Label>
                <Input id="remainingSessions" name="remainingSessions" type="number" className="h-11 rounded-lg" defaultValue={enrollment?.remainingSessions || 48} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">报名状态</Label>
                <select name="status" className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" defaultValue={enrollment?.status || "ACTIVE"}>
                  <option value="ACTIVE">在读</option>
                  <option value="COMPLETED">已结课</option>
                  <option value="DROPPED">已退课</option>
                </select>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-1"></div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">排课与上课安排</div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weeklyFrequency">每周几次课</Label>
                <Input id="weeklyFrequency" name="weeklyFrequency" type="number" className="h-11 rounded-lg" placeholder="如: 2" defaultValue={enrollment?.weeklyFrequency || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionsPerTime">每次课时消耗</Label>
                <Input id="sessionsPerTime" name="sessionsPerTime" type="number" className="h-11 rounded-lg" defaultValue={enrollment?.sessionsPerTime || 1} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduleDescription">详细上课安排 (周几/时间)</Label>
              <textarea 
                id="scheduleDescription" 
                name="scheduleDescription" 
                rows={2}
                className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="例如：每周三 18:30, 周六 14:00"
                defaultValue={enrollment?.scheduleDescription || ""}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold">
              {loading ? "正在保存..." : "提交排课设置"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function StudentProfileClient({ student, allCourses }: { student: any, allCourses: any[] }) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()
    
    // 1. 基本信息
    const baseInfo = [
      ["字段", "内容"],
      ["姓名", student.name],
      ["英文名", student.englishName || "-"],
      ["性别", student.gender === 'male' ? '男' : student.gender === 'female' ? '女' : '-'],
      ["年龄", student.birthDate ? `${new Date().getFullYear() - new Date(student.birthDate).getFullYear()}岁` : (student.age ? `${student.age}岁` : '-')],
      ["首次报名日", new Date(student.enrollmentDate).toLocaleDateString()],
      ["家长姓名", student.parentName || "-"],
      ["联系电话", student.parentPhone || "-"],
      ["状态", student.status === 'ACTIVE' ? '在读' : '历史']
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(baseInfo), "基本信息")

    // 2. 缴费记录
    if (student.payments.length > 0) {
      const paymentData = student.payments.map((p: any) => ({
        "日期": new Date(p.date).toLocaleDateString(),
        "金额": p.amount,
        "课程": p.course?.name || "-",
        "方式": p.method,
        "备注": p.remark || "-"
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(paymentData), "缴费记录")
    }

    // 3. 沟通记录
    if (student.communications.length > 0) {
      const commData = student.communications.map((c: any) => ({
        "日期": new Date(c.date).toLocaleDateString(),
        "教师反馈": c.teacherFeedback,
        "家长诉求": c.parentRequest || "-",
        "后续方案": c.followUpPlan || "-"
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(commData), "沟通记录")
    }

    // 4. 物资领用
    if (student.inventoryTransactions.length > 0) {
      const invData = student.inventoryTransactions.map((t: any) => ({
        "日期": new Date(t.date).toLocaleDateString(),
        "物品": t.itemName || "-",
        "类型": t.type === 'IN' ? '领取' : '归还',
        "数量": t.quantity,
        "备注": t.remark || "-"
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invData), "物资领用")
    }

    XLSX.writeFile(wb, `学员档案_${student.name}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/students">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">学员档案</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={exportToExcel}
          >
            <Download className="mr-2 h-4 w-4" /> 导出 Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 基本信息卡片 */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">基本信息</CardTitle>
              <EditStudentDialog student={student} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">学员姓名</div>
                <div className="text-lg font-semibold text-slate-800 mt-1">
                  {student.name}
                  {student.englishName && <span className="ml-2 text-slate-400 font-normal">({student.englishName})</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">性别</div>
                  <div className="text-slate-700 mt-1">{student.gender === 'male' ? '男' : student.gender === 'female' ? '女' : '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">年龄</div>
                  <div className="text-slate-700 mt-1">
                    {student.birthDate 
                      ? `${new Date().getFullYear() - new Date(student.birthDate).getFullYear()}岁` 
                      : (student.age ? `${student.age}岁` : '-')}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">首次报名日</div>
                  <div className="text-slate-700 mt-1">{new Date(student.enrollmentDate).getFullYear()}/{new Date(student.enrollmentDate).getMonth() + 1}/{new Date(student.enrollmentDate).getDate()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">状态</div>
                <div className="mt-1">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                    student.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                      : 'bg-slate-50 text-slate-700 border-slate-200/50'
                  }`}>
                    {student.status === 'ACTIVE' ? '在读' : '历史'}
                  </span>
                </div>
              </div>
              <div className="h-px bg-slate-100 my-4"></div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">家长信息</div>
                <div className="text-slate-700 mt-1">{student.parentName || '-'}</div>
                <div className="text-sm text-slate-500">{student.parentRelation || ''} {student.parentRelation && student.parentPhone ? ' | ' : ''} {student.parentPhone || ''}</div>
              </div>
              <div className="h-px bg-slate-100 my-4"></div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide flex items-center justify-between">
                  业务备注
                  <ClipboardList className="h-3 w-3 text-slate-300" />
                </div>
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 min-h-[80px] whitespace-pre-wrap leading-relaxed">
                  {student.remarks || <span className="text-slate-300 italic">暂无学员业务备注</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* 课程报名 */}
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  课程报名
                </div>
                <EnrollDialog student={student} allCourses={allCourses} />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {student.enrollments && student.enrollments.length > 0 ? (
                  student.enrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="px-6 py-5 hover:bg-slate-50/80 transition-all border-l-4 border-transparent hover:border-blue-500">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-800 text-lg">{enrollment.course.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              enrollment.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {enrollment.status === 'ACTIVE' ? '在读' : enrollment.status === 'COMPLETED' ? '已结课' : '异常'}
                            </span>
                          </div>
                          
                          {/* 排课明细渲染 */}
                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                            <div className="flex items-center text-sm text-slate-500">
                              <ClipboardList className="h-4 w-4 mr-1.5 text-blue-400" />
                              <span>剩余课时: <span className="font-bold text-blue-600">{enrollment.remainingSessions}</span> / {enrollment.course.totalSessions} 节</span>
                            </div>
                            
                            {(enrollment.weeklyFrequency || enrollment.scheduleDescription) && (
                              <div className="flex items-center text-sm text-slate-500">
                                <Clock className="h-4 w-4 mr-1.5 text-orange-400" />
                                <span className="flex items-center gap-1.5">
                                  {enrollment.weeklyFrequency && (
                                    <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[11px] font-bold border border-orange-100">
                                      每周 {enrollment.weeklyFrequency} 次
                                    </span>
                                  )}
                                  {enrollment.sessionsPerTime > 1 && (
                                    <span className="text-slate-400 text-xs">(每次 {enrollment.sessionsPerTime} 课时)</span>
                                  )}
                                  {enrollment.scheduleDescription && (
                                    <span className="text-slate-600 font-medium ml-1">
                                      {enrollment.scheduleDescription}
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <EnrollDialog student={student} allCourses={allCourses} enrollment={enrollment} />
                          <span className="text-[10px] text-slate-400">报名于 {new Date(enrollment.createdAt).getFullYear()}/{new Date(enrollment.createdAt).getMonth() + 1}/{new Date(enrollment.createdAt).getDate()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-slate-400">暂无课程报名记录</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 缴费记录 */}
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                缴费记录
              </CardTitle>
              <Link href={`/finance?student=${student.id}`}>
                <Button size="sm" variant="outline" className="rounded-lg">查看财务</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {student.payments.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {student.payments.map((payment: any) => (
                    <Link href={`/finance?student=${student.id}`} key={payment.id} className="block px-6 py-4 hover:bg-slate-50 border-b border-transparent hover:border-emerald-100 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-800">¥{payment.amount}</div>
                          <div className="text-sm text-slate-500">{payment.method}</div>
                          {payment.course && <div className="text-xs text-slate-400">课程: {payment.course.name}</div>}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">{new Date(payment.date).getFullYear()}/{new Date(payment.date).getMonth() + 1}/{new Date(payment.date).getDate()}</div>
                          {payment.remark && <div className="text-xs text-slate-400 mt-1">{payment.remark}</div>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">
                  暂无缴费记录
                </div>
              )}
            </CardContent>
          </Card>

          {/* 家校沟通 */}
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                家校沟通
              </CardTitle>
              <Link href={`/communication?student=${student.id}`}>
                <Button size="sm" variant="outline" className="rounded-lg">查看沟通记录</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {student.communications.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {student.communications.slice(0, 5).map((comm: any) => (
                    <Link href={`/communication?student=${student.id}`} key={comm.id} className="block px-6 py-4 hover:bg-slate-50 border-b border-transparent hover:border-purple-100 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">教师反馈</div>
                          <div className="text-sm text-slate-600 mt-1 line-clamp-2">{comm.teacherFeedback}</div>
                          {comm.parentRequest && (
                            <div className="mt-2 text-sm text-slate-500">
                              <span className="font-medium">家长诉求:</span> {comm.parentRequest}
                            </div>
                          )}
                        </div>
                        <div className="text-right text-sm text-slate-400">
                          {new Date(comm.date).getFullYear()}/{new Date(comm.date).getMonth() + 1}/{new Date(comm.date).getDate()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">
                  暂无沟通记录
                </div>
              )}
            </CardContent>
          </Card>

          {/* 物资领用 */}
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                物资领用
              </CardTitle>
              <Link href={`/inventory?student=${student.id}`}>
                <Button size="sm" variant="outline" className="rounded-lg">查看库存</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {student.inventoryTransactions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {student.inventoryTransactions.slice(0, 5).map((trans: any) => (
                    <Link href={`/inventory?student=${student.id}`} key={trans.id} className="block px-6 py-4 hover:bg-slate-50 border-b border-transparent hover:border-amber-100 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-800">{trans.itemName || '物资'}</div>
                          <div className="text-sm text-slate-500">
                            {trans.type === 'IN' ? '领取' : '归还'}: {trans.quantity}件
                          </div>
                        </div>
                        <div className="text-right text-sm text-slate-400">
                          {new Date(trans.date).getFullYear()}/{new Date(trans.date).getMonth() + 1}/{new Date(trans.date).getDate()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">
                  暂无物资领用记录
                </div>
              )}
            </CardContent>
          </Card>

          {/* 问卷记录 */}
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-pink-500" />
                问卷记录
              </CardTitle>
              <Link href={`/surveys-manage?student=${student.id}`}>
                <Button size="sm" variant="outline" className="rounded-lg">查看问卷数据</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {student.surveys.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {student.surveys.slice(0, 5).map((survey: any) => (
                    <Link href={`/surveys-manage?student=${student.id}`} key={survey.id} className="block px-6 py-4 hover:bg-slate-50 border-b border-transparent hover:border-pink-100 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-800">
                            {survey.template?.name || survey.surveyType}
                          </div>
                          <div className="text-sm text-slate-500">
                            学员: {survey.childNameCn} {survey.childNameEn ? `(${survey.childNameEn})` : ''}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            RAZ: {survey.razLevel} | 牛津树: {survey.oxfordTreeLevel}
                          </div>
                        </div>
                        <div className="text-right text-sm text-slate-400">
                          {new Date(survey.createdAt).getFullYear()}/{new Date(survey.createdAt).getMonth() + 1}/{new Date(survey.createdAt).getDate()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">
                  暂无问卷记录
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
