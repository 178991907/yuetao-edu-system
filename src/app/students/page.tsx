import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, UserCircle } from "lucide-react"
import Link from "next/link"
import { getStudents } from "../actions/student"
import { CreateStudentDialog, DeleteStudentButton } from "./client-components"

export default async function StudentsPage() {
  const { data: students = [] } = await getStudents();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-blue-500" />
            学员信息管理
          </h2>
          <p className="text-sm text-slate-500 mt-2">查看、添加和管理所有在读及历史学员档案。</p>
        </div>
        <CreateStudentDialog />
      </div>

      <Card className="border-0 shadow-sm bg-white/80">
        <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">在读学员数据库</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索姓名、联系方式或家长信息..." 
              className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="w-[120px] pl-6 font-semibold">学员姓名</TableHead>
                <TableHead className="font-semibold">性别</TableHead>
                <TableHead className="font-semibold">年龄</TableHead>
                <TableHead className="font-semibold">家长姓名</TableHead>
                <TableHead className="font-semibold">联系电话</TableHead>
                <TableHead className="font-semibold">首次报名日</TableHead>
                <TableHead className="font-semibold">状态</TableHead>
                <TableHead className="text-right pr-6 font-semibold">详细操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student: any) => (
                <TableRow key={student.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell className="font-medium pl-6 text-slate-800">
                    {student.name}
                    {student.englishName && <span className="ml-2 text-slate-400 font-normal">({student.englishName})</span>}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {student.gender === 'male' ? '男' : student.gender === 'female' ? '女' : (student.gender || '-')}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {student.birthDate 
                      ? `${new Date().getFullYear() - new Date(student.birthDate).getFullYear()}岁` 
                      : (student.age ? `${student.age}岁` : '-')}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {student.parentRelation 
                      ? <><span className="text-xs bg-slate-100 px-1 py-0.5 rounded mr-1 text-slate-500">{student.parentRelation}</span>{student.parentName || '-'}</>
                      : (student.parentName || '-')}
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium">{student.parentPhone || '-'}</TableCell>
                  <TableCell className="text-slate-500">{new Date(student.enrollmentDate).getFullYear()}/{new Date(student.enrollmentDate).getMonth() + 1}/{new Date(student.enrollmentDate).getDate()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                      student.status === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                        : 'bg-slate-50 text-slate-700 border-slate-200/50'
                    }`}>
                      ● {student.status === 'ACTIVE' ? '在读' : '历史'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Link href={`/students/${student.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg">
                        查看档案
                      </Button>
                    </Link>
                    <DeleteStudentButton id={student.id} />
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    暂无学员数据，请点击上方按钮添加。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
