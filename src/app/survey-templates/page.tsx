import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Edit, Trash2, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"
import { getSurveyTemplates } from "../actions/survey"

export default async function SurveyTemplatesPage() {
  const { data: templates = [] } = await getSurveyTemplates()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" />
            问卷模板管理
          </h2>
          <p className="text-sm text-slate-500 mt-2">创建和管理自定义问卷模板，定义问题字段。</p>
        </div>
        <Link href="/survey-templates/new">
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> 新建问卷
          </Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <Card className="border-0 shadow-sm bg-white/80">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 mb-4">暂无问卷模板</p>
            <Link href="/survey-templates/new">
              <Button variant="outline" className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" /> 创建第一个问卷
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template: any) => (
            <Card key={template.id} className="border-0 shadow-sm bg-white/80 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <p className="text-xs text-slate-500 mt-1">/{template.slug}</p>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    template.isActive 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {template.isActive ? "启用" : "禁用"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {template.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{template.description}</p>
                )}
                <p className="text-xs text-slate-400 mb-4">{template.questions?.length || 0} 个问题</p>
                <div className="flex gap-2">
                  <Link href={`/survey-templates/${template.id}`}>
                    <Button size="sm" variant="outline" className="h-7 rounded-lg">
                      <Edit className="w-3 h-3 mr-1" /> 编辑
                    </Button>
                  </Link>
                  <Link href={`/surveys/${template.slug}`} target="_blank">
                    <Button size="sm" variant="outline" className="h-7 rounded-lg">
                      <ExternalLink className="w-3 h-3 mr-1" /> 预览
                    </Button>
                  </Link>
                  <form action={async () => {
                    "use server"
                    const { deleteSurveyTemplate } = await import("../actions/survey")
                    await deleteSurveyTemplate(template.id)
                  }}>
                    <Button size="sm" variant="ghost" className="h-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
