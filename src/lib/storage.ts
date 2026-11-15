import { AssessmentResult, StudentAnswers, StudentInfo } from "@/types/exam";
import { getSupabaseClient } from "@/lib/supabase";
import { MCQ_QUESTIONS } from "@/data/examData";
import { runFallbackEvaluationEngine } from "@/lib/groq";
import { buildCompleteExamPaper } from "@/lib/examQuestionsMap";
import fs from "fs";
import path from "path";

// In-memory store for serverless / Vercel runtime
let inMemorySubmissions: AssessmentResult[] = [];

// Seed initial sample submissions for demonstration on the marksheet
const INITIAL_DEMO_SUBMISSIONS: AssessmentResult[] = [
  {
    id: "sub_demo_001",
    student: {
      id: "std_001",
      name: "Muhammad Bilal",
      email: "bilal.ahmed@example.com",
      rollNumber: "BQ-801",
      section: "Grade 8A",
      startTime: Date.now() - 3600000,
    },
    submittedAt: new Date(Date.now() - 3000000).toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
    timeSpentSeconds: 4200,
    sectionScores: {
      sectionA: 19,
      sectionB: 9.5,
      sectionC: 18.0,
      sectionD: 46.5,
    },
    totalScore: 93,
    percentage: 93,
    grade: "A+",
    evaluatedBy: "groq-ai",
    modelUsed: "llama-3.3-70b-versatile",
    mcqResults: [],
    subjectiveFeedback: {},
    generalFeedback: {
      strengths: ["Exceptional precision in voice assistant architecture", "Comprehensive data cleaning troubleshooting"],
      improvements: ["Review the exact difference between ANI and AGI"],
      summary: "Outstanding performance! Shows profound maturity in AI concepts.",
    },
  },
  {
    id: "sub_demo_002",
    student: {
      id: "std_002",
      name: "Zainab Fatima",
      email: "zainab.f@example.com",
      rollNumber: "BQ-802",
      section: "Grade 8B",
      startTime: Date.now() - 7200000,
    },
    submittedAt: new Date(Date.now() - 6500000).toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
    timeSpentSeconds: 4600,
    sectionScores: {
      sectionA: 18,
      sectionB: 8.5,
      sectionC: 16.5,
      sectionD: 42.0,
    },
    totalScore: 85,
    percentage: 85,
    grade: "A",
    evaluatedBy: "groq-ai",
    modelUsed: "llama-3.3-70b-versatile",
    mcqResults: [],
    subjectiveFeedback: {},
    generalFeedback: {
      strengths: ["Well structured 4-part prompt recipe", "Correct accuracy formula and business insight"],
      improvements: ["Provide more depth on sarcasm traps in Roman Urdu"],
      summary: "Very solid grasp of practical AI tools and ethics.",
    },
  },
  {
    id: "sub_demo_003",
    student: {
      id: "std_003",
      name: "Hamza Tariq",
      email: "hamza.t@example.com",
      rollNumber: "BQ-803",
      section: "Grade 8A",
      startTime: Date.now() - 10800000,
    },
    submittedAt: new Date(Date.now() - 10200000).toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
    timeSpentSeconds: 4750,
    sectionScores: {
      sectionA: 16,
      sectionB: 7.0,
      sectionC: 15.0,
      sectionD: 38.0,
    },
    totalScore: 76,
    percentage: 76,
    grade: "B",
    evaluatedBy: "fallback-rubric",
    modelUsed: "deterministic-rubric-engine",
    mcqResults: [],
    subjectiveFeedback: {},
    generalFeedback: {
      strengths: ["Good understanding of supervised learning and Easypaisa case"],
      improvements: ["Review why patient names must be stripped from datasets"],
      summary: "Good practical work, keep refining prompt constraints.",
    },
  }
];

inMemorySubmissions = [...INITIAL_DEMO_SUBMISSIONS];

const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

function ensureFileStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DEMO_SUBMISSIONS, null, 2), "utf-8");
    }
  } catch (e) {
    // Ignore error in serverless read-only environment
  }
}

export async function checkStudentAlreadySubmitted(
  rollNumber: string,
  email?: string
): Promise<{ exists: boolean; submission?: AssessmentResult }> {
  const normRoll = (rollNumber || "").trim().toUpperCase();
  const normEmail = (email || "").trim().toLowerCase();

  // 1. Check Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from("student_submissions").select("*");
      if (normRoll && normEmail) {
        query = query.or(`roll_number.eq.${normRoll},student_email.eq.${normEmail}`);
      } else if (normRoll) {
        query = query.eq("roll_number", normRoll);
      } else if (normEmail) {
        query = query.eq("student_email", normEmail);
      }

      const { data, error } = await query.limit(1);
      if (!error && Array.isArray(data) && data.length > 0) {
        const row = data[0];

        // Recovery clause: If a previous attempt resulted in an empty crash (Score 0, no MCQs), allow retry/resubmit
        const isCrashedZeroSubmission =
          Number(row.total_score) === 0 &&
          (!row.mcq_results || (Array.isArray(row.mcq_results) && row.mcq_results.length === 0)) &&
          (!row.answers || Object.keys(row.answers?.mcqs || {}).length === 0);

        if (!isCrashedZeroSubmission) {
          return {
            exists: true,
            submission: {
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
              timeSpentSeconds: row.time_spent_seconds || 0,
              sectionScores:
                row.section_scores || { sectionA: 0, sectionB: 0, sectionC: 0, sectionD: 0 },
              totalScore: Number(row.total_score) || 0,
              percentage: Number(row.percentage) || 0,
              grade: row.grade || "F",
              evaluatedBy: row.evaluated_by || "fallback-rubric",
              modelUsed: row.model_used || "deterministic-rubric-engine",
              mcqResults: row.mcq_results || [],
              subjectiveFeedback: row.subjective_feedback || {},
              generalFeedback:
                row.general_feedback || { strengths: [], improvements: [], summary: "" },
            },
          };
        } else {
          console.log(`[Submission Recovery] Student ${normRoll} has an empty zero-crash record from the API crash. Permitting fresh paper submission.`);
        }
      }
    } catch (e) {
      console.warn("Supabase check error:", e);
    }
  }

  // 2. Check in-memory store
  const found = inMemorySubmissions.find(
    (s) =>
      (normRoll && s.student.rollNumber?.trim().toUpperCase() === normRoll) ||
      (normEmail && s.student.email?.trim().toLowerCase() === normEmail)
  );

  if (found) {
    return { exists: true, submission: found };
  }

  return { exists: false };
}

export async function getAllSubmissions(): Promise<AssessmentResult[]> {
  // 1. Try querying Supabase (Persistent cloud database)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("student_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mappedList: AssessmentResult[] = data.map((row: any) => ({
          id: row.id,
          student: row.student_raw || {
            id: row.id,
            name: row.student_name,
            email: row.student_email,
            rollNumber: row.roll_number,
            section: row.section,
            startTime: Date.now(),
          },
          submittedAt: row.submitted_at || new Date(row.created_at).toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
          timeSpentSeconds: row.time_spent_seconds || 0,
          sectionScores: row.section_scores || { sectionA: 0, sectionB: 0, sectionC: 0, sectionD: 0 },
          totalScore: Number(row.total_score) || 0,
          percentage: Number(row.percentage) || 0,
          grade: row.grade || "F",
          evaluatedBy: row.evaluated_by || "fallback-rubric",
          modelUsed: row.model_used || "deterministic-rubric-engine",
          mcqResults: row.mcq_results || [],
          subjectiveFeedback: row.subjective_feedback || {},
          generalFeedback: row.general_feedback || { strengths: [], improvements: [], summary: "" },
        }));

        // Merge with in-memory to ensure zero data discrepancy
        const mergedMap = new Map<string, AssessmentResult>();
        mappedList.forEach((s) => mergedMap.set(s.id, s));
        inMemorySubmissions.forEach((s) => {
          if (!mergedMap.has(s.id)) mergedMap.set(s.id, s);
        });

        return Array.from(mergedMap.values());
      }
    } catch (err) {
      console.warn("Supabase fetch warning:", err);
    }
  }

  // 2. Fallback to local file store
  try {
    ensureFileStore();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list) && list.length > 0) {
        const mergedMap = new Map<string, AssessmentResult>();
        list.forEach((s) => mergedMap.set(s.id, s));
        inMemorySubmissions.forEach((s) => mergedMap.set(s.id, s));
        return Array.from(mergedMap.values());
      }
    }
  } catch {
    // Fallback to in-memory
  }

  return inMemorySubmissions;
}

export async function saveSubmission(submission: AssessmentResult, rawAnswers?: StudentAnswers): Promise<void> {
  // 1. Prepend to in-memory
  inMemorySubmissions = [submission, ...inMemorySubmissions.filter((s) => s.id !== submission.id)];

  // 2. Save to local/tmp file system
  try {
    ensureFileStore();
    let currentList: AssessmentResult[] = [];
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        currentList = JSON.parse(raw);
      } catch {}
    }
    const mergedMap = new Map<string, AssessmentResult>();
    currentList.forEach((s) => mergedMap.set(s.id, s));
    mergedMap.set(submission.id, submission);
    const combined = Array.from(mergedMap.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(combined, null, 2), "utf-8");
  } catch {
    // Ignore in read-only environment
  }

  // 3. Save to Supabase (Full student answers & grading permanently stored)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const pairedQuestionsAndAnswers = rawAnswers ? buildCompleteExamPaper(rawAnswers) : null;
      const enrichedAnswers = rawAnswers
        ? {
            ...rawAnswers,
            paired_questions_and_answers: pairedQuestionsAndAnswers,
            recorded_at: new Date().toISOString(),
          }
        : null;

      const record = {
        id: submission.id,
        student_name: submission.student.name,
        student_email: submission.student.email,
        roll_number: submission.student.rollNumber,
        section: submission.student.section,
        student_raw: submission.student,
        answers: enrichedAnswers,
        section_scores: submission.sectionScores,
        total_score: submission.totalScore,
        percentage: submission.percentage,
        grade: submission.grade,
        evaluated_by: submission.evaluatedBy,
        model_used: submission.modelUsed,
        mcq_results: submission.mcqResults,
        subjective_feedback: submission.subjectiveFeedback,
        general_feedback: submission.generalFeedback,
        time_spent_seconds: submission.timeSpentSeconds,
        submitted_at: submission.submittedAt,
      };

      const { error } = await supabase
        .from("student_submissions")
        .upsert(record, { onConflict: "id" });

      if (error) {
        console.error(`[Supabase CRITICAL] Error saving submission for ${submission.student.name} (${submission.student.rollNumber}):`, error.message, error.details);
      } else {
        console.log(`[Supabase] Successfully saved full paper for ${submission.student.name} (${submission.student.rollNumber})`);
      }
    } catch (err) {
      console.error("[Supabase Persistence Error]:", err);
    }
  }
}

/**
 * Persists full candidate answers to Supabase IMMEDIATELY before any AI evaluation.
 * Computes deterministic MCQ scores + heuristic rubric baseline so answers and
 * legitimate marks are NEVER lost, even if external AI APIs crash or timeout.
 */
export async function saveRawStudentSubmission(
  student: StudentInfo,
  answers: StudentAnswers,
  timeSpentSeconds?: number
): Promise<{ success: boolean; baselineAssessment: AssessmentResult }> {
  // 1. Calculate Section A (MCQs: 20 Marks) deterministically (instant, 0% failure chance)
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

  // 2. Guaranteed Heuristic Rubric Engine (Instant, robust, never 0 for answered questions)
  const fallbackEval = runFallbackEvaluationEngine(answers);
  const timeSpent =
    timeSpentSeconds ||
    Math.max(60, Math.round((Date.now() - (student.startTime || Date.now())) / 1000));
  const submittedTimeStr = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

  const rawTotal =
    mcqScore +
    fallbackEval.sectionScores.sectionB +
    fallbackEval.sectionScores.sectionC +
    fallbackEval.sectionScores.sectionD;
  const totalScore = Math.min(100, Math.max(0, Math.round(rawTotal * 10) / 10));
  const percentage = totalScore;

  let grade: AssessmentResult["grade"] = "F";
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B";
  else if (percentage >= 60) grade = "C";
  else if (percentage >= 50) grade = "D";

  const normRoll = (student.rollNumber || "BQ-STUDENT").trim().toUpperCase();
  const subId = `sub_${normRoll.replace(/[^A-Z0-9]/g, "_")}_${Date.now()}`;

  const baselineAssessment: AssessmentResult = {
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

  // 3. PERSIST IMMEDIATELY TO SUPABASE WITH COMPLETE RAW CANDIDATE ANSWERS
  await saveSubmission(baselineAssessment, answers);

  return {
    success: true,
    baselineAssessment,
  };
}
