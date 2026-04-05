import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Presentation, BookOpen, Clock } from "lucide-react"
import { getCourses } from "../actions/course"
import { getStudentById } from "../actions/student"
import { CreateCourseDialog, DeleteCourseButton, EditCourseDialog } from "./client-components"

type CoursesSearchParams = Promise<{ student?: string }>

export default async function CoursesPage({ searchParams }: { searchParams: CoursesSearchParams }) {
  const params = await searchParams
  const studentId = params.student
  
  let student = null
  if (studentId) {
    const { data } = await getStudentById(studentId)
    student = data
  }
  
  const { data: courses = [] } = await getCourses(studentId)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {student && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-indigo-600">当前筛选:</span>
            <span className="font-medium text-indigo-800">{student.name} 的课程</span>
          </div>
          <a href="/courses" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">清除筛选</a>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-500" />
            课程体系管理
          </h2>
          <p className="text-sm text-slate-500 mt-2">统一定义和管理供学员报名的各种培训产品。</p>
        </div>
        <CreateCourseDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course: any) => (
          <Card key={course.id} className="border-0 shadow-sm bg-white/80 hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                  course.type === 'PHONICS' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {course.type === 'PHONICS' ? <BookOpen className="h-6 w-6" /> : <Presentation className="h-6 w-6" />}
                </div>
                <CardTitle className="text-xl">{course.name}</CardTitle>
                <CardDescription className="text-slate-600 font-medium">
                  {course.type} 课程
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 min-h-[40px]">
                  {course.description || "暂无简介"}
                </p>
                <div className="flex items-center justify-between text-sm py-3 border-t border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1"><Clock className="w-4 h-4"/> {course.totalSessions} 课时</span>
                  <span className="font-bold text-lg text-slate-800">¥ {course.price.toLocaleString()}</span>
                </div>
              </CardContent>
            </div>
            <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-100 rounded-b-xl flex justify-between items-center">
              <span className="text-xs text-slate-500">在读活跃: {course._count?.enrollments || 0} 人</span>
              <div className="flex items-center gap-2">
                <EditCourseDialog course={course} />
                <DeleteCourseButton id={course.id} />
              </div>
            </CardFooter>
          </Card>
        ))}

        {courses.length === 0 && (
           <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500 bg-white/50 rounded-xl border border-dashed border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
            <p>暂无课程数据，请点击右上角创建新课程</p>
          </div>
        )}
      </div>
    </div>
  )
}

