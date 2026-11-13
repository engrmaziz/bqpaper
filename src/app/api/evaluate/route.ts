import { NextRequest, NextResponse } from "next/server";
import { StudentInfo, StudentAnswers, AssessmentResult } from "@/types/exam";
import { MCQ_QUESTIONS } from "@/data/examData";
import { evaluateSubjectiveAnswersWithGroq } from "@/lib/groq";
import { saveSubmission } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student, answers } = body as {
      student: StudentInfo;
      answers: StudentAnswers;
    };

    if (!student || !student.name || !student.email || !answers) {
      return NextResponse.json(
        { error: "Student registration details and answers are required." },
        { status: 400 }
      );
    }

    // 1. Evaluate Section A (MCQs: 20 Marks)
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

    // 2. Evaluate Sections B, C, D with Groq AI (or Fallback Engine)
    const subjectiveEval = await evaluateSubjectiveAnswersWithGroq(answers);

    const sectionA = mcqScore;
    const sectionB = subjectiveEval.sectionScores.sectionB;
    const sectionC = subjectiveEval.sectionScores.sectionC;
    const sectionD = subjectiveEval.sectionScores.sectionD;

    const totalRaw = sectionA + sectionB + sectionC + sectionD;
    const totalScore = Math.min(100, Math.max(0, Math.round(totalRaw * 10) / 10));
    const percentage = totalScore;

    let grade: AssessmentResult["grade"] = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";

    const timeSpent = Math.max(60, Math.round((Date.now() - (student.startTime || Date.now())) / 1000));

    const assessmentResult: AssessmentResult = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      student,
      submittedAt: new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
      timeSpentSeconds: timeSpent,
      sectionScores: {
        sectionA,
        sectionB,
        sectionC,
        sectionD,
      },
      totalScore,
      percentage,
      grade,
      evaluatedBy: subjectiveEval.evaluatedBy,
      modelUsed: subjectiveEval.modelUsed,
      mcqResults,
      subjectiveFeedback: subjectiveEval.subjectiveFeedback,
      generalFeedback: subjectiveEval.generalFeedback,
    };

    // Save submission for teacher dashboard & marksheet
    saveSubmission(assessmentResult);

    return NextResponse.json(assessmentResult);
  } catch (error: any) {
    console.error("Evaluation Route Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal evaluation error occurred." },
      { status: 500 }
    );
  }
}
