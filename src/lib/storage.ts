import { AssessmentResult } from "@/types/exam";
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

export function getAllSubmissions(): AssessmentResult[] {
  try {
    ensureFileStore();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list) && list.length > 0) {
        // Merge with in-memory to prevent lost updates across lambda instances
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

export function saveSubmission(submission: AssessmentResult): void {
  // Prepend to in-memory
  inMemorySubmissions = [submission, ...inMemorySubmissions.filter(s => s.id !== submission.id)];
  
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
    // Ignore error in serverless read-only environment
  }
}
