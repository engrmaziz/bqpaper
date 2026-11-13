"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StudentInfo, StudentAnswers } from "@/types/exam";
import { MCQ_QUESTIONS, SHORT_QUESTIONS, LONG_QUESTION, PRACTICAL_PROJECT_MILESTONES } from "@/data/examData";
import { 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  FileText, 
  Code2, 
  AlertTriangle,
  Loader2,
  BookOpen,
  Award,
  Sparkles
} from "lucide-react";

interface ExamFormProps {
  student: StudentInfo;
  answers: StudentAnswers;
  onUpdateAnswers: React.Dispatch<React.SetStateAction<StudentAnswers>>;
  onSubmitExam: () => void;
  isSubmitting: boolean;
}

export default function ExamForm({
  student,
  answers,
  onUpdateAnswers,
  onSubmitExam,
  isSubmitting,
}: ExamFormProps) {
  const [activeTab, setActiveTab] = useState<"A" | "B" | "C" | "D">("A");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Helper to update MCQ
  const handleSelectMCQ = (questionId: number, option: "A" | "B" | "C" | "D") => {
    onUpdateAnswers((prev) => ({
      ...prev,
      mcqs: {
        ...prev.mcqs,
        [questionId]: option,
      },
    }));
  };

  // Compute completed counts
  const mcqsAnsweredCount = Object.keys(answers.mcqs).length;
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Official Bano Qabil Examination Paper Header */}
      <div className="bq-card p-6 bg-white border border-[#d4e7dc] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0 bg-[#f4f8f5] p-1.5 rounded-2xl border border-[#d4e7dc] flex items-center justify-center">
            <Image
              src="/bano-qabil.png"
              alt="Bano Qabil Official Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#015b30]/10 text-[#015b30] border border-[#015b30]/30">
                Official Midterm Paper
              </span>
              <span className="text-xs text-[#008b74] font-semibold italic hidden sm:inline">
                بنو قابل • اپنی دنیا آپ پیدا کر
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#015b30] mt-0.5">
              Essentials of AI (BQ-009)
            </h1>
            <p className="text-xs text-[#516d5e]">
              Student: <strong className="text-[#0d2317]">{student.name}</strong> • Roll No: <strong className="text-[#015b30]">{student.rollNumber}</strong> • Class: <strong className="text-[#0d2317]">{student.section}</strong>
            </p>
          </div>
        </div>

        {/* Finish & Submit Button */}
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={isSubmitting}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#015b30] hover:bg-[#014223] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#7cb342]" />
              <span>Assessing Paper...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit &amp; View Result</span>
            </>
          )}
        </button>
      </div>

      {/* Top Section Nav Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white border border-[#d4e7dc] shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab("A")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "A"
                ? "bg-[#015b30] text-white shadow-sm"
                : "text-[#516d5e] hover:text-[#015b30] hover:bg-[#edf5f0]"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Section A: MCQs</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "A" ? "bg-white/20 text-white" : "bg-[#edf5f0] text-[#015b30]"
            }`}>
              {mcqsAnsweredCount}/20
            </span>
          </button>

          <button
            onClick={() => setActiveTab("B")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "B"
                ? "bg-[#015b30] text-white shadow-sm"
                : "text-[#516d5e] hover:text-[#015b30] hover:bg-[#edf5f0]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Section B: Short Qs</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "B" ? "bg-white/20 text-white" : "bg-[#edf5f0] text-[#008b74]"
            }`}>
              10 Mks
            </span>
          </button>

          <button
            onClick={() => setActiveTab("C")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "C"
                ? "bg-[#015b30] text-white shadow-sm"
                : "text-[#516d5e] hover:text-[#015b30] hover:bg-[#edf5f0]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Section C: Long Q</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "C" ? "bg-white/20 text-white" : "bg-[#edf5f0] text-[#008b74]"
            }`}>
              20 Mks
            </span>
          </button>

          <button
            onClick={() => setActiveTab("D")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "D"
                ? "bg-[#008b74] text-white shadow-sm"
                : "text-[#516d5e] hover:text-[#008b74] hover:bg-[#edf5f0]"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Section D: Project</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
              activeTab === "D" ? "bg-white/20 text-white" : "bg-[#edf5f0] text-[#008b74]"
            }`}>
              50 Mks
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: MCQs (20 Marks) */}
      {/* ========================================================================= */}
      {activeTab === "A" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Section banner */}
          <div className="p-5 rounded-2xl bq-card bg-white border border-[#d4e7dc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#015b30] uppercase tracking-wider px-2 py-0.5 rounded bg-[#edf5f0]">
                  Section A
                </span>
                <span className="text-xs text-[#516d5e]">1 Mark each • 20 Marks total</span>
              </div>
              <h2 className="text-lg font-bold text-[#015b30] mt-1">Multiple Choice Questions (20 MCQs)</h2>
              <p className="text-xs text-[#516d5e]">Select the single most accurate conceptual answer.</p>
            </div>
            {/* Quick Question Jump Navigator */}
            <div className="flex flex-wrap gap-1.5 max-w-sm">
              {MCQ_QUESTIONS.map((q) => {
                const isAns = !!answers.mcqs[q.id];
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      const el = document.getElementById(`mcq_${q.id}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isAns
                        ? "bg-[#015b30] text-white shadow-xs"
                        : "bg-[#edf5f0] text-[#516d5e] hover:bg-[#d4e7dc]"
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {MCQ_QUESTIONS.map((q) => {
              const selectedOpt = answers.mcqs[q.id];
              return (
                <div
                  id={`mcq_${q.id}`}
                  key={q.id}
                  className={`p-5 rounded-2xl bq-card bg-white border transition-all ${
                    selectedOpt ? "border-[#015b30] shadow-sm bg-[#fafdfb]" : "border-[#d4e7dc]"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3.5">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      selectedOpt ? "bg-[#015b30] text-white" : "bg-[#edf5f0] text-[#015b30]"
                    }`}>
                      {q.id}
                    </span>
                    <p className="text-sm font-semibold text-[#0d2317] leading-relaxed pt-1">
                      {q.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-11">
                    {(Object.keys(q.options) as ("A" | "B" | "C" | "D")[]).map((optKey) => {
                      const isChosen = selectedOpt === optKey;
                      return (
                        <button
                          key={optKey}
                          onClick={() => handleSelectMCQ(q.id, optKey)}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                            isChosen
                              ? "bg-[#edf5f0] border-[#015b30] text-[#015b30] font-bold shadow-xs"
                              : "bg-[#fbfdfb] border-[#d4e7dc] text-[#0d2317] hover:border-[#015b30]/50 hover:bg-[#f4f8f5]"
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                            isChosen
                              ? "bg-[#015b30] text-white border-[#015b30]"
                              : "border-[#b8d9c5] text-[#516d5e] bg-white"
                          }`}>
                            {optKey}
                          </span>
                          <span className="flex-1 leading-snug">{q.options[optKey]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab("B")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#015b30] text-white text-xs font-bold shadow-sm hover:bg-[#014223] transition-all cursor-pointer"
            >
              <span>Next: Section B (Short Qs)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: SHORT QUESTIONS (10 Marks) */}
      {/* ========================================================================= */}
      {activeTab === "B" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 rounded-2xl bq-card bg-white border border-[#d4e7dc]">
            <h2 className="text-lg font-bold text-[#015b30]">Section B: Short Answer Questions (10 Marks)</h2>
            <p className="text-xs text-[#516d5e]">Answer both questions concisely in the guided boxes below. Focus on conceptual clarity.</p>
          </div>

          {/* Question 1 */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">{SHORT_QUESTIONS[0].title}</h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                5 Marks
              </span>
            </div>
            <p className="text-xs text-[#516d5e] italic bg-[#f4f8f5] p-3 rounded-xl border border-[#d4e7dc]">
              {SHORT_QUESTIONS[0].scenario}
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  (a) Explain the single main difference between them (Hint: Mention labels / answers): (2 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Supervised learning uses labelled data with correct answers, whereas unsupervised learning..."
                  value={answers.shortQuestions.q1_a}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      shortQuestions: { ...prev.shortQuestions, q1_a: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                    (b1) Real Pakistani Supervised Example: (1.5 Marks)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Easypaisa fraud detector using past marked transactions..."
                    value={answers.shortQuestions.q1_b_sup}
                    onChange={(e) =>
                      onUpdateAnswers((prev) => ({
                        ...prev,
                        shortQuestions: { ...prev.shortQuestions, q1_b_sup: e.target.value },
                      }))
                    }
                    className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                    (b2) Real Pakistani Unsupervised Example: (1.5 Marks)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Daraz clustering customer buying habits with no pre-set labels..."
                    value={answers.shortQuestions.q1_b_unsup}
                    onChange={(e) =>
                      onUpdateAnswers((prev) => ({
                        ...prev,
                        shortQuestions: { ...prev.shortQuestions, q1_b_unsup: e.target.value },
                      }))
                    }
                    className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">{SHORT_QUESTIONS[1].title}</h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                5 Marks
              </span>
            </div>
            <p className="text-xs text-[#516d5e] italic bg-[#f4f8f5] p-3 rounded-xl border border-[#d4e7dc]">
              {SHORT_QUESTIONS[1].scenario}
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  (a) Why did the student's Teachable Machine model fail on new pens? What caused the 'ratta' (overfitting)? (2 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why taking all photos in identical background/angle caused memorization..."
                  value={answers.shortQuestions.q2_a}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      shortQuestions: { ...prev.shortQuestions, q2_a: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  (b) Name the 4 Words of Good Data taught in Week 2 (English or Urdu) to fix this: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1. Enough (Kaafi), 2. Balanced (Mutawazin), 3. Varied (Mutanawwo), 4. Correct (Durust)"
                  value={answers.shortQuestions.q2_b}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      shortQuestions: { ...prev.shortQuestions, q2_b: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab("A")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#d4e7dc] bg-white text-xs text-[#516d5e] hover:text-[#015b30] font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Section A</span>
            </button>
            <button
              onClick={() => setActiveTab("C")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#015b30] text-white text-xs font-bold shadow-sm hover:bg-[#014223] cursor-pointer"
            >
              <span>Next: Section C (Long Q)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION C: LONG QUESTION (20 Marks) */}
      {/* ========================================================================= */}
      {activeTab === "C" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 rounded-2xl bq-card bg-white border border-[#d4e7dc]">
            <h2 className="text-lg font-bold text-[#015b30]">Section C: Comprehensive Long Question (20 Marks)</h2>
            <p className="text-xs text-[#516d5e]">{LONG_QUESTION.title} • 3 Interconnected Parts</p>
          </div>

          {/* Part A */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">{LONG_QUESTION.parts[0].title}</h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                6 Marks
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  (i) Technical names of the 3 parts: Ears, Brain, and Mouth: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ears = Speech-to-Text (STT), Brain = LLM / Language Model, Mouth = Text-to-Speech (TTS)"
                  value={answers.longQuestion.part_a_chain}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_a_chain: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  (ii) How do errors cascade if the Ears fail in noisy Karachi traffic? (3 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain which part breaks first, what text reaches the Brain, and what the Mouth speaks..."
                  value={answers.longQuestion.part_a_error}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_a_error: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Part B */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">{LONG_QUESTION.parts[1].title}</h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                6 Marks
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  (i) Pakistani Sarcasm Trap: Write an example and explain why naive word counting fails: (3 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 'Wah shukriya bhai, 2 ghantay intezar karwaya!' Naive model sees 'Wah' and 'shukriya'..."
                  value={answers.longQuestion.part_b_sarcasm}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_b_sarcasm: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  (ii) Youth / Cricket Slang Trap: Explain how words like 'aag' or 'sick' trick literal sentiment models: (3 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why slang meaning 'amazing' gets misclassified as negative/fire/illness by basic AI..."
                  value={answers.longQuestion.part_b_slang}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_b_slang: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Part C */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">{LONG_QUESTION.parts[2].title}</h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                8 Marks
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  (i) Why does a vision model trained on family photos fail on strangers? (3 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain memorization of familiar angles, room lighting, skin tones, and backgrounds..."
                  value={answers.longQuestion.part_c_strangers}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_c_strangers: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  (ii) Medical AI Ethics: Why is a 95% accurate doctor scanner dangerous? Contrast False Alarms vs Misses: (5 Marks)
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain 5 out of 100 mistakes, contrast False Alarm (extra test) vs A Miss (fatal), and why doctors decide..."
                  value={answers.longQuestion.part_c_doctor_ethics}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_c_doctor_ethics: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab("B")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#d4e7dc] bg-white text-xs text-[#516d5e] hover:text-[#015b30] font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Section B</span>
            </button>
            <button
              onClick={() => setActiveTab("D")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008b74] text-white text-xs font-bold shadow-sm hover:bg-[#015b30] cursor-pointer"
            >
              <span>Next: Section D (Practical Project)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION D: PRACTICAL PROJECT (50 Marks) */}
      {/* ========================================================================= */}
      {activeTab === "D" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bq-card bg-gradient-to-r from-[#015b30] to-[#008b74] text-white shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                HANDS-ON PROJECT • 50 MARKS
              </span>
              <span className="text-xs text-[#7cb342] font-semibold">5 Milestones $\times$ 10 Marks</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              The Smart Canteen AI — Bano Qabil Campus System
            </h2>
            <p className="text-xs text-white/90 mt-1 max-w-3xl">
              Apply your 6 weeks of AI training to build the end-to-end canteen vision scanner, clean database table, customer service chatbot recipe, and model card.
            </p>
          </div>

          {/* Milestone 1: Teachable Machine */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">
                Milestone 1: Teachable Machine Vision Setup (10 Marks)
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 Marks
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  1.1 Name the 3 classes you create (2 food classes + 1 critical safety class): (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class 1: Chicken Roll, Class 2: Samosa, Class 3: Nothing (Empty Counter)"
                  value={answers.practicalProject.m1_classes}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m1_classes: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  1.2 Three realistic photo variations you will capture to prevent 'ratta': (4 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1. Different angles (top-down, 45 degree), 2. Lighting (daylight, cafeteria light), 3. Background/hands..."
                  value={answers.practicalProject.m1_variations}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m1_variations: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  1.3 Golden Privacy Rule: Camera angle and student face protection: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Point webcam strictly down at tray surface; never record student faces or ID cards without consent."
                  value={answers.practicalProject.m1_privacy}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m1_privacy: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Milestone 2: Tabular Schema */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">
                Milestone 2: Tabular Data Architecture &amp; Privacy (10 Marks)
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 Marks
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  2.1 Define 5 column headers with their correct Data Types (Number, Category, Text, Date): (8 Marks)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g.&#10;1. OrderID (Number)&#10;2. ItemName (Category)&#10;3. Quantity (Number)&#10;4. PricePKR (Number)&#10;5. Date (Date)"
                  value={answers.practicalProject.m2_table_types}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m2_table_types: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  2.2 Why must student names and phone numbers be excluded from monthly sales reports? (2 Marks)
                </label>
                <input
                  type="text"
                  placeholder="Explain PII protection and why management only needs aggregate quantity/revenue data..."
                  value={answers.practicalProject.m2_privacy_removal}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m2_privacy_removal: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Milestone 3: Data Cleaning */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">
                Milestone 3: Data Cleaning &amp; Anomaly Fixing (10 Marks)
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 Marks
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#d4e7dc]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#015b30] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Row</th>
                    <th className="p-3">Item</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Student Review (1-5)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf5f0] bg-[#fbfdfb] text-[#0d2317]">
                  <tr><td className="p-2.5 font-bold">1</td><td className="p-2.5">Chicken Roll</td><td className="p-2.5">2</td><td className="p-2.5">160</td><td className="p-2.5">5</td></tr>
                  <tr className="bg-amber-50/60"><td className="p-2.5 font-bold">2</td><td className="p-2.5 text-amber-800 font-bold">chicken roll</td><td className="p-2.5">2</td><td className="p-2.5">160</td><td className="p-2.5">5 (Duplicate)</td></tr>
                  <tr className="bg-red-50/60"><td className="p-2.5 font-bold">3</td><td className="p-2.5">Biryani</td><td className="p-2.5 text-red-600 font-bold">[BLANK]</td><td className="p-2.5 text-red-600 font-bold">rs 250</td><td className="p-2.5">4</td></tr>
                  <tr className="bg-red-50/60"><td className="p-2.5 font-bold">4</td><td className="p-2.5 text-red-600 font-bold">TEST_ORDER</td><td className="p-2.5">0</td><td className="p-2.5">0</td><td className="p-2.5">TEST</td></tr>
                  <tr className="bg-amber-50/60"><td className="p-2.5 font-bold">5</td><td className="p-2.5">Samosa</td><td className="p-2.5">1</td><td className="p-2.5">40</td><td className="p-2.5 text-amber-800 font-bold">15 (Out of range)</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                Explain your 4 exact cleaning steps (Row 1&amp;2 case duplicate, Row 3 blank &amp; 'rs', Row 4 test, Row 5 rating 15): (10 Marks)
              </label>
              <textarea
                rows={4}
                placeholder="Step 1: Standardize case ('Roll' vs 'roll') to detect duplicate and delete duplicate row 2.&#10;Step 2: Mark blank Qty and strip 'rs' text from price to leave number 250.&#10;Step 3: Delete developer TEST_ORDER row 4.&#10;Step 4: Rating 15 is bogus; clear field, record in audit log, never guess values."
                value={answers.practicalProject.m3_cleaning_fixes}
                onChange={(e) =>
                  onUpdateAnswers((prev) => ({
                    ...prev,
                    practicalProject: { ...prev.practicalProject, m3_cleaning_fixes: e.target.value },
                  }))
                }
                className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
              />
            </div>
          </div>

          {/* Milestone 4: Prompt Recipe */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">
                Milestone 4: Chatbot Design &amp; 4-Part Prompt Recipe (10 Marks)
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 Marks
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  4.1 Three clear Landbot button labels for students: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1. View Today's Menu & Prices, 2. Canteen Timings, 3. Talk to Staff"
                  value={answers.practicalProject.m4_buttons}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m4_buttons: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  4.2 Complete Prompt Recipe adhering to Who, What, Details (Roman Urdu, official prices), Length (max 2 lines): (5 Marks)
                </label>
                <textarea
                  rows={3}
                  placeholder="You are the Bano Qabil Canteen Assistant. Your task is to inform students about today's prices and timings. Always reply politely in Roman Urdu using 'Aap'. State only official menu prices and never guess. Keep responses within 2 sentences."
                  value={answers.practicalProject.m4_prompt}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m4_prompt: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  4.3 Safety Rule: How does the bot handle peanut/dairy allergy inquiries? (2 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Directs student straight to human canteen counter staff and refuses to verify medical safety via AI."
                  value={answers.practicalProject.m4_safety}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m4_safety: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Milestone 5: Accuracy & Model Card */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className="text-base font-bold text-[#015b30]">
                Milestone 5: Accuracy Math, Insight Schema &amp; Model Card (10 Marks)
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 Marks
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  5.1 Accuracy Calculation: 20 test dishes, 17 correct predictions. Write the formula and calculate accuracy: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="Formula: (Correct / Total) * 100 = (17 / 20) * 100 = 85.0% Accuracy"
                  value={answers.practicalProject.m5_accuracy_math}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m5_accuracy_math: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  5.2 Business Insight Schema (85 Rolls vs 5 Soups sold): What $\to$ So What $\to$ Now What: (4 Marks)
                </label>
                <textarea
                  rows={3}
                  placeholder="What: 85 Chicken Rolls sold vs only 5 Vegetable Soups.&#10;So What: Students prefer fast finger foods they can eat in a 20-minute recess.&#10;Now What: Prepare 150 rolls tomorrow and discontinue soup to eliminate food waste."
                  value={answers.practicalProject.m5_insight}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m5_insight: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] mb-1.5">
                  5.3 Model Card: 3 lines (What it does, Data used, Known failure mode): (3 Marks)
                </label>
                <textarea
                  rows={3}
                  placeholder="Line 1: Classifies Chicken Rolls and Samosas placed on the checkout counter.&#10;Line 2: Trained on 120 photos captured on school counter under natural daylight and tube lighting.&#10;Line 3: Known failure mode: Accuracy drops when food is wrapped in reflective aluminium foil or in dark shadows."
                  value={answers.practicalProject.m5_model_card}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m5_model_card: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#d4e7dc]">
            <button
              onClick={() => setActiveTab("C")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#d4e7dc] bg-white text-xs text-[#516d5e] hover:text-[#015b30] font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Section C</span>
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#015b30] hover:bg-[#014223] text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Complete Exam &amp; View Result</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#d4e7dc] p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-3xl bg-[#f4f8f5] border border-[#d4e7dc] flex items-center justify-center p-2">
                <Image
                  src="/bano-qabil.png"
                  alt="Bano Qabil"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#015b30]">Ready to Submit Your Paper?</h3>
              <p className="text-xs text-[#516d5e] mt-1">
                You have answered <strong>{mcqsAnsweredCount} of 20 MCQs</strong> and your written answers will now be graded instantly by the AI assessment engine.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#edf5f0] border border-[#d4e7dc] text-xs text-[#015b30] text-left space-y-1 font-medium">
              <p>• Student: <strong>{student.name}</strong></p>
              <p>• Roll Number: <strong>{student.rollNumber}</strong></p>
              <p>• Total Marks: <strong>100 Marks</strong></p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#d4e7dc] bg-white text-xs font-bold text-[#516d5e] hover:bg-[#edf5f0] transition-all cursor-pointer"
              >
                Review Answers
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  onSubmitExam();
                }}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#015b30] hover:bg-[#014223] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Confirm &amp; Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
