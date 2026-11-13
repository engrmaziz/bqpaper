export interface ExamInfo {
  title: string;
  subtitle: string;
  courseCode: string;
  patron: string;
  instructors: string;
  targetGrade: string;
  timeAllowedMinutes: number;
  totalMarks: number;
}

export interface StudentInfo {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  section: string;
  startTime: number;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface ShortQuestion {
  id: string;
  title: string;
  marks: number;
  scenario: string;
  parts: {
    id: string;
    label: string;
    prompt: string;
    marks: number;
    rubric: string;
    sampleAnswer: string;
  }[];
}

export interface LongQuestion {
  id: string;
  title: string;
  marks: number;
  parts: {
    id: string;
    title: string;
    marks: number;
    prompt: string;
    rubric: string;
    sampleAnswer: string;
  }[];
}

export interface PracticalMilestone {
  id: string;
  title: string;
  marks: number;
  description: string;
  tasks: {
    id: string;
    prompt: string;
    marks: number;
    type: "text" | "table" | "prompt_recipe" | "math_insight";
    rubric: string;
    sampleAnswer: string;
  }[];
}

export interface StudentAnswers {
  mcqs: Record<number, "A" | "B" | "C" | "D">;
  shortQuestions: {
    q1_a: string;
    q1_b_sup: string;
    q1_b_unsup: string;
    q2_a: string;
    q2_b: string;
  };
  longQuestion: {
    part_a_chain: string;
    part_a_error: string;
    part_b_sarcasm: string;
    part_b_slang: string;
    part_c_strangers: string;
    part_c_doctor_ethics: string;
  };
  practicalProject: {
    m1_classes: string;
    m1_variations: string;
    m1_privacy: string;
    m2_table_types: string;
    m2_privacy_removal: string;
    m3_cleaning_fixes: string;
    m4_buttons: string;
    m4_prompt: string;
    m4_safety: string;
    m5_accuracy_math: string;
    m5_insight: string;
    m5_model_card: string;
  };
}

export interface QuestionFeedback {
  marksAwarded: number;
  maxMarks: number;
  feedback: string;
}

export interface AssessmentResult {
  id: string;
  student: StudentInfo;
  submittedAt: string;
  timeSpentSeconds: number;
  sectionScores: {
    sectionA: number; // /20
    sectionB: number; // /10
    sectionC: number; // /20
    sectionD: number; // /50
  };
  totalScore: number; // /100
  percentage: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  evaluatedBy: "groq-ai" | "fallback-rubric";
  modelUsed: string;
  mcqResults: {
    id: number;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  subjectiveFeedback: Record<string, QuestionFeedback>;
  generalFeedback: {
    strengths: string[];
    improvements: string[];
    summary: string;
  };
}
