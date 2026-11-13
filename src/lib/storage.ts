import { AssessmentResult, StudentAnswers } from "@/types/exam";
import { getSupabaseClient } from "@/lib/supabase";
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
      const record = {
        id: submission.id,
        student_name: submission.student.name,
        student_email: submission.student.email,
        roll_number: submission.student.rollNumber,
        section: submission.student.section,
        student_raw: submission.student,
        answers: rawAnswers || null,
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
        console.warn("Supabase save warning:", error.message);
      } else {
        console.log(`[Supabase] Successfully saved full paper for ${submission.student.name} (${submission.student.rollNumber})`);
      }
    } catch (err) {
      console.warn("Supabase persistence error:", err);
    }
  }
}
