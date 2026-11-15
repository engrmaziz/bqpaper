import { NextRequest, NextResponse } from "next/server";
import { StudentInfo, StudentAnswers } from "@/types/exam";
import { saveRawStudentSubmission } from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * Pre-Evaluation Storage Endpoint:
 * Stores complete raw candidate answers into Supabase BEFORE any external AI calls.
 * Guarantees zero data loss even if AI APIs fail, crash, or time out.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student, answers, timeSpentSeconds } = body as {
      student: StudentInfo;
      answers: StudentAnswers;
      timeSpentSeconds?: number;
    };

    if (!student || !student.name || !student.rollNumber || !answers) {
      return NextResponse.json(
        { error: "Student details and answers are required for pre-evaluation persistence." },
        { status: 400 }
      );
    }

    const { baselineAssessment } = await saveRawStudentSubmission(student, answers, timeSpentSeconds);

    console.log(`[Pre-Evaluation Storage] 100% saved raw answers to Supabase for ${student.name} (${student.rollNumber})`);

    return NextResponse.json({
      success: true,
      message: "Candidate answers securely stored in examination database.",
      submission: baselineAssessment,
    });
  } catch (err: any) {
    console.error("[Pre-Evaluation Storage Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to store raw candidate answers." },
      { status: 500 }
    );
  }
}
