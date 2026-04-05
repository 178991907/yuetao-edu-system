"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { submitSurvey } from "@/app/actions/survey"

export function SurveyForm({ title }: { title: string }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function actionHandler(formData: FormData) {
    setLoading(true);
    const res = await submitSurvey(formData);
    if (res.success) {
      setSubmitted(true);
    } else {
      alert(res.error || "提交失败，请重试");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto bg-white min-h-[50vh] sm:rounded-2xl sm:my-8 shadow-sm flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">提交成功！</h2>
        <p className="text-slate-500">感谢您的填写，我们会尽快整理并对齐信息。</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white min-h-screen sm:rounded-2xl sm:my-8 shadow-sm overflow-hidden pb-12 animate-in fade-in duration-500">
      <div className="bg-blue-600/5 px-6 py-10 text-center border-b border-blue-100">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">孩子家长(父母)完成填写!</p>
      </div>

      <form action={actionHandler} className="px-6 sm:px-10 space-y-8 mt-8">
        <input type="hidden" name="surveyType" value="PARENT" />
        {/* 基本信息区 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">孩子中文名 <span className="text-red-500">*</span></label>
            <input type="text" name="childNameCn" placeholder="请输入内容" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-slate-50/50 hover:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">孩子英文名</label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">如有英文名，在此填写英文名字，如没有请忽略！</p>
            <input type="text" name="childNameEn" placeholder="请输入内容" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-slate-50/50 hover:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">性别 <span className="text-red-500">*</span></label>
            <select name="gender" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 appearance-none text-slate-600">
              <option value="">请选择选项</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">出生日期 <span className="text-red-500">*</span></label>
            <input type="date" name="birthDate" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 text-slate-600" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">家长姓名 <span className="text-red-500">*</span></label>
            <input type="text" name="parentName" placeholder="请输入内容" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">与孩子关系 <span className="text-red-500">*</span></label>
            <select name="relationship" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 appearance-none text-slate-600">
              <option value="">请选择选项</option>
              <option value="father">爸爸</option>
              <option value="mother">妈妈</option>
              <option value="other">其他</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">手机号码 <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">务必填写正确，核对信息使用！</p>
            <input type="tel" name="phone" placeholder="请输入电话号码" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">家庭地址 <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">务必填写正确，发放福利使用！</p>
            <div className="space-y-3">
              <input type="text" name="address" placeholder="请输入详细地址（例：广东省广州市白云区阅陶幼儿园/XX小区)" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50" />
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 my-8"></div>

        {/* 阅读与习惯区 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">几岁接触英文？ <span className="text-red-500">*</span></label>
            <input type="text" name="ageExposedEnglish" placeholder="请输入内容" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">RAZ阅读级别 <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">在下面填写，读到哪个级别? 例如: A级</p>
            <input type="text" name="razLevel" placeholder="请输入内容或填无" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">牛津树阅读级别 <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">在下面填写，读到哪个级别? 例如: 2级</p>
            <input type="text" name="oxfordTreeLevel" placeholder="请输入内容或填无" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">其他分级阅读级别 <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">在下面填写，分级读物的名称和级别!例如:海尼曼,GK级</p>
            <input type="text" name="otherLevel" placeholder="请输入内容或填无" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">在家读书的方式 <span className="text-red-500">*</span></label>
            <select name="readingMethod" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 appearance-none text-slate-600">
              <option value="">请选择选项</option>
              <option value="家长伴读">家长伴读</option>
              <option value="自主阅读">自主阅读</option>
              <option value="点读笔跟读">点读笔跟读</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">每周阅读多少本英文书籍？ <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">包含英文分级、读物、杂志等英文书籍！</p>
            <input type="text" name="weeklyBooksCount" placeholder="请输入数字或预估量" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">日常亲子英文交流频率？ <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">在生活中与孩子用英文交流,不限于单词、句子！</p>
            <select name="parentChildCommFreq" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 appearance-none text-slate-600">
              <option value="">请选择选项</option>
              <option value="经常">经常</option>
              <option value="偶尔">偶尔</option>
              <option value="几乎没有">几乎没有</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">孩子是否在线下机构学习？ <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">报过线下少儿英语机构学习</p>
            <select name="offlineInstitute" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 appearance-none text-slate-600">
              <option value="">请选择选项</option>
              <option value="是">是</option>
              <option value="否">否</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">父母英语水平 <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">在大学英语水平考试或专业考试中的等级</p>
            <select name="parentsEnglishLevel" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 appearance-none text-slate-600">
              <option value="">请选择选项</option>
              <option value="英语专业八级/六级">英语专业八级/六级</option>
              <option value="大学英语四级">大学英语四级</option>
              <option value="基本能看懂">基本能看懂</option>
              <option value="零基础">零基础</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">孩子英文学习目标 <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">您心目中孩子学习英文最终目的是什么?</p>
            <select name="learningGoal" required className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 appearance-none text-slate-600">
              <option value="">请选择选项</option>
              <option value="流利口语对话">流利口语对话</option>
              <option value="能够自主阅读英文原版书">能够自主阅读英文原版书</option>
              <option value="兼而有之">兼而有之</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">特殊情况说明</label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">有需要补充的事宜,在此填写即可!</p>
            <textarea name="specialNotes" placeholder="请输入内容" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50 h-24 resize-none" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">暂未阅读分级读物</label>
            <p className="text-xs text-slate-400 mb-2 -mt-1">暂时未阅读分级读物,在下面可以写出读过的书籍名称!</p>
            <input type="text" name="unreadBooks" placeholder="请输入内容" className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none bg-slate-50/50" />
          </div>
        </div>

        <div className="pt-8 pb-4">
          <Button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 rounded-xl shadow-md text-lg transition-all">
            {loading ? "提交入库中..." : "提 交"}
          </Button>
        </div>
      </form>
    </div>
  )
}
