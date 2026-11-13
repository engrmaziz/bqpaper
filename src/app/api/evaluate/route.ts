import { NextRequest, NextResponse } from "next/server";
import { StudentInfo, StudentAnswers, AssessmentResult } from "@/types/exam";
import { MCQ_QUESTIONS } from "@/data/examData";
import { evaluateSubjectiveAnswersWithGroq, runFallbackEvaluationEngine } from "@/lib/groq";
import { saveSubmission, checkStudentAlreadySubmitted } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let incomingStudent: StudentInfo | null = null;
  let incomingAnswers: StudentAnswers | null = null;

  try {
    const body = await req.json();
    const { student, answers } = body as {
      student: StudentInfo;
      answers: StudentAnswers;
    };

    incomingStudent = student;
    incomingAnswers = answers;

    if (!student || !student.name || !student.email || !student.rollNumber || !answers) {
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

    // 2. Immediate Section A Objective Evaluation (MCQs: 20 Marks)
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

    // 3. Guaranteed Baseline Assessment via Heuristic Rubric Engine
    // (Instant, 0 latency, guarantees complete evaluation even if Groq is 100% down)
    const fallbackEval = runFallbackEvaluationEngine(answers);
    const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timeSpent = Math.max(60, Math.round((Date.now() - (student.startTime || Date.now())) / 1000));
    const submittedTimeStr = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

    const rawTotal = mcqScore + fallbackEval.sectionScores.sectionB + fallbackEval.sectionScores.sectionC + fallbackEval.sectionScores.sectionD;
    const totalScore = Math.min(100, Math.max(0, Math.round(rawTotal * 10) / 10));
    const percentage = totalScore;

    let grade: AssessmentResult["grade"] = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";

    let activeAssessment: AssessmentResult = {
      id: subId,
      student,
      submittedAt: submittedTimeStr,
      timeSpentSeconds: timeSpent,
      sectionScores: {
        sectionA: mcqScore,
        sectionB: fallbackEval.sectionScores.sectionB,
        sectionC: fallbackEval.sectionScores.sectionC,
        sectionD: fallbackEval.sectionScores.sectionD,
      },
      totalScore,
      percentage,
      grade,
      evaluatedBy: "fallback-rubric",
      modelUsed: "deterministic-rubric-engine",
      mcqResults,
      subjectiveFeedback: fallbackEval.subjectiveFeedback,
      generalFeedback: fallbackEval.generalFeedback,
    };

    // =========================================================================
    // CRITICAL STEP: PERSIST TO SUPABASE FIRST
    // Save student answers & metadata to Supabase IMMEDIATELY before attempting
    // any external API calls (Groq). If Groq is down, slow, or times out, the
    // student's complete paper, name, email, roll number, and every single answer
    // are ALREADY 100% permanently secured in Supabase!
    // =========================================================================
    await saveSubmission(activeAssessment, answers);

    // 4. Enhance with Groq AI Evaluation (If available and within timeout)
    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (apiKey && apiKey.trim().length > 10) {
        const groqResult = await evaluateSubjectiveAnswersWithGroq(answers);
        if (groqResult && groqResult.evaluatedBy === "groq-ai") {
          const aiRawTotal = mcqScore + groqResult.sectionScores.sectionB + groqResult.sectionScores.sectionC + groqResult.sectionScores.sectionD;
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
              sectionB: groqResult.sectionScores.sectionB,
              sectionC: groqResult.sectionScores.sectionC,
              sectionD: groqResult.sectionScores.sectionD,
            },
            totalScore: aiTotalScore,
            percentage: aiPercentage,
            grade: aiGrade,
            evaluatedBy: "groq-ai",
            modelUsed: groqResult.modelUsed,
            subjectiveFeedback: groqResult.subjectiveFeedback,
            generalFeedback: groqResult.generalFeedback,
          };

          // Re-persist updated AI marks to Supabase
          await saveSubmission(activeAssessment, answers);
        }
      }
    } catch (groqError) {
      console.warn("[Groq AI Bypass] Groq was down or unresponsive. Student paper is safely preserved in Supabase with rubric assessment:", groqError);
    }

    return NextResponse.json(activeAssessment);
  } catch (error: any) {
    console.error("Evaluation Route Fatal Error:", error);

    // Emergency Fallback: If anything failed, still ensure the student paper is saved in Supabase
    if (incomingStudent && incomingAnswers) {
      try {
        const emergencyResult: AssessmentResult = {
          id: `sub_emerg_${Date.now()}`,
          student: incomingStudent,
          submittedAt: new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
          timeSpentSeconds: 60,
          sectionScores: { sectionA: 0, sectionB: 0, sectionC: 0, sectionD: 0 },
          totalScore: 0,
          percentage: 0,
          grade: "F",
          evaluatedBy: "fallback-rubric",
          modelUsed: "emergency-backup",
          mcqResults: [],
          subjectiveFeedback: {},
          generalFeedback: {
            strengths: ["Submission safely received by central server"],
            improvements: ["Paper queued for manual examiner grading"],
            summary: "Your answers have been permanently saved in the examination records.",
          },
        };
        await saveSubmission(emergencyResult, incomingAnswers);
        return NextResponse.json(emergencyResult);
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
