import { getSurveys, getSurveyTemplates } from "../actions/survey"
import { getStudentById } from "../actions/student"
import { SurveysManageClient } from "./client"

type SurveysManageSearchParams = Promise<{ student?: string }>

export default async function SurveysManagePage({ searchParams }: { searchParams: SurveysManageSearchParams }) {
  const params = await searchParams
  const studentId = params.student
  
  let student = null
  if (studentId) {
    const { data } = await getStudentById(studentId)
    student = data
  }
  
  const { data: surveys = [] } = await getSurveys(studentId)
  const { data: templates = [] } = await getSurveyTemplates()

  return <SurveysManageClient surveys={surveys} templates={templates} student={student} />
}
