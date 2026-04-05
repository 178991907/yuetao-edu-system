import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    await prisma.surveyQuestion.deleteMany({})
    await prisma.surveyTemplate.deleteMany({})

    await prisma.surveyTemplate.create({
      data: {
        name: "家长调查表",
        slug: "parent",
        description: "家长填写孩子基本情况调查",
        isActive: true,
        questions: {
          create: [
            { label: "孩子中文名", fieldName: "childNameCn", fieldType: "text", required: true, placeholder: "请输入内容", order: 0 },
            { label: "孩子英文名", fieldName: "childNameEn", fieldType: "text", required: false, placeholder: "如有英文名，在此填写", helpText: "如没有英文名请忽略", order: 1 },
            { label: "性别", fieldName: "gender", fieldType: "select", options: "男,女", required: true, order: 2 },
            { label: "出生日期", fieldName: "birthDate", fieldType: "date", required: true, order: 3 },
            { label: "家长姓名", fieldName: "parentName", fieldType: "text", required: true, placeholder: "请输入内容", order: 4 },
            { label: "与孩子关系", fieldName: "relationship", fieldType: "select", options: "爸爸,妈妈,其他", required: true, order: 5 },
            { label: "手机号码", fieldName: "phone", fieldType: "text", required: true, placeholder: "请输入电话号码", helpText: "务必填写正确，核对信息使用", order: 6 },
            { label: "家庭地址", fieldName: "address", fieldType: "text", required: true, placeholder: "请输入详细地址", helpText: "务必填写正确，发放福利使用", order: 7 },
            { label: "几岁接触英文", fieldName: "ageExposedEnglish", fieldType: "text", required: true, placeholder: "请输入内容", order: 8 },
            { label: "RAZ阅读级别", fieldName: "razLevel", fieldType: "text", required: true, placeholder: "请输入内容或填无", helpText: "读到哪个级别? 例如: A级", order: 9 },
            { label: "牛津树级别", fieldName: "oxfordTreeLevel", fieldType: "text", required: true, placeholder: "请输入内容或填无", helpText: "读到哪个级别? 例如: 2级", order: 10 },
            { label: "其他分级阅读级别", fieldName: "otherLevel", fieldType: "text", required: false, placeholder: "请输入内容或填无", helpText: "分级读物的名称和级别!例如:海尼曼,GK级", order: 11 },
            { label: "在家读书的方式", fieldName: "readingMethod", fieldType: "select", options: "家长伴读,自主阅读,点读笔跟读", required: true, order: 12 },
            { label: "每周阅读多少本英文书籍", fieldName: "weeklyBooksCount", fieldType: "text", required: true, placeholder: "请输入数字或预估量", helpText: "包含英文分级、读物、杂志等英文书籍", order: 13 },
            { label: "日常亲子英文交流频率", fieldName: "parentChildCommFreq", fieldType: "select", options: "经常,偶尔,几乎没有", required: true, helpText: "在生活中与孩子用英文交流,不限于单词、句子", order: 14 },
            { label: "孩子是否在线下机构学习", fieldName: "offlineInstitute", fieldType: "select", options: "是,否", required: true, helpText: "报过线下少儿英语机构学习", order: 15 },
            { label: "父母英语水平", fieldName: "parentsEnglishLevel", fieldType: "select", options: "英语专业八级/六级,大学英语四级,基本能看懂,零基础", required: true, helpText: "在大学英语水平考试或专业考试中的等级", order: 16 },
            { label: "孩子英文学习目标", fieldName: "learningGoal", fieldType: "select", options: "流利口语对话,能够自主阅读英文原版书,兼而有之", required: true, helpText: "您心目中孩子学习英文最终目的是什么?", order: 17 },
            { label: "特殊情况说明", fieldName: "specialNotes", fieldType: "textarea", required: false, placeholder: "有需要补充的事宜，在此填写", order: 18 },
            { label: "暂未阅读分级读物", fieldName: "unreadBooks", fieldType: "text", required: false, placeholder: "请输入内容", helpText: "暂时未阅读分级读物,可写出读过的书籍名称", order: 19 },
          ],
        },
      },
    })

    await prisma.surveyTemplate.create({
      data: {
        name: "英语水平调查表",
        slug: "english-level",
        description: "学员英语水平回访调查",
        isActive: true,
        questions: {
          create: [
            { label: "孩子中文名", fieldName: "childNameCn", fieldType: "text", required: true, order: 0 },
            { label: "孩子英文名", fieldName: "childNameEn", fieldType: "text", required: false, order: 1 },
            { label: "性别", fieldName: "gender", fieldType: "select", options: "男,女", required: true, order: 2 },
            { label: "出生日期", fieldName: "birthDate", fieldType: "date", required: true, order: 3 },
            { label: "家长姓名", fieldName: "parentName", fieldType: "text", required: true, order: 4 },
            { label: "与孩子关系", fieldName: "relationship", fieldType: "select", options: "爸爸,妈妈,其他", required: true, order: 5 },
            { label: "手机号码", fieldName: "phone", fieldType: "text", required: true, order: 6 },
            { label: "家庭地址", fieldName: "address", fieldType: "text", required: true, order: 7 },
            { label: "几岁接触英文", fieldName: "ageExposedEnglish", fieldType: "text", required: true, order: 8 },
            { label: "RAZ阅读级别", fieldName: "razLevel", fieldType: "text", required: true, order: 9 },
            { label: "牛津树级别", fieldName: "oxfordTreeLevel", fieldType: "text", required: true, order: 10 },
            { label: "其他分级阅读级别", fieldName: "otherLevel", fieldType: "text", required: false, order: 11 },
            { label: "在家读书的方式", fieldName: "readingMethod", fieldType: "select", options: "家长伴读,自主阅读,点读笔跟读", required: true, order: 12 },
            { label: "每周阅读多少本英文书籍", fieldName: "weeklyBooksCount", fieldType: "text", required: true, order: 13 },
            { label: "日常亲子英文交流频率", fieldName: "parentChildCommFreq", fieldType: "select", options: "经常,偶尔,几乎没有", required: true, order: 14 },
            { label: "孩子是否在线下机构学习", fieldName: "offlineInstitute", fieldType: "select", options: "是,否", required: true, order: 15 },
            { label: "父母英语水平", fieldName: "parentsEnglishLevel", fieldType: "select", options: "英语专业八级/六级,大学英语四级,基本能看懂,零基础", required: true, order: 16 },
            { label: "孩子英文学习目标", fieldName: "learningGoal", fieldType: "select", options: "流利口语对话,能够自主阅读英文原版书,兼而有之", required: true, order: 17 },
            { label: "特殊情况说明", fieldName: "specialNotes", fieldType: "textarea", required: false, order: 18 },
            { label: "暂未阅读分级读物", fieldName: "unreadBooks", fieldType: "text", required: false, order: 19 },
          ],
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to seed:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
