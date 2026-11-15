import { NextRequest, NextResponse } from "next/server";
import { StudentInfo, StudentAnswers, AssessmentResult } from "@/types/exam";
import { evaluateSubjectiveAnswersWithCascade } from "@/lib/groq";
import { saveRawStudentSubmission, saveSubmission, checkStudentAlreadySubmitted } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let incomingStudent: StudentInfo | null = null;
  let incomingAnswers: StudentAnswers | null = null;
  let baselineAssessment: AssessmentResult | null = null;

  try {
    const body = await req.json();
    const { student, answers } = body as {
      student: StudentInfo;
      answers: StudentAnswers;
    };

    incomingStudent = student;
    incomingAnswers = answers;

    if (!student || !student.name || !student.rollNumber || !answers) {
      return NextResponse.json(
        { error: "Student registration details and answers are required." },
        { status: 400 }
      );
    }

    // 1. Single Attempt Check: Prevent retaking or duplicating submissions
    const existingCheck = await checkStudentAlreadySubmitted(student.rollNumber, student.email);
    if (existingCheck.exists && existingCheck.submission) {
      console.log(`[Single Attempt Policy] Student ${student.name} (${student.rollNumber}) already submitted. Returning existing record.`);
      return NextResponse.json(existingCheck.submission);
    }

    // =========================================================================
    // STEP 2: PERSIST TO SUPABASE IMMEDIATELY BEFORE ANY AI EVALUATION CALLS
    // =========================================================================
    // We compute instantaneous MCQ scores (20 marks) and deterministic rubric
    // baseline scores and save the FULL raw answers to Supabase FIRST.
    // If Groq, Gemini, or internet fail or timeout later, the student's paper
    // and legitimate marks are 100% permanently secured in Supabase!
    const timeSpent = Math.max(60, Math.round((Date.now() - (student.startTime || Date.now())) / 1000));
    const preSave = await saveRawStudentSubmission(student, answers, timeSpent);
    baselineAssessment = preSave.baselineAssessment;
    let activeAssessment: AssessmentResult = { ...baselineAssessment };

    console.log(`[Zero Data Loss] Raw answers and baseline (${baselineAssessment.totalScore} marks) secured in Supabase for ${student.name}`);

    // =========================================================================
    // STEP 3: MULTI-TIER AI EVALUATION (Groq AI -> Gemini AI -> OpenRouter AI)
    // =========================================================================
    try {
      const aiResult = await evaluateSubjectiveAnswersWithCascade(answers);

      if (
        aiResult &&
        (aiResult.evaluatedBy === "groq-ai" ||
          aiResult.evaluatedBy === "gemini-ai" ||
          aiResult.evaluatedBy === "openrouter-ai")
      ) {
        const mcqScore = baselineAssessment.sectionScores.sectionA;
        const aiRawTotal = mcqScore + aiResult.sectionScores.sectionB + aiResult.sectionScores.sectionC + aiResult.sectionScores.sectionD;
        const aiTotalScore = Math.min(100, Math.max(0, Math.round(aiRawTotal * 10) / 10));
        const aiPercentage = aiTotalScore;

        let aiGrade: AssessmentResult["grade"] = "F";
        if (aiPercentage >= 90) aiGrade = "A+";
        else if (aiPercentage >= 80) aiGrade = "A";
        else if (aiPercentage >= 70) aiGrade = "B";
        else if (aiPercentage >= 60) aiGrade = "C";
        else if (aiPercentage >= 50) aiGrade = "D";

        activeAssessment = {
          ...activeAssessment,
          sectionScores: {
            sectionA: mcqScore,
            sectionB: aiResult.sectionScores.sectionB,
            sectionC: aiResult.sectionScores.sectionC,
            sectionD: aiResult.sectionScores.sectionD,
          },
          totalScore: aiTotalScore,
          percentage: aiPercentage,
          grade: aiGrade,
          evaluatedBy: aiResult.evaluatedBy,
          modelUsed: aiResult.modelUsed,
          subjectiveFeedback: aiResult.subjectiveFeedback,
          generalFeedback: aiResult.generalFeedback,
        };

        // Re-persist enhanced AI marks to Supabase
        await saveSubmission(activeAssessment, answers);
        console.log(`[AI Evaluation Complete] Evaluated by ${aiResult.evaluatedBy} (${aiResult.modelUsed}) with total score: ${aiTotalScore}`);
      }
    } catch (aiError) {
      console.warn("[AI Evaluation Bypass] Both Groq and Gemini were unreachable. Preserving rubric baseline assessment:", aiError);
    }

    return NextResponse.json(activeAssessment);
  } catch (error: any) {
    console.error("Evaluation Route Fatal Error:", error);

    // CRITICAL FIX: NEVER ZERO OUT STUDENT MARKS!
    // If baseline was already computed, return it safely.
    if (baselineAssessment) {
      return NextResponse.json(baselineAssessment);
    }

    // Emergency Fallback: If anything failed before baseline, still compute MCQ and rubric baseline
    if (incomingStudent && incomingAnswers) {
      try {
        const emergencySave = await saveRawStudentSubmission(incomingStudent, incomingAnswers);
        return NextResponse.json(emergencySave.baselineAssessment);
      } catch (saveErr) {
        console.error("Emergency save failed:", saveErr);
      }
    }

    return NextResponse.json(
      { error: error?.message || "Internal evaluation error occurred." },
      { status: 500 }
    );
  }
}
