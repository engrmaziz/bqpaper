"use client";

import React, { useState, useEffect, useRef } from "react";
import { StudentInfo, StudentAnswers, AssessmentResult } from "@/types/exam";
import Navbar from "@/components/Navbar";
import StudentRegistration from "@/components/StudentRegistration";
import ExamForm from "@/components/ExamForm";
import ResultView from "@/components/ResultView";
import TeacherDashboard from "@/components/TeacherDashboard";
import ExaminerLoginModal from "@/components/ExaminerLoginModal";

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
  // Examiner Role Auth States (io@maziz.me)
  const [examinerToken, setExaminerToken] = useState<string>("");
  const [examinerEmail, setExaminerEmail] = useState<string>("");
  const [isExaminerLoginOpen, setIsExaminerLoginOpen] = useState<boolean>(false);

  // Load Examiner session from session storage
  useEffect(() => {
    try {
      const savedToken = sessionStorage.getItem("bq_examiner_token");
      const savedEmail = sessionStorage.getItem("bq_examiner_email");
      if (savedToken && savedEmail === "io@maziz.me") {
        setExaminerToken(savedToken);
        setExaminerEmail(savedEmail);
      }
    } catch {
      // SessionStorage error catch
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
    setAnswers(INITIAL_ANSWERS);
    setTimeRemaining(TOTAL_EXAM_SECONDS);
    setCurrentView("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAutoSubmit = () => {
    alert("Time is up! Submitting your examination answers to Groq AI for assessment.");
    handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    if (!student || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student,
          answers,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Evaluation failed.");
      }

      const evalResult: AssessmentResult = await res.json();
      setResult(evalResult);
      setCurrentView("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050a14] text-[#e8eef7]">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        timeRemaining={currentView === "exam" ? timeRemaining : undefined}
        studentName={student?.name}
        isExaminer={!!examinerToken}
        onOpenExaminerLogin={() => setIsExaminerLoginOpen(true)}
      />

      <main className="flex-1 pb-16">
        {currentView === "register" && (
          <StudentRegistration onStartExam={handleStartExam} />
        )}

        {currentView === "exam" && student && (
          <ExamForm
            student={student}
            answers={answers}
            onUpdateAnswers={setAnswers}
            onSubmitExam={handleSubmitExam}
            isSubmitting={isSubmitting}
          />
        )}

        {currentView === "result" && result && (
          <ResultView
            result={result}
            onRetake={() => setCurrentView("register")}
            onViewMarksheet={() => handleNavigate("admin")}
            isExaminer={!!examinerToken}
          />
        )}

        {currentView === "admin" && (
          <TeacherDashboard 
            onBackToExam={() => setCurrentView("register")} 
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

      {/* Footer */}
      <footer className="border-t border-[#1a2744] bg-[#050a14]/90 py-6 px-4 text-center text-xs text-[#8ba0b5]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 <strong className="text-[#e8eef7]">Bano Qabil Pakistan</strong> • Essentials of AI (BQ-009)
          </p>
          <p className="text-[11px]">
            Patron: <span className="text-[#e8b86d]">Hafiz Naeem ur Rehman</span> • Instructors: <span className="text-[#7df9ff]">Musharraf Aziz</span> &amp; <span className="text-[#7df9ff]">Sir Usman Yaseen</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00d4ff] cyan-glow" />
            <span className="text-[11px] text-[#00d4ff]">Vercel Deployable • Groq AI Integrated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
