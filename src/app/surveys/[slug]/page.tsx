import { getSurveyTemplateBySlug, submitDynamicSurvey } from "../../actions/survey"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

async function submitAction(formData: FormData) {
  "use server"
  await submitDynamicSurvey(formData)
}

export default async function DynamicSurveyPage({ params }: { params: { slug: string } }) {
  const { data: template } = await getSurveyTemplateBySlug(params.slug)

  if (!template) {
    return (
      <div className="max-w-xl mx-auto bg-white min-h-screen sm:rounded-2xl sm:my-8 shadow-sm flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">问卷不存在</h2>
        <p className="text-slate-500">该问卷链接无效或已被删除</p>
      </div>
    )
  }

  if (!template.isActive) {
    return (
      <div className="max-w-xl mx-auto bg-white min-h-screen sm:rounded-2xl sm:my-8 shadow-sm flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">问卷已关闭</h2>
        <p className="text-slate-500">该问卷目前已停止收集</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto bg-white min-h-screen sm:rounded-2xl sm:my-8 shadow-sm overflow-hidden pb-12 animate-in fade-in duration-500">
      <div className="bg-blue-600/5 px-6 py-10 text-center border-b border-blue-100">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{template.name}</h1>
        {template.description && <p className="text-slate-500 text-sm mt-2 font-medium">{template.description}</p>}
      </div>

      <form action={submitAction} className="px-6 sm:px-10 space-y-8 mt-8">
        <input type="hidden" name="templateId" value={template.id} />
        <input type="hidden" name="surveyType" value={template.name} />

        {template.questions.map((question: any) => (
          <div key={question.id}>
            <Label className="block text-sm font-semibold text-slate-700 mb-2">
              {question.label}
              {question.required && <span className="text-red-500"> *</span>}
            </Label>
            {question.helpText && (
              <p className="text-xs text-slate-400 mb-2 -mt-1">{question.helpText}</p>
            )}

            {question.fieldType === "textarea" ? (
              <Textarea
                name={question.fieldName}
                placeholder={question.placeholder}
                required={question.required}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-slate-50/50 hover:bg-white"
              />
            ) : question.fieldType === "select" ? (
              <select
                name={question.fieldName}
                required={question.required}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 appearance-none text-slate-600"
              >
                <option value="">请选择选项</option>
                {question.options?.split(",").map((opt: string) => (
                  <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                ))}
              </select>
            ) : question.fieldType === "radio" ? (
              <div className="space-y-2">
                {question.options?.split(",").map((opt: string) => (
                  <label key={opt.trim()} className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="radio" name={question.fieldName} value={opt.trim()} required={question.required} className="rounded border-slate-300" />
                    {opt.trim()}
                  </label>
                ))}
              </div>
            ) : question.fieldType === "checkbox" ? (
              <div className="space-y-2">
                {question.options?.split(",").map((opt: string) => (
                  <label key={opt.trim()} className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" name={question.fieldName} value={opt.trim()} className="rounded border-slate-300" />
                    {opt.trim()}
                  </label>
                ))}
              </div>
            ) : question.fieldType === "date" ? (
              <input
                type="date"
                name={question.fieldName}
                placeholder={question.placeholder}
                required={question.required}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 text-slate-600"
              />
            ) : question.fieldType === "number" ? (
              <Input
                type="number"
                name={question.fieldName}
                placeholder={question.placeholder}
                required={question.required}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-slate-50/50 hover:bg-white"
              />
            ) : (
              <Input
                type="text"
                name={question.fieldName}
                placeholder={question.placeholder}
                required={question.required}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-slate-50/50 hover:bg-white"
              />
            )}
          </div>
        ))}

        <div className="pt-8 pb-4">
          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 rounded-xl shadow-md text-lg transition-all">
            提 交
          </Button>
        </div>
      </form>
    </div>
  )
}
