import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const surveys = await prisma.surveyResponse.findMany({
      where: { studentId: null },
    });

    let linkedCount = 0;
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
          linkedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, linked: linkedCount, total: surveys.length })
  } catch (error) {
    console.error("Failed to link surveys:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
