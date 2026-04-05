"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react"
import Link from "next/link"
import { getSurveyTemplateById, updateSurveyTemplate, addSurveyQuestion, updateSurveyQuestion, deleteSurveyQuestion } from "../../actions/survey"

const fieldTypes = [
  { value: "text", label: "单行文本" },
  { value: "textarea", label: "多行文本" },
  { value: "select", label: "下拉选择" },
  { value: "radio", label: "单选" },
  { value: "checkbox", label: "多选" },
  { value: "date", label: "日期" },
  { value: "number", label: "数字" },
]

interface Question {
  id?: string
  label: string
  fieldName: string
  fieldType: string
  options: string
  required: boolean
  placeholder: string
  helpText: string
  order: number
  _new?: boolean
}

export default function EditSurveyTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    async function load() {
      const res = await getSurveyTemplateById(id)
      if (res.data) {
        setName(res.data.name)
        setSlug(res.data.slug)
        setDescription(res.data.description || "")
        setIsActive(res.data.isActive)
        setQuestions(res.data.questions.map((q: any) => ({
          id: q.id,
          label: q.label,
          fieldName: q.fieldName,
          fieldType: q.fieldType,
          options: q.options || "",
          required: q.required,
          placeholder: q.placeholder || "",
          helpText: q.helpText || "",
          order: q.order,
        })))
      }
      setInitLoading(false)
    }
    load()
  }, [id])

  const generateSlug = (value: string) => {
    return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-").replace(/-+/g, "-")
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
      _new: true,
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

  const removeQuestion = async (index: number) => {
    const q = questions[index]
    if (q.id && !q._new) {
      await deleteSurveyQuestion(q.id)
    }
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug) {
      alert("请填写问卷名称和标识")
      return
    }
    setLoading(true)
    await updateSurveyTemplate(id, { name, slug, description, isActive })
    for (const q of questions) {
      if (q._new && q.label && q.fieldName) {
        await addSurveyQuestion(id, {
          label: q.label,
          fieldName: q.fieldName,
          fieldType: q.fieldType,
          options: q.options,
          required: q.required,
          placeholder: q.placeholder,
          helpText: q.helpText,
          order: q.order,
        })
      }
    }
    setLoading(false)
    router.push("/survey-templates")
  }

  if (initLoading) {
    return <div className="p-8 text-center text-slate-500">加载中...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/survey-templates">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">编辑问卷</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-sm bg-white/80">
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block">问卷名称 <span className="text-red-500">*</span></Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：家长调查表"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="mb-2 block">标识(URL) <span className="text-red-500">*</span></Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="例如：parent-survey"
                  className="rounded-xl"
                />
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">问题列表</CardTitle>
            <Button type="button" onClick={addQuestion} variant="outline" size="sm" className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" /> 添加问题
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
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="mb-2 block text-xs">问题标题</Label>
                        <Input
                          value={q.label}
                          onChange={(e) => updateQuestion(index, "label", e.target.value)}
                          placeholder="例如：孩子姓名"
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block text-xs">字段名</Label>
                        <Input
                          value={q.fieldName}
                          onChange={(e) => updateQuestion(index, "fieldName", e.target.value)}
                          placeholder="例如：childName"
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block text-xs">字段类型</Label>
                        <select
                          value={q.fieldType}
                          onChange={(e) => updateQuestion(index, "fieldType", e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="mb-2 block text-xs">占位符</Label>
                        <Input
                          value={q.placeholder}
                          onChange={(e) => updateQuestion(index, "placeholder", e.target.value)}
                          placeholder="占位提示文字"
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    {["select", "radio", "checkbox"].includes(q.fieldType) && (
                      <div>
                        <Label className="mb-2 block text-xs">选项（逗号分隔）</Label>
                        <Input
                          value={q.options}
                          onChange={(e) => updateQuestion(index, "options", e.target.value)}
                          placeholder="选项1,选项2,选项3"
                          className="rounded-xl"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                          className="rounded border-slate-300"
                        />
                        <Label className="text-xs">必填</Label>
                      </div>
                      <div className="flex-1">
                        <Input
                          value={q.helpText}
                          onChange={(e) => updateQuestion(index, "helpText", e.target.value)}
                          placeholder="帮助文字（可选）"
                          className="rounded-xl text-xs"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
            {loading ? "保存中..." : "保存修改"}
          </Button>
        </div>
      </form>
    </div>
  )
}
