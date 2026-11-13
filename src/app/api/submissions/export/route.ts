import { NextRequest, NextResponse } from "next/server";
import { getAllSubmissions } from "@/lib/storage";
import { verifyExaminerToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const customHeader = req.headers.get("x-examiner-token");
    const { searchParams } = new URL(req.url);
    const queryToken = searchParams.get("token");

    const token = 
      (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null) ||
      customHeader ||
      queryToken;

    if (!verifyExaminerToken(token)) {
      return NextResponse.json(
        { 
          error: "Access Denied: Only io@maziz.me has authorization to download the class marksheet." 
        },
        { status: 403 }
      );
    }

    const list = getAllSubmissions();

    // CSV Headers
    const headers = [
      "Student Name",
      "Email Address",
      "Roll Number",
      "Section",
      "Submission Time",
      "Time Spent (Mins)",
      "Section A (MCQs /20)",
      "Section B (Short /10)",
      "Section C (Long /20)",
      "Section D (Project /50)",
      "Total Marks (/100)",
      "Percentage",
      "Letter Grade",
      "Evaluator Engine"
    ];

    const rows = list.map((s) => [
      `"${(s.student.name || '').replace(/"/g, '""')}"`,
      `"${(s.student.email || '').replace(/"/g, '""')}"`,
      `"${(s.student.rollNumber || '').replace(/"/g, '""')}"`,
      `"${(s.student.section || '').replace(/"/g, '""')}"`,
      `"${s.submittedAt}"`,
      Math.round(s.timeSpentSeconds / 60),
      s.sectionScores.sectionA,
      s.sectionScores.sectionB,
      s.sectionScores.sectionC,
      s.sectionScores.sectionD,
      s.totalScore,
      `"${s.percentage}%"`,
      `"${s.grade}"`,
      s.evaluatedBy === "groq-ai" ? `"Groq (${s.modelUsed})"` : `"Rubric Engine"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Bano_Qabil_AI_Midterm_Marksheet_${Date.now()}.csv"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
