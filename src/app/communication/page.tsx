import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { getCommunications } from "../actions/communication"
import { getStudents, getStudentById } from "../actions/student"
import { CreateCommunicationDialog, EditCommunicationDialog, CollapsibleText } from "./client-components"

type CommunicationSearchParams = Promise<{ student?: string }>

export default async function CommunicationPage({ searchParams }: { searchParams: CommunicationSearchParams }) {
  const params = await searchParams
  const studentId = params.student
  
  let student = null
  if (studentId) {
    const { data } = await getStudentById(studentId)
    student = data
  }
  
  const [{ data: logs = [] }, { data: students = [] }] = await Promise.all([
    getCommunications(studentId),
    getStudents()
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {student && (
        <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-fuchsia-100 p-2 rounded-full">
              <MessageSquare className="h-4 w-4 text-fuchsia-600" />
            </div>
            <div>
              <div className="text-xs text-fuchsia-500 font-medium">学员档案专属沟通记录</div>
              <div className="font-bold text-fuchsia-900 text-lg">{student.name}</div>
            </div>
          </div>
          <Link href={`/students/${studentId}`}>
            <Button variant="outline" size="sm" className="border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-100 rounded-xl">
              返回档案中心
            </Button>
          </Link>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-fuchsia-500" />
            家校沟通记录库
          </h2>
          <p className="text-sm text-slate-500 mt-2">随时记录和查阅老师与家长的沟通反馈信息，确保持续跟踪反馈。</p>
        </div>
        <CreateCommunicationDialog students={students} studentId={studentId} />
      </div>

      <Card className="border-0 shadow-sm bg-white/80 overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-slate-100">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            沟通留档记录表
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full border-collapse">
              <TableHeader className="bg-fuchsia-50/50">
                <TableRow className="hover:bg-transparent border-b border-slate-200">
                  <TableHead className="w-[110px] pl-6 font-semibold text-slate-900 border-r border-slate-200/60">沟通日期</TableHead>
                  <TableHead className="w-[100px] font-semibold text-slate-900 border-r border-slate-200/60 text-center">学员</TableHead>
                  <TableHead className="min-w-[200px] font-semibold text-slate-900 border-r border-slate-200/60">老师反馈内容</TableHead>
                  <TableHead className="min-w-[150px] font-semibold text-slate-900 border-r border-slate-200/60">家长诉求/问题</TableHead>
                  <TableHead className="min-w-[150px] font-semibold text-slate-900 border-r border-slate-200/60">后续方案 / 建议</TableHead>
                  <TableHead className="w-[60px] font-semibold pr-6 text-right text-slate-900">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((row: any) => (
                  <TableRow key={row.id} className="hover:bg-fuchsia-50/10 transition-colors align-top border-b border-slate-100 last:border-0 text-sm">
                    <TableCell className="pl-6 text-slate-500 font-medium py-4 border-r border-slate-100/60">
                       <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400"/> {new Date(row.date).toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell className="font-bold text-slate-800 py-4 border-r border-slate-100/60 text-center">
                      <div className="px-2">{row.student?.name || '---'}</div>
                    </TableCell>
                    <TableCell className="text-slate-600 leading-relaxed py-4 pr-4 border-r border-slate-100/60">
                      <div className="whitespace-pre-wrap break-words">
                        <CollapsibleText text={row.teacherFeedback} maxLength={100} />
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 leading-relaxed bg-slate-50/20 py-4 px-4 border-r border-slate-100/60">
                      <div className="whitespace-pre-wrap break-words">
                        <CollapsibleText text={row.parentRequest || '-'} maxLength={60} />
                      </div>
                    </TableCell>
                    <TableCell className="text-fuchsia-800 leading-relaxed py-4 pr-4 border-r border-slate-100/60">
                      <div className="whitespace-pre-wrap break-words italic">
                        <CollapsibleText text={row.followUpPlan || '-'} maxLength={60} />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <EditCommunicationDialog log={row} />
                    </TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">暂无沟通记录</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

