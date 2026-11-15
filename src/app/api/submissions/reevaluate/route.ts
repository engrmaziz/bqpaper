import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { evaluateSubjectiveAnswersWithCascade } from "@/lib/groq";
import { saveSubmission } from "@/lib/storage";
import { MCQ_QUESTIONS } from "@/data/examData";
import { AssessmentResult, StudentAnswers } from "@/types/exam";
import { verifyExaminerToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Re-evaluation Endpoint for Examiner:
 * Re-grades student papers using stored answers in Supabase via Groq -> Gemini -> Rubric cascade.
 * Can re-evaluate a specific student or batch re-evaluate all 0-score submissions.
 */
export async function POST(req: NextRequest) {
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
        { error: "Access Denied: Only authorized examiners can re-evaluate exam submissions." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { submissionId, rollNumber, reevaluateAllZeros } = body as {
      submissionId?: string;
      rollNumber?: string;
      reevaluateAllZeros?: boolean;
    };

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
    }

    let query = supabase.from("student_submissions").select("*");

    if (submissionId) {
      query = query.eq("id", submissionId);
    } else if (rollNumber) {
      query = query.eq("roll_number", rollNumber.trim().toUpperCase());
    } else if (reevaluateAllZeros) {
      query = query.eq("total_score", 0);
    } else {
      return NextResponse.json(
        { error: "Please provide submissionId, rollNumber, or reevaluateAllZeros: true" },
        { status: 400 }
      );
    }

    const { data: rows, error } = await query;
    if (error || !rows || rows.length === 0) {
      return NextResponse.json({
        message: "No matching submissions found to re-evaluate.",
        count: 0,
      });
    }

    const results: any[] = [];

    for (const row of rows) {
      const answers: StudentAnswers = row.answers;
      if (!answers) {
        results.push({
          id: row.id,
          studentName: row.student_name,
          rollNumber: row.roll_number,
          status: "skipped_no_stored_answers",
        });
        continue;
      }

      // 1. Calculate MCQs deterministically
      let mcqScore = 0;
      const mcqResults = MCQ_QUESTIONS.map((q) => {
        const studentAns = answers.mcqs?.[q.id] || "";
        const isCorrect = studentAns === q.correct;
        if (isCorrect) mcqScore += 1;
        return {
          id: q.id,
          studentAnswer: studentAns,
          correctAnswer: q.correct,
          isCorrect,
          explanation: q.explanation,
        };
      });

      // 2. Run Multi-Tier Evaluation Cascade (Groq -> Gemini -> Rubric)
      const aiResult = await evaluateSubjectiveAnswersWithCascade(answers);

      const rawTotal =
        mcqScore +
        aiResult.sectionScores.sectionB +
        aiResult.sectionScores.sectionC +
        aiResult.sectionScores.sectionD;
      const totalScore = Math.min(100, Math.max(0, Math.round(rawTotal * 10) / 10));
      const percentage = totalScore;

      let grade: AssessmentResult["grade"] = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B";
      else if (percentage >= 60) grade = "C";
      else if (percentage >= 50) grade = "D";

      const updatedAssessment: AssessmentResult = {
        id: row.id,
        student: row.student_raw || {
          id: row.id,
          name: row.student_name,
          email: row.student_email,
          rollNumber: row.roll_number,
          section: row.section,
          startTime: Date.now(),
        },
        submittedAt:
          row.submitted_at ||
          new Date(row.created_at).toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
        timeSpentSeconds: row.time_spent_seconds || 60,
        sectionScores: {
          sectionA: mcqScore,
          sectionB: aiResult.sectionScores.sectionB,
          sectionC: aiResult.sectionScores.sectionC,
          sectionD: aiResult.sectionScores.sectionD,
        },
        totalScore,
        percentage,
        grade,
        evaluatedBy: aiResult.evaluatedBy,
        modelUsed: aiResult.modelUsed,
        mcqResults,
        subjectiveFeedback: aiResult.subjectiveFeedback,
        generalFeedback: aiResult.generalFeedback,
      };

      await saveSubmission(updatedAssessment, answers);

      results.push({
        id: row.id,
        studentName: row.student_name,
        rollNumber: row.roll_number,
        previousScore: row.total_score,
        newScore: totalScore,
        newGrade: grade,
        evaluatedBy: aiResult.evaluatedBy,
        modelUsed: aiResult.modelUsed,
      });
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      reevaluated: results,
    });
  } catch (err: any) {
    console.error("[Re-evaluate API Error]:", err);
    return NextResponse.json({ error: err?.message || "Re-evaluation failed." }, { status: 500 });
  }
}
