"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSurveyById, updateSurvey } from "../../../actions/survey"

export default function EditSurveyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      const res = await getSurveyById(id)
      if (res.data) {
        const data: Record<string, string> = {}
        Object.keys(res.data).forEach((key) => {
          if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
            data[key] = (res.data as any)[key] || ""
          }
        })
        setFormData(data)
      }
      setInitLoading(false)
    }
    load()
  }, [id])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await updateSurvey(id, formData)
    setLoading(false)
    if (res.success) {
      router.push("/surveys-manage")
    } else {
      alert(res.error || "保存失败")
    }
  }

  if (initLoading) {
    return <div className="p-8 text-center text-slate-500">加载中...</div>
  }

  const fields = [
    { name: "surveyType", label: "问卷来源", type: "select", options: ["PARENT", "ENGLISH_LEVEL"] },
    { name: "childNameCn", label: "孩子中文名", type: "text" },
    { name: "childNameEn", label: "孩子英文名", type: "text" },
    { name: "gender", label: "性别", type: "select", options: ["male", "female"] },
    { name: "birthDate", label: "出生日期", type: "date" },
    { name: "parentName", label: "家长姓名", type: "text" },
    { name: "relationship", label: "与孩子关系", type: "select", options: ["father", "mother", "other"] },
    { name: "phone", label: "手机号码", type: "text" },
    { name: "address", label: "家庭地址", type: "textarea" },
    { name: "ageExposedEnglish", label: "几岁接触英文", type: "text" },
    { name: "razLevel", label: "RAZ阅读级别", type: "text" },
    { name: "oxfordTreeLevel", label: "牛津树级别", type: "text" },
    { name: "otherLevel", label: "其他分级阅读级别", type: "text" },
    { name: "unreadBooks", label: "暂未阅读分级读物", type: "text" },
    { name: "readingMethod", label: "在家读书方式", type: "select", options: ["家长伴读", "自主阅读", "点读笔跟读"] },
    { name: "weeklyBooksCount", label: "每周阅读量", type: "text" },
    { name: "parentChildCommFreq", label: "亲子英文交流频率", type: "select", options: ["经常", "偶尔", "几乎没有"] },
    { name: "offlineInstitute", label: "是否在线下机构学习", type: "select", options: ["是", "否"] },
    { name: "parentsEnglishLevel", label: "父母英语水平", type: "select", options: ["英语专业八级/六级", "大学英语四级", "基本能看懂", "零基础"] },
    { name: "learningGoal", label: "英文学习目标", type: "select", options: ["流利口语对话", "能够自主阅读英文原版书", "兼而有之"] },
    { name: "specialNotes", label: "特殊情况说明", type: "textarea" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/surveys-manage">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">编辑问卷数据</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-sm bg-white/80">
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {fields.slice(0, 8).map((field) => (
                <div key={field.name}>
                  <Label className="mb-2 block">{field.label}</Label>
                  {field.type === "select" ? (
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">请选择</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="rounded-xl"
                    />
                  ) : (
                    <Input
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="rounded-xl"
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white/80 mt-6">
          <CardHeader>
            <CardTitle className="text-base">阅读信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {fields.slice(8).map((field) => (
                <div key={field.name}>
                  <Label className="mb-2 block">{field.label}</Label>
                  {field.type === "select" ? (
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">请选择</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="rounded-xl"
                    />
                  ) : (
                    <Input
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="rounded-xl"
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-3">
          <Link href="/surveys-manage">
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
