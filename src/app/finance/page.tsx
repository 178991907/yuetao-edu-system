import { getPayments, getExpenses } from "../actions/finance"
import { getStudents } from "../actions/student"
import { getCourses } from "../actions/course"
import { FinanceClient } from "./client"

type FinanceSearchParams = Promise<{ 
  student?: string
  course?: string
  method?: string
  startDate?: string
  endDate?: string
  category?: string
  expStartDate?: string
  expEndDate?: string
}>

export default async function FinancePage({ searchParams }: { searchParams: FinanceSearchParams }) {
  const params = await searchParams
  const studentId = params.student
  
  const incomeFilters = params.course || params.method || params.startDate || params.endDate ? {
    courseId: params.course,
    method: params.method,
    startDate: params.startDate,
    endDate: params.endDate,
  } : undefined
  
  const [{ data: payments = [] }, { data: expenses = [] }, { data: students = [] }, { data: courses = [] }] = await Promise.all([
    getPayments(studentId, incomeFilters),
    getExpenses(params.category, params.expStartDate, params.expEndDate),
    getStudents(),
    getCourses()
  ]);

  const existingCategories = Array.from(new Set(expenses.map((e: any) => e.category))) as string[];

  return <FinanceClient payments={payments} expenses={expenses} students={students} courses={courses} existingCategories={existingCategories} studentId={studentId} />
}