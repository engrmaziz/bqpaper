"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { StudentInfo, StudentAnswers, AssessmentResult } from "@/types/exam";
import Navbar from "@/components/Navbar";
import StudentRegistration from "@/components/StudentRegistration";
import ExamForm from "@/components/ExamForm";
import ResultView from "@/components/ResultView";
import TeacherDashboard from "@/components/TeacherDashboard";
import ExaminerLoginModal from "@/components/ExaminerLoginModal";
import { Language } from "@/data/translations";

const TOTAL_EXAM_SECONDS = 80 * 60; // 1 Hour 20 Minutes = 4800 seconds

const INITIAL_ANSWERS: StudentAnswers = {
  mcqs: {},
  shortQuestions: {
    q1_a: "",
    q1_b_sup: "",
    q1_b_unsup: "",
    q2_a: "",
    q2_b: "",
  },
  longQuestion: {
    part_a_chain: "",
    part_a_error: "",
    part_b_sarcasm: "",
    part_b_slang: "",
    part_c_strangers: "",
    part_c_doctor_ethics: "",
  },
  practicalProject: {
    m1_classes: "",
    m1_variations: "",
    m1_privacy: "",
    m2_table_types: "",
    m2_privacy_removal: "",
    m3_cleaning_fixes: "",
    m4_buttons: "",
    m4_prompt: "",
    m4_safety: "",
    m5_accuracy_math: "",
    m5_insight: "",
    m5_model_card: "",
  },
};

export default function Home() {
  const [currentView, setCurrentView] = useState<"register" | "exam" | "result" | "admin">("register");
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [answers, setAnswers] = useState<StudentAnswers>(INITIAL_ANSWERS);
  const [timeRemaining, setTimeRemaining] = useState<number>(TOTAL_EXAM_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  // Examiner Role Auth States (io@maziz.me)
  const [examinerToken, setExaminerToken] = useState<string>("");
  const [examinerEmail, setExaminerEmail] = useState<string>("");
  const [isExaminerLoginOpen, setIsExaminerLoginOpen] = useState<boolean>(false);

  // Mutable refs to eliminate stale closure bugs during auto-submission
  const answersRef = useRef<StudentAnswers>(INITIAL_ANSWERS);
  const studentRef = useRef<StudentInfo | null>(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    studentRef.current = student;
  }, [student]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ur" : "en"));
  };

  // 1. Restore completed exam or in-progress draft exam on initial load
  useEffect(() => {
    try {
      // Check if student has already completed their exam on this device
      const savedResult = localStorage.getItem("bq_last_submitted_result");
      if (savedResult) {
        const parsed = JSON.parse(savedResult);
        if (parsed && parsed.id && parsed.student) {
          setResult(parsed);
          setStudent(parsed.student);
          studentRef.current = parsed.student;
          setCurrentView("result");
          return;
        }
      }

      // Check if student has an in-progress draft exam on this device (Prevents paper wipe on accidental refresh)
      const savedDraftStudent = localStorage.getItem("bq_draft_student");
      const savedDraftAnswers = localStorage.getItem("bq_draft_answers");
      if (savedDraftStudent) {
        const parsedStudent = JSON.parse(savedDraftStudent);
        if (parsedStudent && parsedStudent.rollNumber) {
          setStudent(parsedStudent);
          studentRef.current = parsedStudent;
          if (savedDraftAnswers) {
            try {
              const parsedAnswers = JSON.parse(savedDraftAnswers);
              if (parsedAnswers && typeof parsedAnswers === "object") {
                setAnswers(parsedAnswers);
                answersRef.current = parsedAnswers;
              }
            } catch {}
          }
          if (parsedStudent.startTime) {
            const elapsed = Math.round((Date.now() - parsedStudent.startTime) / 1000);
            const remaining = Math.max(30, TOTAL_EXAM_SECONDS - elapsed);
            setTimeRemaining(remaining);
          }
          setCurrentView("exam");
        }
      }

      // Check examiner token
      const savedToken = sessionStorage.getItem("bq_examiner_token");
      const savedEmail = sessionStorage.getItem("bq_examiner_email");
      if (savedToken && savedEmail === "io@maziz.me") {
        setExaminerToken(savedToken);
        setExaminerEmail(savedEmail);
      }
    } catch {
      // Safe catch
    }
  }, []);

  const handleExaminerLoginSuccess = (token: string, email: string) => {
    setExaminerToken(token);
    setExaminerEmail(email);
    try {
      sessionStorage.setItem("bq_examiner_token", token);
      sessionStorage.setItem("bq_examiner_email", email);
    } catch {}
    setCurrentView("admin");
  };

  const handleExaminerLogout = () => {
    setExaminerToken("");
    setExaminerEmail("");
    try {
      sessionStorage.removeItem("bq_examiner_token");
      sessionStorage.removeItem("bq_examiner_email");
    } catch {}
    setCurrentView("register");
  };

  const handleNavigate = (view: "register" | "exam" | "result" | "admin") => {
    // If student has already completed the exam, strictly prevent returning to register or exam (No Retakes)
    if (result && (view === "register" || view === "exam")) {
      return;
    }

    if (view === "admin") {
      if (!examinerToken) {
        setIsExaminerLoginOpen(true);
        return;
      }
    }
    setCurrentView(view);
  };

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentView === "exam") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentView]);

  const handleStartExam = (newStudent: StudentInfo) => {
    setStudent(newStudent);
    studentRef.current = newStudent;
    setAnswers(INITIAL_ANSWERS);
    answersRef.current = INITIAL_ANSWERS;
    setTimeRemaining(TOTAL_EXAM_SECONDS);
    setCurrentView("exam");
    try {
      localStorage.setItem("bq_draft_student", JSON.stringify(newStudent));
      localStorage.setItem("bq_draft_answers", JSON.stringify(INITIAL_ANSWERS));
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateAnswers: React.Dispatch<React.SetStateAction<StudentAnswers>> = (action) => {
    setAnswers((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      answersRef.current = next;
      try {
        localStorage.setItem("bq_draft_answers", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleAutoSubmit = () => {
    alert(
      language === "ur"
        ? "وقت ختم ہو گیا ہے! آپ کے تمام جوابات خودکار طور پر جمع اور محفوظ کیے جا رہے ہیں۔"
        : "Time is up! Submitting and securing your examination answers for assessment."
    );
    handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    // Read from fresh mutable refs to strictly prevent stale closure bugs
    let currentStudent = studentRef.current || student;
    let currentAnswers = answersRef.current || answers;

    // Secondary fallback: Retrieve from localStorage if answers state is somehow empty
    if (!currentStudent) {
      try {
        const savedStd = localStorage.getItem("bq_draft_student");
        if (savedStd) currentStudent = JSON.parse(savedStd);
      } catch {}
    }
    if (!currentAnswers || Object.keys(currentAnswers.mcqs || {}).length === 0) {
      try {
        const savedAns = localStorage.getItem("bq_draft_answers");
        if (savedAns) {
          const parsed = JSON.parse(savedAns);
          if (parsed && typeof parsed === "object") currentAnswers = parsed;
        }
      } catch {}
    }

    if (!currentStudent || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // =======================================================================
      // STEP 1: PRE-EVALUATION STORAGE IN SUPABASE (ZERO DATA LOSS GUARANTEE)
      // Save raw answers & registration into Supabase before any external AI calls.
      // =======================================================================
      let preStoreResult: AssessmentResult | null = null;
      try {
        const storeRes = await fetch("/api/submissions/store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: currentStudent,
            answers: currentAnswers,
            timeSpentSeconds: TOTAL_EXAM_SECONDS - timeRemaining,
          }),
        });
        if (storeRes.ok) {
          const storeData = await storeRes.json();
          preStoreResult = storeData.submission;
        }
      } catch (storeErr) {
        console.warn("Pre-evaluation storage network warning:", storeErr);
      }

      // =======================================================================
      // STEP 2: AI EVALUATION (Groq AI -> Google Gemini AI Fallback)
      // =======================================================================
      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: currentStudent,
            answers: currentAnswers,
          }),
        });

        if (res.ok) {
          const evalResult: AssessmentResult = await res.json();
          setResult(evalResult);
          setCurrentView("result");

          // Lock single attempt and cache result
          try {
            localStorage.setItem(`bq_completed_${currentStudent.rollNumber.trim().toUpperCase()}`, "true");
            localStorage.setItem("bq_last_submitted_result", JSON.stringify(evalResult));
            localStorage.removeItem("bq_draft_answers");
            localStorage.removeItem("bq_draft_student");
          } catch {}

          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      } catch (evalErr) {
        console.warn("AI evaluation fetch error:", evalErr);
      }

      // =======================================================================
      // STEP 3: FALLBACK TO PRE-STORED BASELINE (IF AI API TIMED OUT OR ERRORED)
      // The student paper was already safely stored in Supabase with verified marks!
      // =======================================================================
      if (preStoreResult) {
        setResult(preStoreResult);
        setCurrentView("result");

        try {
          localStorage.setItem(`bq_completed_${currentStudent.rollNumber.trim().toUpperCase()}`, "true");
          localStorage.setItem("bq_last_submitted_result", JSON.stringify(preStoreResult));
          localStorage.removeItem("bq_draft_answers");
          localStorage.removeItem("bq_draft_student");
        } catch {}

        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      throw new Error("Could not connect to evaluation server. Please click submit again.");
    } catch (err: any) {
      alert(
        language === "ur"
          ? `پرچہ جمع کرانے میں رابطہ تعطل: ${err.message}۔ آپ کے تمام جوابات محفوظ ہیں۔ برائے مہربانی دوبارہ جمع کرانے کا بٹن دبائیں۔`
          : `Submission notice: ${err.message}. Your answers are preserved. Please click submit again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#f6faf7] text-[#0d2317] ${language === "ur" ? "font-arabic-ui" : "font-sans-en"}`} dir={language === "ur" ? "rtl" : "ltr"}>
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        timeRemaining={currentView === "exam" ? timeRemaining : undefined}
        studentName={student?.name}
        isExaminer={!!examinerToken}
        onOpenExaminerLogin={() => setIsExaminerLoginOpen(true)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      <main className="flex-1 pb-16">
        {currentView === "register" && (
          <StudentRegistration onStartExam={handleStartExam} language={language} />
        )}

        {currentView === "exam" && student && (
          <ExamForm
            student={student}
            answers={answers}
            onUpdateAnswers={handleUpdateAnswers}
            onSubmitExam={handleSubmitExam}
            isSubmitting={isSubmitting}
            language={language}
          />
        )}

        {currentView === "result" && result && (
          <ResultView
            result={result}
            onViewMarksheet={() => handleNavigate("admin")}
            isExaminer={!!examinerToken}
            language={language}
          />
        )}

        {currentView === "admin" && (
          <TeacherDashboard 
            onBackToExam={() => {
              if (result) setCurrentView("result");
              else setCurrentView("register");
            }} 
            examinerToken={examinerToken}
            onLogout={handleExaminerLogout}
          />
        )}
      </main>

      {/* Examiner Portal Login Modal (io@maziz.me) */}
      <ExaminerLoginModal
        isOpen={isExaminerLoginOpen}
        onClose={() => setIsExaminerLoginOpen(false)}
        onSuccess={handleExaminerLoginSuccess}
      />

      {/* Official Bano Qabil Footer with Patron Tribute */}
      <footer className="border-t border-[#d4e7dc] bg-white py-8 px-4 text-xs text-[#516d5e]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Patron Tribute Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#edf5f0]/90 border border-[#c8e0d2] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#015b30] shadow-sm flex-shrink-0 ring-2 ring-[#7cb342]/40">
                <Image
                  src="/hafiz.png"
                  alt="Patron Hafiz Naeem ur Rehman"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div className="leading-snug">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#008b74] block">
                  {language === "ur" ? "سرپرستِ اعلیٰ بنو قابل پاکستان" : "Patron-in-Chief • Bano Qabil Movement"}
                </span>
                <strong className="text-sm text-[#015b30] font-extrabold block">
                  {language === "ur" ? "حافظ نعیم الرحمن" : "Hafiz Naeem ur Rehman"}
                </strong>
                <p className="text-[11px] text-[#516d5e]">
                  {language === "ur" 
                    ? "ملک کے ہر باصلاحیت نوجوان کو جدید آئی ٹی اور مصنوعی ذہانت کے مفت کورسز فراہم کرنے کا عظیم وژن۔"
                    : "Championing free, world-class Artificial Intelligence & IT education for Pakistan's youth."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-[#d4e7dc] text-[11px] font-bold text-[#015b30] shadow-xs">
                {language === "ur" ? "تعلیم سب کے لیے" : "Free Education for All"}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#015b30] text-white text-[11px] font-bold shadow-xs">
                {language === "ur" ? "100% میرٹ پر داخلے" : "100% Merit Based"}
              </span>
            </div>
          </div>

          {/* Bottom Copyright & Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[11px]">
            <div className="flex items-center gap-2">
              <Image
                src="/bano-qabil.png"
                alt="Bano Qabil Logo"
                width={20}
                height={20}
                className="object-contain"
              />
              <p>
                © 2026 <strong>Bano Qabil Pakistan</strong>. Essentials of AI Examination Platform.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span>{language === "ur" ? "انسٹرکٹر: " : "Instructor: "}<strong className="text-[#015b30]">Musharraf Aziz</strong> (Applied AI, Bano Qabil Kasur) • <strong className="text-[#015b30]">io@maziz.me</strong></span>
              <span className="text-[#a3cbb5]">•</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
