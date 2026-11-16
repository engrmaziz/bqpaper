"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StudentInfo, StudentAnswers } from "@/types/exam";
import { MCQ_QUESTIONS, SHORT_QUESTIONS, LONG_QUESTION, PRACTICAL_PROJECT_MILESTONES } from "@/data/examData";
import { MCQ_QUESTIONS_UR, SHORT_QUESTIONS_UR, LONG_QUESTION_UR, PRACTICAL_PROJECT_MILESTONES_UR } from "@/data/examDataUrdu";
import { Language, TRANSLATIONS } from "@/data/translations";
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
  Award
} from "lucide-react";

interface ExamFormProps {
  student: StudentInfo;
  answers: StudentAnswers;
  onUpdateAnswers: React.Dispatch<React.SetStateAction<StudentAnswers>>;
  onSubmitExam: () => void;
  isSubmitting: boolean;
  language?: Language;
}

export default function ExamForm({
  student,
  answers,
  onUpdateAnswers,
  onSubmitExam,
  isSubmitting,
  language = "en",
}: ExamFormProps) {
  const [activeTab, setActiveTab] = useState<"A" | "B" | "C" | "D">("A");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const mcqs = language === "ur" ? MCQ_QUESTIONS_UR : MCQ_QUESTIONS;
  const shortQuestions = language === "ur" ? SHORT_QUESTIONS_UR : SHORT_QUESTIONS;
  const longQuestion = language === "ur" ? LONG_QUESTION_UR : LONG_QUESTION;
  const practicalMilestones = language === "ur" ? PRACTICAL_PROJECT_MILESTONES_UR : PRACTICAL_PROJECT_MILESTONES;
  const t = TRANSLATIONS[language].exam;

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
    <div className={`max-w-6xl mx-auto px-4 py-6 space-y-6 ${language === "ur" ? "rtl text-right font-arabic-ui" : "font-sans-en text-left"}`}>
      {/* Official Bano Qabil Examination Paper Header */}
      <div className="bq-card p-6 bg-white border border-[#d8e9df] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center -space-x-3">
            <div className="relative w-16 h-16 flex-shrink-0 bg-[#f4f8f5] p-1.5 rounded-2xl border border-[#d8e9df] flex items-center justify-center shadow-xs z-10">
              <Image
                src="/bano-qabil.png"
                alt="Bano Qabil Official Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <div className="relative w-16 h-16 flex-shrink-0 bg-[#edf5f0] p-0.5 rounded-2xl border-2 border-[#015b30] flex items-center justify-center overflow-hidden shadow-xs ring-2 ring-[#7cb342]/40">
              <Image
                src="/hafiz.png"
                alt="Patron Hafiz Naeem ur Rehman"
                width={60}
                height={60}
                className="object-cover rounded-xl w-full h-full"
                priority
              />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#015b30]/10 text-[#015b30] border border-[#015b30]/30">
                {t.officialPaper}
              </span>
              <span className="text-xs text-[#015b30] font-bold hidden sm:inline">
                {language === "ur" ? "سرپرستِ اعلیٰ: حافظ نعیم الرحمن" : "Patron: Hafiz Naeem ur Rehman"}
              </span>
              <span className="text-[#008b74] font-semibold font-urdu text-sm hidden md:inline">
                • بنو قابل • اپنی دنیا آپ پیدا کر
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#015b30] mt-0.5">
              {language === "ur" ? "ایسینشلز آف اے آئی (BQ-009)" : "Essentials of AI (BQ-009)"}
            </h1>
            <p className="text-xs text-[#516d5e]">
              {language === "ur" ? "طالب علم" : "Student"}: <strong className="text-[#0d2317]">{student.name}</strong> • {language === "ur" ? "رول نمبر" : "Roll No"}: <strong className="text-[#015b30]">{student.rollNumber}</strong> • {language === "ur" ? "کلاس" : "Class"}: <strong className="text-[#0d2317]">{student.section}</strong>
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
              <span>{t.submitting}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t.submitExamBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Top Section Nav Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white border border-[#d8e9df] shadow-xs">
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
            <span>{t.tabA}</span>
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
            <span>{t.tabB}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "B" ? "bg-white/20 text-white" : "bg-[#edf5f0] text-[#008b74]"
            }`}>
              10 {language === "ur" ? "نمبر" : "Mks"}
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
            <span>{t.tabC}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "C" ? "bg-white/20 text-white" : "bg-[#edf5f0] text-[#008b74]"
            }`}>
              20 {language === "ur" ? "نمبر" : "Mks"}
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
            <span>{t.tabD}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
              activeTab === "D" ? "bg-white/20 text-white" : "bg-[#edf5f0] text-[#008b74]"
            }`}>
              50 {language === "ur" ? "نمبر" : "Mks"}
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
          <div className="p-5 rounded-2xl bq-card bg-white border border-[#d8e9df] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#015b30] uppercase tracking-wider px-2 py-0.5 rounded bg-[#edf5f0]">
                  {language === "ur" ? "سیکشن A: کثیر الانتخابی سوالات" : "SECTION A: 20 MARKS"}
                </span>
                <span className="text-xs text-[#516d5e]">• 1 {language === "ur" ? "نمبر فی سوال" : "Mark Each"}</span>
              </div>
              <h2 className="text-lg font-bold text-[#015b30] mt-1">{t.tabA}</h2>
              <p className="text-xs text-[#516d5e]">
                {language === "ur" ? "سب سے درست تصوراتی جواب کا انتخاب فرمائیں۔" : "Select the single most accurate conceptual answer."}
              </p>
            </div>
            {/* Quick Question Jump Navigator */}
            <div className="flex flex-wrap gap-1.5 max-w-sm">
              {mcqs.map((q) => {
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
            {mcqs.map((q) => {
              const selectedOpt = answers.mcqs[q.id];
              return (
                <div
                  id={`mcq_${q.id}`}
                  key={q.id}
                  className={`p-5 rounded-2xl bq-card bg-white border transition-all ${
                    selectedOpt ? "border-[#015b30] shadow-sm bg-[#fafdfb]" : "border-[#d8e9df]"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3.5">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      selectedOpt ? "bg-[#015b30] text-white" : "bg-[#edf5f0] text-[#015b30]"
                    }`}>
                      {q.id}
                    </span>
                    <p className={`pt-1 ${language === "ur" ? "urdu-question text-[#0d2317]" : "text-sm font-semibold text-[#0d2317] leading-relaxed"}`}>
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
                            language === "ur" ? "text-right flex-row-reverse" : ""
                          } ${
                            isChosen
                              ? "bg-[#edf5f0] border-[#015b30] text-[#015b30] font-bold shadow-xs"
                              : "bg-[#fbfdfb] border-[#d8e9df] text-[#0d2317] hover:border-[#015b30]/50 hover:bg-[#f4f8f5]"
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                            isChosen ? "bg-[#015b30] text-white" : "bg-[#edf5f0] text-[#516d5e]"
                          }`}>
                            {optKey}
                          </span>
                          <span className={`flex-1 ${language === "ur" ? "urdu-option text-[#0d2317]" : "text-xs sm:text-sm text-[#0d2317]"}`}>
                            {q.options[optKey]}
                          </span>
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#015b30] text-white text-xs font-bold shadow-sm hover:bg-[#014223] cursor-pointer"
            >
              <span>{t.next}: {t.tabB}</span>
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
          <div className="p-5 rounded-2xl bq-card bg-white border border-[#d8e9df]">
            <h2 className="text-lg font-bold text-[#015b30]">{t.tabB}</h2>
            <p className="text-xs text-[#516d5e]">
              {language === "ur" ? "ہر سوال کے 5 نمبر ہیں۔ جامع اور تصوراتی جواب تحریر کریں۔" : "Two short conceptual questions (5 Marks each). Be concise, clear, and conceptual."}
            </p>
          </div>

          {/* Question 1 */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>{shortQuestions[0].title}</h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                5 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>
            <p className={`text-xs text-[#516d5e] italic bg-[#f4f8f5] p-3 rounded-xl border border-[#d8e9df] ${language === "ur" ? "font-urdu leading-relaxed" : ""}`}>
              {shortQuestions[0].scenario}
            </p>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {shortQuestions[0].parts[0].prompt} ({shortQuestions[0].parts[0].marks} {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <textarea
                  rows={2}
                  placeholder={language === "ur" ? "اپنا تفصیلی جواب یہاں لکھیں..." : "e.g. Supervised learning uses labelled data with correct answers, whereas unsupervised learning..."}
                  value={answers.shortQuestions.q1_a}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      shortQuestions: { ...prev.shortQuestions, q1_a: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                    {shortQuestions[0].parts[1].prompt} ({shortQuestions[0].parts[1].marks} {language === "ur" ? "نمبر" : "Marks"})
                  </label>
                  <input
                    type="text"
                    placeholder={language === "ur" ? "مثلاً ایزی پیسہ فراڈ فلٹر..." : "e.g. Easypaisa fraud detector using past marked transactions..."}
                    value={answers.shortQuestions.q1_b_sup}
                    onChange={(e) =>
                      onUpdateAnswers((prev) => ({
                        ...prev,
                        shortQuestions: { ...prev.shortQuestions, q1_b_sup: e.target.value },
                      }))
                    }
                    className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                  />
                </div>

                <div>
                  <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                    {shortQuestions[0].parts[2].prompt} ({shortQuestions[0].parts[2].marks} {language === "ur" ? "نمبر" : "Marks"})
                  </label>
                  <input
                    type="text"
                    placeholder={language === "ur" ? "مثلاً دراز ڈاٹ پی کے پر گاہکوں کے کلسٹرز..." : "e.g. Daraz clustering customer buying habits with no pre-set labels..."}
                    value={answers.shortQuestions.q1_b_unsup}
                    onChange={(e) =>
                      onUpdateAnswers((prev) => ({
                        ...prev,
                        shortQuestions: { ...prev.shortQuestions, q1_b_unsup: e.target.value },
                      }))
                    }
                    className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>{shortQuestions[1].title}</h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                5 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>
            <p className={`text-xs text-[#516d5e] italic bg-[#f4f8f5] p-3 rounded-xl border border-[#d8e9df] ${language === "ur" ? "font-urdu leading-relaxed" : ""}`}>
              {shortQuestions[1].scenario}
            </p>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {shortQuestions[1].parts[0].prompt} ({shortQuestions[1].parts[0].marks} {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <textarea
                  rows={2}
                  placeholder={language === "ur" ? "وضاحت کریں کہ ایک ہی میز/روشنی میں تصاویر لینے سے رٹہ کیوں لگا..." : "Explain why taking all photos in identical background/angle caused memorization..."}
                  value={answers.shortQuestions.q2_a}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      shortQuestions: { ...prev.shortQuestions, q2_a: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {shortQuestions[1].parts[1].prompt} ({shortQuestions[1].parts[1].marks} {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <input
                  type="text"
                  placeholder={language === "ur" ? "1. کافی، 2. متوازن، 3. متنوع، 4. درست" : "e.g. 1. Enough (Kaafi), 2. Balanced (Mutawazin), 3. Varied (Mutanawwo), 4. Correct (Durust)"}
                  value={answers.shortQuestions.q2_b}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      shortQuestions: { ...prev.shortQuestions, q2_b: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab("A")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#d8e9df] bg-white text-xs text-[#516d5e] hover:text-[#015b30] font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.prev}: {t.tabA}</span>
            </button>
            <button
              onClick={() => setActiveTab("C")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#015b30] text-white text-xs font-bold shadow-sm hover:bg-[#014223] cursor-pointer"
            >
              <span>{t.next}: {t.tabC}</span>
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
          <div className="p-5 rounded-2xl bq-card bg-white border border-[#d8e9df]">
            <h2 className="text-lg font-bold text-[#015b30]">{t.tabC}</h2>
            <p className={`text-xs text-[#516d5e] ${language === "ur" ? "font-urdu" : ""}`}>{longQuestion.title}</p>
          </div>

          {/* Part A */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>{longQuestion.parts[0].title}</h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                6 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {longQuestion.parts[0].prompt}
                </label>
                <input
                  type="text"
                  placeholder={language === "ur" ? "کان = اسپیچ ٹو ٹیکسٹ (STT)، دماغ = LLM، منہ = ٹیکسٹ ٹو اسپیچ (TTS)" : "e.g. Ears = Speech-to-Text (STT), Brain = LLM / Language Model, Mouth = Text-to-Speech (TTS)"}
                  value={answers.longQuestion.part_a_chain}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_a_chain: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {longQuestion.parts[1].prompt}
                </label>
                <textarea
                  rows={2}
                  placeholder={language === "ur" ? "وضاحت کریں کہ پہلے کون سا حصہ فیل ہوگا اور دماغ غلط سن کر کیا کرے گا..." : "Explain which part breaks first, what text reaches the Brain, and what the Mouth speaks..."}
                  value={answers.longQuestion.part_a_error}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_a_error: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>
            </div>
          </div>

          {/* Part B */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>
                {language === "ur" ? "حصہ (ب): نیچرل لینگویج پروسیسنگ اور جذباتی تجزیے کے چیلنجز (6 نمبر)" : "Part (b): NLP & Sentiment Traps (6 Marks)"}
              </h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                6 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {longQuestion.parts[2].prompt}
                </label>
                <textarea
                  rows={2}
                  placeholder={language === "ur" ? "وضاحت کریں کہ لفظ 'شکریہ' دیکھ کر AI نے طنز کو کیوں مس کر دیا..." : "Explain how sarcasm masks negative complaints behind polite words..."}
                  value={answers.longQuestion.part_b_sarcasm}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_b_sarcasm: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {longQuestion.parts[3].prompt}
                </label>
                <textarea
                  rows={2}
                  placeholder={language === "ur" ? "وضاحت کریں کہ 'آگ' یا 'سِک' کا لفظی ترجمہ لینے سے ماڈل کیسے دھوکا کھاتا ہے..." : "Explain why non-localized AI takes cricket slang literally and scores it Negative..."}
                  value={answers.longQuestion.part_b_slang}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_b_slang: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>
            </div>
          </div>

          {/* Part C */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>
                {language === "ur" ? "حصہ (ج): ٹیسٹنگ اور ہسپتال کی طبی اخلاقیات (8 نمبر)" : "Part (c): Real-World Generalization & Hospital Ethics (8 Marks)"}
              </h3>
              <span className="text-xs font-bold text-[#015b30] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                8 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {longQuestion.parts[4].prompt}
                </label>
                <textarea
                  rows={2}
                  placeholder={language === "ur" ? "وضاحت کریں کہ اجنبی لوگوں کے نئے ہاتھوں اور پس منظر سے رٹہ کیسے بے نقاب ہوتا ہے..." : "Explain how stranger photos expose background memorization and lighting shortcuts..."}
                  value={answers.longQuestion.part_c_strangers}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_c_strangers: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {longQuestion.parts[5].prompt}
                </label>
                <textarea
                  rows={3}
                  placeholder={language === "ur" ? "1) 95 فیصد کا مطلب ہے 5 غلطیاں، 2) فالس الارم بمقابلہ مس کا موازنہ کریں، 3) ڈاکٹر کی اخلاقی ذمہ داری..." : "1) Explain 95% still fails 5 patients in 100, 2) Compare False Alarm vs Miss, 3) Human doctor ethics..."}
                  value={answers.longQuestion.part_c_doctor_ethics}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_c_doctor_ethics: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab("B")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#d8e9df] bg-white text-xs text-[#516d5e] hover:text-[#015b30] font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.prev}: {t.tabB}</span>
            </button>
            <button
              onClick={() => setActiveTab("D")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008b74] text-white text-xs font-bold shadow-sm hover:brightness-110 cursor-pointer"
            >
              <span>{t.next}: {t.tabD}</span>
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
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-0.5 rounded-full bg-white/20">
                {language === "ur" ? "پریکٹیکل کیپ اسٹون پروجیکٹ" : "PRACTICAL CAPSTONE PROJECT"}
              </span>
              <span className="text-xs text-[#7cb342] font-semibold">5 {language === "ur" ? "مراحل" : "Milestones"} $\times$ 10 = 50 {language === "ur" ? "نمبر" : "Marks"}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-extrabold mt-2 ${language === "ur" ? "font-urdu leading-loose" : ""}`}>
              {language === "ur" ? "اسمارٹ اسکول کینٹین AI سسٹم" : "Smart School Canteen AI System"}
            </h2>
            <p className="text-xs text-white/90 mt-1 max-w-3xl">
              {language === "ur" ? "ہفتہ 1 تا 6 کی تربیت استعمال کرتے ہوئے ویژن اسکینر، کلین ڈیٹا شیٹ، کسٹمر سروس چیٹ بوٹ اور ماڈل کارڈ تیار کریں۔" : "Apply your 6 weeks of AI training to build the end-to-end canteen vision scanner, clean database table, customer service chatbot recipe, and model card."}
            </p>
          </div>

          {/* Milestone 1: Teachable Machine */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>
                {practicalMilestones[0].title} (10 {language === "ur" ? "نمبر" : "Marks"})
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[0].tasks[0].prompt} (3 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <input
                  type="text"
                  placeholder={language === "ur" ? "کلاس 1: چکن رول، کلاس 2: سموسہ، سیفٹی کلاس: خالی کاؤنٹر" : "e.g. Class 1: Chicken Roll, Class 2: Samosa, Class 3: Nothing (Empty Counter)"}
                  value={answers.practicalProject.m1_classes}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m1_classes: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[0].tasks[1].prompt} (4 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <textarea
                  rows={2}
                  placeholder={language === "ur" ? "1. مختلف زاویے (اوپر سے، سائیڈ سے)، 2. روشنی (دھوپ، سایہ)، 3. مختلف پلیٹس اور ہاتھ..." : "e.g. 1. Different angles (top-down, 45 degree), 2. Lighting (daylight, cafeteria light), 3. Background/hands..."}
                  value={answers.practicalProject.m1_variations}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m1_variations: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[0].tasks[2].prompt} (3 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <input
                  type="text"
                  placeholder={language === "ur" ? "کیمرے کا رخ سختی سے کھانے کی ٹرے پر رکھیں، طلبہ کے چہرے ریکارڈ نہ کریں..." : "e.g. Point webcam strictly down at tray surface; never record student faces or ID cards without consent."}
                  value={answers.practicalProject.m1_privacy}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m1_privacy: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>
            </div>
          </div>

          {/* Milestone 2: Tabular Schema */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>
                {practicalMilestones[1].title} (10 {language === "ur" ? "نمبر" : "Marks"})
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[1].tasks[0].prompt} (8 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <textarea
                  rows={3}
                  placeholder={language === "ur" ? "1. آرڈر آئی ڈی (Category/Text)\n2. آئٹم کا نام (Category)\n3. تعداد (Number)\n4. قیمت (Number)\n5. تاریخ (Date)" : "e.g.&#10;1. OrderID (Number)&#10;2. ItemName (Category)&#10;3. Quantity (Number)&#10;4. PricePKR (Number)&#10;5. Date (Date)"}
                  value={answers.practicalProject.m2_table_types}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m2_table_types: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm font-mono leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[1].tasks[1].prompt} (2 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <input
                  type="text"
                  placeholder={language === "ur" ? "نام اور فون نجی ڈیٹا ہے، کونسل کو صرف کل آمدنی اور کھپت سے غرض ہے..." : "Explain PII protection and why management only needs aggregate quantity/revenue data..."}
                  value={answers.practicalProject.m2_privacy_removal}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m2_privacy_removal: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>
            </div>
          </div>

          {/* Milestone 3: Data Cleaning */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>
                {practicalMilestones[2].title} (10 {language === "ur" ? "نمبر" : "Marks"})
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[2].tasks[0].prompt}
                </label>
                <textarea
                  rows={4}
                  placeholder={language === "ur" ? "• قطار 1 و 2: کیپٹلائزیشن یکساں کر کے ڈپلیکیٹ ہٹائیں\n• قطار 3: خالی تعداد پر پیلا نشان لگائیں اور rs ہٹا کر 250 لکھیں\n• قطار 4: جعلی TEST قطار ڈیلیٹ کریں\n• قطار 5: ناممکن ریٹنگ (15) مٹا کر خالی چھوڑیں" : "Row 1 & 2: Fix case sensitivity and remove duplicate row.&#10;Row 3: Highlight blank Quantity in yellow (do not fabricate); remove 'rs' text from price.&#10;Row 4: Delete bogus TEST entry row completely.&#10;Row 5: Clear impossible rating value (15), leave blank, and log in cleaning notes."}
                  value={answers.practicalProject.m3_cleaning_fixes}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m3_cleaning_fixes: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>
            </div>
          </div>

          {/* Milestone 4: Prompt Recipe */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>
                {practicalMilestones[3].title} (10 {language === "ur" ? "نمبر" : "Marks"})
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[3].tasks[0].prompt} (3 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <input
                  type="text"
                  placeholder={language === "ur" ? "بٹن 1: آج کا مینو، بٹن 2: لنچ کے اوقات، بٹن 3: اسٹاف سے رابطہ" : "e.g. Button 1: Today's Menu & Prices, Button 2: Break Timings, Button 3: Talk to Canteen Staff"}
                  value={answers.practicalProject.m4_buttons}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m4_buttons: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[3].tasks[1].prompt} (5 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <textarea
                  rows={3}
                  placeholder={language === "ur" ? "You are the friendly helper for the School Canteen. Your job is to answer student lunch questions. Reply in polite Roman Urdu using 'Aap'. Use only official prices. Never guess. Max 2 lines." : "Write your 4-part recipe prompt (Who: helper, What: answer canteen menu/price questions, Details: polite Roman Urdu 'Aap', official prices only, never fabricate, Length: 2 sentences max)..."}
                  value={answers.practicalProject.m4_prompt}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m4_prompt: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[3].tasks[2].prompt} (2 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <input
                  type="text"
                  placeholder={language === "ur" ? "کھانے کی الرجی کے لیے فوراً کاؤنٹر پر سر اسلم سے رابطہ کریں یا اسٹاف کو کال کریں..." : "e.g. For food allergy emergencies, immediately visit the canteen counter or call 0300-XXXXXXX."}
                  value={answers.practicalProject.m4_safety}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m4_safety: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>
            </div>
          </div>

          {/* Milestone 5: Accuracy & Model Card */}
          <div className="bq-card bg-white rounded-2xl p-6 border border-[#d8e9df] space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
              <h3 className={`text-base font-bold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>
                {practicalMilestones[4].title} (10 {language === "ur" ? "نمبر" : "Marks"})
              </h3>
              <span className="text-xs font-bold text-[#008b74] px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                10 {language === "ur" ? "نمبر" : "Marks"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[4].tasks[0].prompt} (3 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <input
                  type="text"
                  placeholder={language === "ur" ? "درستگی = (90 ÷ 100) × 100 = 90 فیصد" : "e.g. Accuracy = (90 correct / 100 total tests) * 100 = 90% test accuracy"}
                  value={answers.practicalProject.m5_accuracy_math}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m5_accuracy_math: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[4].tasks[1].prompt} (4 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <textarea
                  rows={2}
                  placeholder={language === "ur" ? "جمعہ کو بریانی زیادہ بکتی ہے اس لیے تازہ بنائی جائے تاکہ بچ کر ضائع نہ ہو..." : "e.g. Data shows Biryani sells out heavily on Fridays; manager prepares exact quantity avoiding food wastage..."}
                  value={answers.practicalProject.m5_insight}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m5_insight: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${language === "ur" ? "urdu-label text-[#015b30]" : "text-xs font-bold text-[#015b30]"}`}>
                  {practicalMilestones[4].tasks[2].prompt} (3 {language === "ur" ? "نمبر" : "Marks"})
                </label>
                <textarea
                  rows={3}
                  placeholder={language === "ur" ? "لائن 1: چکن رول اور سموسہ پلیٹ پہچانتا ہے\nلائن 2: قدرتی اور ٹیوب لائٹ کی 120 تصاویر پر ٹرین ہوا\nلائن 3: رات کے اندھیرے یا ایلومینیم فوائل پر غلطی کر سکتا ہے، ادویات کے لیے استعمال نہ کیا جائے" : "Line 1: Classifies Chicken Rolls and Samosas placed on the checkout counter.&#10;Line 2: Trained on 120 photos captured on school counter under natural daylight and tube lighting.&#10;Line 3: Known failure mode: Accuracy drops when food is wrapped in reflective aluminium foil or in dark shadows."}
                  value={answers.practicalProject.m5_model_card}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m5_model_card: e.target.value },
                    }))
                  }
                  className={`w-full p-3.5 rounded-xl bg-[#fbfdfb] border border-[#d8e9df] text-xs sm:text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#015b30]/15 focus:border-[#015b30] focus:bg-white transition-all ${language === "ur" ? "urdu-textarea" : "text-sm leading-relaxed"}`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#d8e9df]">
            <button
              onClick={() => setActiveTab("C")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#d8e9df] bg-white text-xs text-[#516d5e] hover:text-[#015b30] font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.prev}: {t.tabC}</span>
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#015b30] hover:bg-[#014223] text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t.submitExamBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#d8e9df] p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-3xl bg-[#f4f8f5] border border-[#d8e9df] flex items-center justify-center p-2">
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
              <h3 className={`text-xl font-extrabold text-[#015b30] ${language === "ur" ? "font-urdu" : ""}`}>
                {t.confirmSubmitTitle}
              </h3>
              <p className="text-xs text-[#516d5e] mt-1">
                {language === "ur" 
                  ? `آپ نے 20 میں سے ${mcqsAnsweredCount} کثیر الانتخابی سوالات حل کیے ہیں۔ اب آپ کا پرچہ فوری طور پر گروک AI چیک کرے گا۔`
                  : `You have answered ${mcqsAnsweredCount} of 20 MCQs and your written answers will now be graded instantly by the AI assessment engine.`}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#edf5f0] border border-[#d8e9df] text-xs text-[#015b30] text-left space-y-1 font-medium">
              <p>• {language === "ur" ? "طالب علم" : "Student"}: <strong>{student.name}</strong></p>
              <p>• {language === "ur" ? "رول نمبر" : "Roll Number"}: <strong>{student.rollNumber}</strong></p>
              <p>• {language === "ur" ? "کل نمبر" : "Total Marks"}: <strong>100 {language === "ur" ? "نمبر" : "Marks"}</strong></p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#d8e9df] bg-white text-xs font-bold text-[#516d5e] hover:bg-[#edf5f0] transition-all cursor-pointer"
              >
                {t.confirmCancel}
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  onSubmitExam();
                }}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#015b30] hover:bg-[#014223] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                {t.confirmYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
