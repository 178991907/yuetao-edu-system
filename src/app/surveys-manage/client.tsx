"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ClipboardList, ExternalLink, Download, Pencil, Plus, Edit, Trash2, FileText, Share2, Check, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const FIELD_LABELS: Record<string, string> = {
  surveyType: "问卷类型",
  childNameCn: "中文姓名",
  childNameEn: "英文名",
  gender: "性别",
  birthDate: "出生日期",
  parentName: "家长姓名",
  relationship: "关系",
  phone: "联系电话",
  address: "家庭住址",
  ageExposedEnglish: "开始学英语年龄",
  razLevel: "RAZ 级别",
  oxfordTreeLevel: "牛津树级别",
  otherLevel: "其他级别/教材",
  unreadBooks: "未读书目",
  readingMethod: "阅读方式",
  weeklyBooksCount: "每周阅读量",
  parentChildCommFreq: "互动频率",
  offlineInstitute: "线下机构",
  parentsEnglishLevel: "家长水平",
  learningGoal: "学习目标",
  specialNotes: "备注说明",
  createdAt: "提交时间"
}

function ViewSurveyDialog({ survey }: { survey: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="ghost" className="h-7 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
            <Eye className="w-3 h-3 mr-1" /> 查看
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            问卷详情 - {survey.childNameCn}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
          {Object.entries(FIELD_LABELS).map(([field, label]) => {
            let value = survey[field]
            
            if (field === 'createdAt') {
              value = new Date(value).toLocaleString()
            } else if (field === 'surveyType') {
              value = value === 'PARENT' ? '家长调查表' : '水平调查表'
            }

            if (!value && field !== 'childNameEn') return null

            return (
              <div key={field} className={`${['learningGoal', 'specialNotes', 'address'].includes(field) ? 'md:col-span-2' : ''} space-y-1`}>
                <Label className="text-xs text-slate-400 font-normal">{label}</Label>
                <div className="text-sm font-medium text-slate-800 bg-slate-50/50 p-2 rounded-md border border-slate-100/50 min-h-[36px] flex items-center">
                  {value || '-'}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TemplateCard({ template, onDelete }: { template: any; onDelete: (id: string) => void }) {
  const [copied, setCopied] = useState(false)
  const surveyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/surveys/${template.slug}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(surveyUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-0 shadow-sm bg-white/80 hover:shadow-md transition-shadow">
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
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="h-7 rounded-lg" onClick={copyLink}>
            {copied ? <Check className="w-3 h-3 mr-1 text-green-600" /> : <Share2 className="w-3 h-3 mr-1" />}
            {copied ? "已复制" : "分享"}
          </Button>
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
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(template.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function SurveysManageClient({ surveys, templates, student }: { surveys: any[]; templates: any[]; student?: any }) {
  const [templateList, setTemplateList] = useState(templates)
  const [surveyList, setSurveyList] = useState(surveys)

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除这个问卷模板吗？")) {
      const { deleteSurveyTemplate } = await import("../actions/survey")
      await deleteSurveyTemplate(id)
      setTemplateList(templateList.filter(t => t.id !== id))
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {student && (
        <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-2 rounded-full">
              <ClipboardList className="h-4 w-4 text-pink-600" />
            </div>
            <div>
              <div className="text-xs text-pink-500 font-medium">学员档案专属问卷记录</div>
              <div className="font-bold text-pink-900 text-lg">{student.name}</div>
            </div>
          </div>
          <Link href={`/students/${student.id}`}>
            <Button variant="outline" size="sm" className="border-pink-200 text-pink-700 hover:bg-pink-100 rounded-xl">
              返回档案中心
            </Button>
          </Link>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-pink-500" />
            问卷管理
          </h2>
          <p className="text-sm text-slate-500 mt-2">管理问卷模板和查看已回收的问卷数据。</p>
        </div>
        {!student && (
          <div className="flex gap-3">
            <Link href="/survey-templates/new">
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> 新建问卷
              </Button>
            </Link>
            <Button variant="outline" className="rounded-xl border-slate-200">
              <Download className="mr-2 h-4 w-4" /> 导出全部
            </Button>
          </div>
        )}
      </div>

      {!student && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templateList.map((template: any) => (
            <TemplateCard key={template.id} template={template} onDelete={handleDelete} />
          ))}
          {templateList.length === 0 && (
            <Card className="border-0 shadow-sm bg-white/80">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 mb-4">暂无问卷模板</p>
                <Link href="/survey-templates/new">
                  <Button variant="outline" className="rounded-xl">
                    <Plus className="mr-2 h-4 w-4" /> 创建第一个问卷
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card className="border-0 shadow-sm bg-white/80">
        <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">已回收问卷详情 (共 {surveyList.length} 份)</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-pink-50/30 whitespace-nowrap">
              <TableRow>
                <TableHead className="pl-6 font-semibold">提交时间</TableHead>
                <TableHead className="font-semibold">问卷来源</TableHead>
                <TableHead className="font-semibold">学员姓名</TableHead>
                <TableHead className="font-semibold">RAZ级别</TableHead>
                <TableHead className="font-semibold">牛津树级别</TableHead>
                <TableHead className="font-semibold">课外阅读量</TableHead>
                <TableHead className="font-semibold">英语目标</TableHead>
                <TableHead className="font-semibold text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="whitespace-nowrap">
              {surveyList.map((row: any) => (
                <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 text-slate-500">
                    {new Date(row.createdAt).toLocaleString(undefined, {
                       month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border bg-white text-slate-600">
                      {row.surveyType === 'PARENT' ? '家长调查表' : '水平调查表'}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-slate-800">{row.childNameCn}</TableCell>
                  <TableCell className="text-slate-600">{row.razLevel || '---'}</TableCell>
                  <TableCell className="text-slate-600">{row.oxfordTreeLevel || '---'}</TableCell>
                  <TableCell className="text-slate-600">{row.weeklyBooksCount || '---'}</TableCell>
                  <TableCell className="text-fuchsia-700 text-sm max-w-[200px] truncate">{row.learningGoal || '---'}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ViewSurveyDialog survey={row} />
                      <Link href={`/surveys-manage/edit/${row.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Pencil className="w-3 h-3 mr-1" /> 编辑
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {surveyList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">暂无收集到问卷</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
