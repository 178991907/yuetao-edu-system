"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react"
import Link from "next/link"
import { createSurveyTemplate } from "../../actions/survey"

const fieldTypes = [
  { value: "text", label: "单行填空" },
  { value: "textarea", label: "长文本回答" },
  { value: "select", label: "下拉单选" },
  { value: "radio", label: "点选按钮" },
  { value: "checkbox", label: "多项选择" },
  { value: "date", label: "日期选择" },
  { value: "number", label: "数值/分数" },
]

const TEMPLATES = [
  {
    name: "通用家长回访",
    questions: [
      { label: "孩子姓名", fieldType: "text", required: true, placeholder: "请输入" },
      { label: "近期学习状态", fieldType: "select", options: "进步明显,平稳,有退步", required: true },
      { label: "家长意见建议", fieldType: "textarea", required: false, placeholder: "请填写您的建议" }
    ]
  },
  {
    name: "课后反馈表",
    questions: [
      { label: "本堂课知识点掌握", fieldType: "radio", options: "完全掌握,基本掌握,不太理解", required: true },
      { label: "课堂表现评价", fieldType: "select", options: "非常积极,一般,需加油", required: true },
      { label: "作业完成情况", fieldType: "radio", options: "按时完成,部分完成,未完成", required: true }
    ]
  }
]

interface Question {
  label: string
  fieldName: string
  fieldType: string
  options: string
  required: boolean
  placeholder: string
  helpText: string
  order: number
}

export default function NewSurveyTemplatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])

  const generateSlug = (value: string) => {
    return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-").replace(/-+/g, "-")
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value))
    }
  }

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setName(tpl.name)
    setSlug(generateSlug(tpl.name))
    const mappedQuestions = tpl.questions.map((q, i) => ({
      ...q,
      fieldName: generateSlug(q.label),
      options: q.options || "",
      required: q.required || false,
      placeholder: q.placeholder || "",
      helpText: "",
      order: i
    }))
    setQuestions(mappedQuestions)
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      label: "",
      fieldName: "",
      fieldType: "text",
      options: "",
      required: false,
      placeholder: "",
      helpText: "",
      order: questions.length,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    if (field === "label" && !updated[index].fieldName) {
      updated[index].fieldName = generateSlug(value)
    }
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug) {
      alert("请填写问卷名称和标识")
      return
    }
    setLoading(true)
    const res = await createSurveyTemplate({
      name,
      slug,
      description,
      isActive,
      questions: questions.filter(q => q.label && q.fieldName).map((q, i) => ({
        ...q,
        order: i,
      })),
    })
    setLoading(false)
    if (res.success) {
      router.push("/survey-templates")
    } else {
      alert(res.error || "创建失败")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/survey-templates">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">新建问卷</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-sm bg-white/80">
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="mb-2 block font-medium">问卷标题 <span className="text-red-500">*</span></Label>
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="给家长看的标题，如：2024暑期班反馈表"
                  className="rounded-xl h-11 border-slate-200"
                />
              </div>
              <div>
                <Label className="mb-2 block font-medium text-slate-400">系统内部标识 (URL)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 text-sm">/surveys/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="系统自动生成"
                    className="rounded-xl h-11 border-slate-100 bg-slate-50/50 text-slate-400"
                  />
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Label className="mb-3 block text-sm font-medium text-slate-600">快速套用模板：</Label>
              <div className="flex gap-2">
                 {TEMPLATES.map(tpl => (
                   <Button 
                    key={tpl.name}
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full bg-blue-50/50 border-blue-100 text-blue-600 hover:bg-blue-100 h-8"
                    onClick={() => applyTemplate(tpl)}
                   >
                     {tpl.name}
                   </Button>
                 ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">描述</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="问卷描述..."
                className="rounded-xl"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>启用问卷</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white/80 mt-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-50">
            <div>
              <CardTitle className="text-base">内容设计</CardTitle>
              <p className="text-xs text-slate-400 mt-1">您可以自由添加、删除或修改问卷的问题</p>
            </div>
            <Button type="button" onClick={addQuestion} variant="default" size="sm" className="rounded-xl bg-slate-900">
              <Plus className="mr-2 h-4 w-4" /> 增加一个问题
            </Button>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <p className="text-center text-slate-500 py-8">暂无问题，点击上方按钮添加</p>
            ) : (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={index} className="border rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
                      问题 {index + 1}
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <Label className="mb-2 block text-xs font-semibold">问题标题</Label>
                        <Input
                          value={q.label}
                          onChange={(e) => updateQuestion(index, "label", e.target.value)}
                          placeholder="例如：您对本机构的教学满意吗？"
                          className="rounded-xl h-10 border-slate-200"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block text-xs font-semibold">回答方式</Label>
                        <select
                          value={q.fieldType}
                          onChange={(e) => updateQuestion(index, "fieldType", e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 h-10 text-sm bg-white"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <div className="flex-1 min-w-[200px]">
                        <Label className="mb-2 block text-[10px] uppercase tracking-wider text-slate-400 font-bold">填表时的提示文字</Label>
                        <Input
                          value={q.placeholder}
                          onChange={(e) => updateQuestion(index, "placeholder", e.target.value)}
                          placeholder="例如: 请输入详细内容"
                          className="rounded-lg h-8 text-xs bg-white"
                        />
                      </div>
                      
                      <div className="hidden">
                        {/* 字段名对普通用户无用，隐藏处理 */}
                        <Input
                          value={q.fieldName}
                          onChange={(e) => updateQuestion(index, "fieldName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {["select", "radio", "checkbox"].includes(q.fieldType) && (
                        <div className="flex-1 min-w-[200px]">
                          <Label className="mb-2 block text-xs font-semibold">选项内容（用逗号隔开）</Label>
                          <Input
                            value={q.options}
                            onChange={(e) => updateQuestion(index, "options", e.target.value)}
                            placeholder="示例：满意, 一般, 不满意"
                            className="rounded-xl h-10"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                        <Label className="text-sm">在此项设为必填</Label>
                      </div>
                      <div className="ml-auto">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(index)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-3">
          <Link href="/survey-templates">
            <Button variant="outline" className="rounded-xl">取消</Button>
          </Link>
          <Button type="submit" disabled={loading} className="rounded-xl bg-blue-600">
            {loading ? "创建中..." : "创建问卷"}
          </Button>
        </div>
      </form>
    </div>
  )
}
