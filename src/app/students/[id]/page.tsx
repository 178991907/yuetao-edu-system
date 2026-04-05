import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getStudentById } from "../../actions/student"
import { StudentProfileClient } from "./client"
import { getCourses } from "../../actions/course"

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: student } = await getStudentById(id)
  const { data: courses } = await getCourses()

  if (!student) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <Link href="/students">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">学员档案不存在</h2>
        </div>
      </div>
    )
  }

  return <StudentProfileClient student={student} allCourses={courses || []} />
}
