"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitSurvey(formData: FormData) {
  try {
    const surveyType = (formData.get("surveyType") as string) || "PARENT";
    
    // 尝试匹配学员姓名来建立自动联系
    let studentId = null;
    const student = await prisma.student.findFirst({
      where: { name: formData.get("childNameCn") as string }
    });
    if (student) {
      studentId = student.id;
    }

    const survey = await prisma.surveyResponse.create({
      data: {
        studentId: studentId,
        surveyType,
        childNameCn: formData.get("childNameCn") as string,
        childNameEn: formData.get("childNameEn") as string | null,
        gender: formData.get("gender") as string,
        birthDate: formData.get("birthDate") as string,
        parentName: formData.get("parentName") as string,
        relationship: formData.get("relationship") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        
        ageExposedEnglish: formData.get("ageExposedEnglish") as string,
        razLevel: formData.get("razLevel") as string,
        oxfordTreeLevel: formData.get("oxfordTreeLevel") as string,
        otherLevel: formData.get("otherLevel") as string | null,
        unreadBooks: formData.get("unreadBooks") as string | null,
        readingMethod: formData.get("readingMethod") as string,
        weeklyBooksCount: formData.get("weeklyBooksCount") as string,
        parentChildCommFreq: formData.get("parentChildCommFreq") as string,
        offlineInstitute: formData.get("offlineInstitute") as string,
        parentsEnglishLevel: formData.get("parentsEnglishLevel") as string,
        learningGoal: formData.get("learningGoal") as string,
        specialNotes: formData.get("specialNotes") as string | null,
      },
    });

    // 如果匹配到了学员，同步到学员档案流水
    if (studentId) {
      await prisma.studentActivity.create({
        data: {
          studentId,
          type: 'SURVEY',
          title: `问卷提交: ${surveyType}`,
          description: `提交人: ${formData.get("parentName")} (${formData.get("relationship")})`,
          date: new Date(),
          refId: survey.id
        }
      });
      revalidatePath(`/students/${studentId}`);
    }

    revalidatePath("/surveys-manage");
    return { success: true, data: survey };
  } catch (error) {
    console.error("Failed to submit survey:", error);
    return { success: false, error: "Failed to submit survey data" };
  }
}

export async function getSurveyById(id: string) {
  try {
    const survey = await prisma.surveyResponse.findUnique({
      where: { id },
    });
    return { success: true, data: survey };
  } catch (error) {
    console.error("Failed to fetch survey:", error);
    return { success: false, error: "Failed to fetch survey" };
  }
}

export async function updateSurvey(
  id: string,
  data: Record<string, any>
) {
  try {
    const survey = await prisma.surveyResponse.update({
      where: { id },
      data,
    });
    revalidatePath("/surveys-manage");
    return { success: true, data: survey };
  } catch (error) {
    console.error("Failed to update survey:", error);
    return { success: false, error: "Failed to update survey" };
  }
}

export async function deleteSurvey(id: string) {
  try {
    await prisma.surveyResponse.delete({ where: { id } });
    revalidatePath("/surveys-manage");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete survey:", error);
    return { success: false, error: "Failed to delete survey" };
  }
}

export async function getSurveys(studentId?: string) {
  try {
    const surveys = await prisma.surveyResponse.findMany({
      where: studentId ? { studentId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    
    if (surveys.length === 0) {
      return { 
        success: true, 
        isDemo: true,
        data: [
          { id: 'sur-1', surveyType: 'PARENT', childNameCn: '王红华', parentName: '王晓梅', relationship: '妈妈', phone: '138****5678', createdAt: new Date() },
          { id: 'sur-2', surveyType: 'PARENT', childNameCn: '李铭宇', parentName: '李大壮', relationship: '爸爸', phone: '139****1234', createdAt: new Date() },
          { id: 'sur-3', surveyType: 'ENGLISH', childNameCn: '张子轩', parentName: '张建国', relationship: '爸爸', phone: '150****8888', createdAt: new Date() }
        ]
      };
    }
    return { success: true, data: surveys };
  } catch (error) {
    console.warn("⚠️ [数据库异常] 正在回退至问卷记录预览模式");
    return { 
      success: true, 
      isDemo: true,
      data: [{ id: 'sur-1', surveyType: 'PARENT', childNameCn: '预览学员', parentName: '演示家长', relationship: '妈妈', phone: '138****0000', createdAt: new Date() }]
    };
  }
}

export async function submitDynamicSurvey(formData: FormData) {
  try {
    const templateId = formData.get("templateId") as string;
    const surveyType = formData.get("surveyType") as string;
    const phone = formData.get("phone") as string;

    const data: Record<string, any> = { surveyType, templateId };

    formData.forEach((value, key) => {
      if (key !== "templateId" && key !== "surveyType") {
        data[key] = value;
      }
    });

    if (phone) {
      const student = await prisma.student.findFirst({
        where: { parentPhone: phone },
      });
      if (student) {
        data.studentId = student.id;
      }
    }

    const survey = await prisma.surveyResponse.create({ data: data as any });

    revalidatePath("/surveys-manage");
    return { success: true, data: survey };
  } catch (error) {
    console.error("Failed to submit dynamic survey:", error);
    return { success: false, error: "Failed to submit survey data" };
  }
}

export async function getSurveyTemplates() {
  try {
    const templates = await prisma.surveyTemplate.findMany({
      include: { questions: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });

    if (templates.length === 0) {
      return {
        success: true,
        isDemo: true,
        data: [
          { id: 't-1', name: '家长满意度调查(演示)', slug: 'parent-demo', description: '评估机构整体服务质量', isActive: true, createdAt: new Date() },
          { id: 't-2', name: '新生入学摸底(演示)', slug: 'entry-demo', description: '了解学员基础水平', isActive: true, createdAt: new Date() }
        ]
      };
    }
    return { success: true, data: templates };
  } catch (error) {
    return {
      success: true,
      isDemo: true,
      data: [{ id: 't-1', name: '全能调查模板(演示)', slug: 'all-in-one', description: '由于数据库离线，由系统生成的预览模板', isActive: true, createdAt: new Date() }]
    };
  }
}

export async function getSurveyTemplateById(id: string) {
  try {
    const template = await prisma.surveyTemplate.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    return { success: true, data: template };
  } catch (error) {
    console.error("Failed to fetch template:", error);
    return { success: false, error: "Failed to fetch template" };
  }
}

export async function getSurveyTemplateBySlug(slug: string) {
  try {
    const template = await prisma.surveyTemplate.findUnique({
      where: { slug },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    return { success: true, data: template };
  } catch (error) {
    console.error("Failed to fetch template:", error);
    return { success: false, error: "Failed to fetch template" };
  }
}

export async function createSurveyTemplate(data: {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  questions?: {
    label: string;
    fieldName: string;
    fieldType?: string;
    options?: string;
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    order?: number;
  }[];
}) {
  try {
    const { questions, ...templateData } = data;
    const template = await prisma.surveyTemplate.create({
      data: {
        ...templateData,
        questions: questions ? { create: questions } : undefined,
      },
      include: { questions: true },
    });
    revalidatePath("/survey-templates");
    return { success: true, data: template };
  } catch (error) {
    console.error("Failed to create template:", error);
    return { success: false, error: "Failed to create template" };
  }
}

export async function updateSurveyTemplate(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
  }
) {
  try {
    const template = await prisma.surveyTemplate.update({
      where: { id },
      data,
    });
    revalidatePath("/survey-templates");
    return { success: true, data: template };
  } catch (error) {
    console.error("Failed to update template:", error);
    return { success: false, error: "Failed to update template" };
  }
}

export async function deleteSurveyTemplate(id: string) {
  try {
    await prisma.surveyTemplate.delete({ where: { id } });
    revalidatePath("/survey-templates");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete template:", error);
    return { success: false, error: "Failed to delete template" };
  }
}

export async function addSurveyQuestion(
  templateId: string,
  data: {
    label: string;
    fieldName: string;
    fieldType?: string;
    options?: string;
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    order?: number;
  }
) {
  try {
    const question = await prisma.surveyQuestion.create({
      data: { templateId, ...data },
    });
    revalidatePath("/survey-templates");
    return { success: true, data: question };
  } catch (error) {
    console.error("Failed to add question:", error);
    return { success: false, error: "Failed to add question" };
  }
}

export async function updateSurveyQuestion(
  id: string,
  data: {
    label?: string;
    fieldName?: string;
    fieldType?: string;
    options?: string;
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    order?: number;
  }
) {
  try {
    const question = await prisma.surveyQuestion.update({
      where: { id },
      data,
    });
    revalidatePath("/survey-templates");
    return { success: true, data: question };
  } catch (error) {
    console.error("Failed to update question:", error);
    return { success: false, error: "Failed to update question" };
  }
}

export async function deleteSurveyQuestion(id: string) {
  try {
    await prisma.surveyQuestion.delete({ where: { id } });
    revalidatePath("/survey-templates");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete question:", error);
    return { success: false, error: "Failed to delete question" };
  }
}

export async function reorderSurveyQuestions(
  questions: { id: string; order: number }[]
) {
  try {
    await prisma.$transaction(
      questions.map((q) =>
        prisma.surveyQuestion.update({
          where: { id: q.id },
          data: { order: q.order },
        })
      )
    );
    revalidatePath("/survey-templates");
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder questions:", error);
    return { success: false, error: "Failed to reorder questions" };
  }
}

export async function seedDefaultTemplates() {
  try {
    await prisma.surveyQuestion.deleteMany({});
    await prisma.surveyTemplate.deleteMany({});

    const parentTemplate = await prisma.surveyTemplate.create({
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
      include: { questions: true },
    });

    const englishTemplate = await prisma.surveyTemplate.create({
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
      include: { questions: true },
    });

    revalidatePath("/survey-templates");
    return { success: true, data: [parentTemplate, englishTemplate] };
  } catch (error) {
    console.error("Failed to seed templates:", error);
    return { success: false, error: "Failed to seed templates" };
  }
}

export async function linkSurveysToStudents() {
  try {
    const surveys = await prisma.surveyResponse.findMany({
      where: { studentId: null },
    });

    for (const survey of surveys) {
      if (survey.phone) {
        const student = await prisma.student.findFirst({
          where: { parentPhone: survey.phone },
        });
        if (student) {
          await prisma.surveyResponse.update({
            where: { id: survey.id },
            data: { studentId: student.id },
          });
        }
      }
    }

    revalidatePath("/surveys-manage");
    return { success: true, data: { linked: surveys.length } };
  } catch (error) {
    console.error("Failed to link surveys:", error);
    return { success: false, error: "Failed to link surveys" };
  }
}
