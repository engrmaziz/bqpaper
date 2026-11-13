"use client";

import React, { useState } from "react";
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
  Sparkles,
  AlertTriangle,
  Loader2
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Section Nav Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-2 rounded-2xl glass-panel border border-[#1a2744]">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab("A")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "A"
                ? "bg-[#00d4ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                : "text-[#8ba0b5] hover:text-[#e8eef7] hover:bg-[#0a1224]"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Section A: MCQs</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "A" ? "bg-[#050a14]/30 text-[#050a14]" : "bg-[#1a2744] text-[#7df9ff]"
            }`}>
              {mcqsAnsweredCount}/20
            </span>
          </button>

          <button
            onClick={() => setActiveTab("B")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "B"
                ? "bg-[#00d4ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                : "text-[#8ba0b5] hover:text-[#e8eef7] hover:bg-[#0a1224]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Section B: Short Qs</span>
            <span className="text-[10px] text-[#e8b86d]">10 Mks</span>
          </button>

          <button
            onClick={() => setActiveTab("C")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "C"
                ? "bg-[#00d4ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                : "text-[#8ba0b5] hover:text-[#e8eef7] hover:bg-[#0a1224]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Section C: Long Q</span>
            <span className="text-[10px] text-[#e8b86d]">20 Mks</span>
          </button>

          <button
            onClick={() => setActiveTab("D")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "D"
                ? "bg-[#00d4ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                : "text-[#8ba0b5] hover:text-[#e8eef7] hover:bg-[#0a1224]"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Section D: Project</span>
            <span className="text-[10px] text-[#7df9ff] font-bold">50 Mks</span>
          </button>
        </div>

        {/* Finish & Submit Button */}
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0e8f86] text-[#050a14] text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cyan-glow disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Assessing via Groq AI...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit & View Marks</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: MCQs (20 Marks) */}
      {/* ========================================================================= */}
      {activeTab === "A" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Section banner */}
          <div className="p-4 rounded-2xl bg-[#0a1224] border border-[#1a2744] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#e8eef7]">Section A: Multiple Choice Questions (20 Marks)</h2>
              <p className="text-xs text-[#8ba0b5]">Select the single best answer for each question. 1 Mark each.</p>
            </div>
            {/* Quick Question Jump Navigator */}
            <div className="flex flex-wrap gap-1 max-w-sm">
              {MCQ_QUESTIONS.map((q) => {
                const isAns = !!answers.mcqs[q.id];
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      const el = document.getElementById(`mcq_${q.id}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                      isAns
                        ? "bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40"
                        : "bg-[#050a14] text-[#8ba0b5] border border-[#1a2744] hover:border-[#00d4ff]/30"
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
                  className={`p-5 rounded-2xl glass-panel border transition-all ${
                    selectedOpt ? "border-[#00d4ff]/40 bg-[#0a1224]" : "border-[#1a2744] bg-[#070e1c]/80"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-xs font-bold text-[#00d4ff]">
                      {q.id}
                    </span>
                    <p className="text-sm font-semibold text-[#e8eef7] leading-relaxed pt-0.5">
                      {q.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-0 sm:pl-10">
                    {(Object.keys(q.options) as ("A" | "B" | "C" | "D")[]).map((optKey) => {
                      const isChosen = selectedOpt === optKey;
                      return (
                        <button
                          key={optKey}
                          onClick={() => handleSelectMCQ(q.id, optKey)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                            isChosen
                              ? "bg-[#00d4ff]/15 border-[#00d4ff] text-[#e8eef7] cyan-glow"
                              : "bg-[#050a14] border-[#1a2744] text-[#8ba0b5] hover:border-[#00d4ff]/30 hover:text-[#e8eef7]"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                            isChosen
                              ? "bg-[#00d4ff] text-[#050a14] border-[#00d4ff]"
                              : "border-[#41536b] text-[#8ba0b5]"
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00d4ff] text-[#050a14] text-xs font-bold cyan-glow hover:bg-[#7df9ff] transition-all cursor-pointer"
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
          <div className="p-4 rounded-2xl bg-[#0a1224] border border-[#1a2744]">
            <h2 className="text-lg font-bold text-[#e8eef7]">Section B: Short Answer Questions (10 Marks)</h2>
            <p className="text-xs text-[#8ba0b5]">Answer both questions concisely in the guided boxes below. Focus on key concepts.</p>
          </div>

          {/* Question 1 */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">{SHORT_QUESTIONS[0].title}</h3>
              <span className="text-xs font-bold text-[#00d4ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                5 Marks
              </span>
            </div>
            <p className="text-xs text-[#8ba0b5] italic">{SHORT_QUESTIONS[0].scenario}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  (a) Explain the single main difference between them (Hint: Mention labels/answers): (2 Marks)
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
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
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
                    className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
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
                    className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">{SHORT_QUESTIONS[1].title}</h3>
              <span className="text-xs font-bold text-[#00d4ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                5 Marks
              </span>
            </div>
            <p className="text-xs text-[#8ba0b5] italic">{SHORT_QUESTIONS[1].scenario}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  (a) What mistake in training data causes a model to do ratta (overfit)? (2 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Taking all training photos on the exact same desk in identical lighting..."
                  value={answers.shortQuestions.q2_a}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      shortQuestions: { ...prev.shortQuestions, q2_a: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  (b) Name the Four Words of Good Data (English or Urdu) that prevent ratta: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enough (Kaafi), Balanced (Mutawazin), Varied (Mutanawwo), Correct (Durust)..."
                  value={answers.shortQuestions.q2_b}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      shortQuestions: { ...prev.shortQuestions, q2_b: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab("A")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1a2744] text-[#8ba0b5] text-xs font-semibold hover:text-[#e8eef7] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Section A</span>
            </button>
            <button
              onClick={() => setActiveTab("C")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00d4ff] text-[#050a14] text-xs font-bold cyan-glow hover:bg-[#7df9ff] transition-all cursor-pointer"
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
          <div className="p-4 rounded-2xl bg-[#0a1224] border border-[#1a2744]">
            <h2 className="text-lg font-bold text-[#e8eef7]">Section C: Comprehensive Long Question (20 Marks)</h2>
            <p className="text-xs text-[#8ba0b5]">Answer all three guided parts on real-world AI systems, language, and clinical ethics.</p>
          </div>

          {/* Part A */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">Part (a): The Voice Assistant Chain (6 Marks)</h3>
              <span className="text-xs font-bold text-[#00d4ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                6 Marks
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  1. State the technical AI name for each stage: Ears -&gt; Brain -&gt; Mouth (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ears: Speech-to-Text (STT) | Brain: Large Language Model (LLM) | Mouth: Text-to-Speech (TTS)"
                  value={answers.longQuestion.part_a_chain}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_a_chain: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  2. If a Bykea user is on a noisy road, which stage breaks first, and how does that affect the final spoken output? (3 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. The Ears (STT) mishear due to traffic noise, feeding wrong text into the Brain, which makes the Mouth speak a confident wrong answer..."
                  value={answers.longQuestion.part_a_error}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_a_error: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Part B */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">Part (b): The Traps of Sentiment Analysis (6 Marks)</h3>
              <span className="text-xs font-bold text-[#00d4ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                6 Marks
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  1. Sarcasm: Why does a comment like &quot;Shukriya itna kharab suit bhejne ka&quot; trick an AI into scoring Positive? (3 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. The AI scans superficial praise words ('Shukriya') and counts positive weights, missing the sarcastic complaint..."
                  value={answers.longQuestion.part_b_sarcasm}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_b_sarcasm: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  2. Local Slang: Why do words like &quot;Ye bowler to aag hai!&quot; or &quot;Sick shot!&quot; get marked Negative by basic models? (3 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. In cricket slang, 'aag' (fire) or 'sick' means brilliant performance, but a literal model treats them as fire hazards or sickness..."
                  value={answers.longQuestion.part_b_slang}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_b_slang: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Part C */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">Part (c): Computer Vision & Medical Ethics (8 Marks)</h3>
              <span className="text-xs font-bold text-[#00d4ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                8 Marks
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  1. Why does an image classifier tested on photos from strangers score lower than on its own photos? (3 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. The model memorized the builder's background, lighting, and hands. Strangers introduce new angles and variations..."
                  value={answers.longQuestion.part_c_strangers}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_c_strangers: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  2. A TB screening AI claims &quot;95% Accuracy&quot;. Why must a human doctor ALWAYS make the final decision? (Compare A Miss vs A False Alarm). (5 Marks)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 95% accuracy means 5 in 100 people are misdiagnosed. A False Alarm causes a re-test, but A Miss sends a sick patient home untreated to get worse. AI flags, doctor decides..."
                  value={answers.longQuestion.part_c_doctor_ethics}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      longQuestion: { ...prev.longQuestion, part_c_doctor_ethics: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab("B")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1a2744] text-[#8ba0b5] text-xs font-semibold hover:text-[#e8eef7] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Section B</span>
            </button>
            <button
              onClick={() => setActiveTab("D")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00d4ff] text-[#050a14] text-xs font-bold cyan-glow hover:bg-[#7df9ff] transition-all cursor-pointer"
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
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0a1224] to-[#101b33] border border-[#00d4ff]/40 cyan-glow">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00d4ff] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>HANDS-ON LAB SCENARIO • 50 MARKS TOTAL</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#e8eef7]">Project: &quot;The Smart School Canteen AI&quot;</h2>
            <p className="text-xs text-[#8ba0b5] mt-1">
              Design a complete AI and data solution across 5 milestones (10 Marks each).
            </p>
          </div>

          {/* Milestone 1 */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">{PRACTICAL_PROJECT_MILESTONES[0].title}</h3>
              <span className="text-xs font-bold text-[#7df9ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                10 Marks
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  1. Name TWO food classes and ONE essential safety class to avoid false detections: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Food 1: Chicken Roll Plate | Food 2: Samosa Chaat | Safety: 'Nothing' (Empty Counter)"
                  value={answers.practicalProject.m1_classes}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m1_classes: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  2. Three photo variations you will record to follow the Varied Rule (angles, light, hands): (4 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1. Overhead and 45-degree angles | 2. Morning sunlight and dim afternoon lighting | 3. Different trays and student hands"
                  value={answers.practicalProject.m1_variations}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m1_variations: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  3. ONE vital camera privacy rule for the canteen counter: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Point camera strictly down at the food trays; ask permission and never capture or store student faces or ID cards."
                  value={answers.practicalProject.m1_privacy}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m1_privacy: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">{PRACTICAL_PROJECT_MILESTONES[1].title}</h3>
              <span className="text-xs font-bold text-[#7df9ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                10 Marks
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  1 &amp; 2. Design 5 column headers and state their exact Data Type (Number, Category, Text, Date): (8 Marks)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1. Order_ID (Category) | 2. Item_Name (Category) | 3. Quantity (Number) | 4. Price_PKR (Number) | 5. Order_Date (Date)"
                  value={answers.practicalProject.m2_table_types}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m2_table_types: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  3. Why must student names and phone numbers be removed before sharing reports with the school council? (2 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Student names and phone numbers are private personal data; sales reports only need item counts and revenue totals..."
                  value={answers.practicalProject.m2_privacy_removal}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m2_privacy_removal: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">{PRACTICAL_PROJECT_MILESTONES[2].title}</h3>
              <span className="text-xs font-bold text-[#7df9ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                10 Marks
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#e8eef7] mb-2">
                Provide the exact fix for each messy data row (Row 1&amp;2 duplicates, Row 3 blank &amp; &apos;250 rs&apos;, Row 4 TEST entry, Row 5 rating 15): (10 Marks)
              </label>
              <textarea
                rows={4}
                placeholder="• Row 1 & 2: Unify letter case using Find & Replace, then Remove Duplicates.
• Row 3: Mark blank Qty yellow and leave out of totals; remove ' rs' so price is pure number 250.
• Row 4: Right-click and delete the fake TEST row completely.
• Row 5: Clear the impossible 15 rating, leave it blank, and record it in the cleaning log."
                value={answers.practicalProject.m3_cleaning_fixes}
                onChange={(e) =>
                  onUpdateAnswers((prev) => ({
                    ...prev,
                    practicalProject: { ...prev.practicalProject, m3_cleaning_fixes: e.target.value },
                  }))
                }
                className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all font-mono"
              />
            </div>
          </div>

          {/* Milestone 4 */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">{PRACTICAL_PROJECT_MILESTONES[3].title}</h3>
              <span className="text-xs font-bold text-[#7df9ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                10 Marks
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  1. Three menu buttons for the no-code WhatsApp Landbot: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Button 1: Today's Menu | Button 2: Break Timings | Button 3: Talk to Canteen Staff"
                  value={answers.practicalProject.m4_buttons}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m4_buttons: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  2. Four-part recipe prompt for Gemini in Roman Urdu (Who, What, Details, Length) - forbid making up prices: (5 Marks)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. You are the friendly Canteen Assistant. Your job is to answer lunch questions. Reply in polite Roman Urdu using 'Aap'. Use only these prices: Roll Rs 200, Biryani Rs 250. Never guess unlisted prices; say 'Canteen counter par puchen'. Maximum 2 short lines."
                  value={answers.practicalProject.m4_prompt}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m4_prompt: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  3. Emergency allergy safety fallback message: (2 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Food allergy ya emergency ke liye foran canteen counter par Sir Aslam se milain ya phone karein: 03XX-XXXXXXX."
                  value={answers.practicalProject.m4_safety}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m4_safety: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Milestone 5 */}
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
              <h3 className="text-base font-bold text-[#e8eef7]">{PRACTICAL_PROJECT_MILESTONES[4].title}</h3>
              <span className="text-xs font-bold text-[#7df9ff] px-2.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                10 Marks
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  1. Accuracy calculation: 17 right and 3 wrong out of 20 tests: (3 Marks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Accuracy = (Correct / Total) x 100 = (17 / 20) x 100 = 85%"
                  value={answers.practicalProject.m5_accuracy_math}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m5_accuracy_math: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  2. Three-part Insight (Roll sold 85, Soup sold 5): What -&gt; So What -&gt; Now What: (4 Marks)
                </label>
                <textarea
                  rows={3}
                  placeholder="• WHAT: Chicken Rolls sold 85 units while Vegetable Soup sold only 5 units.
• SO WHAT: Students overwhelmingly prefer quick finger-food to eat during a short 20-minute break.
• NOW WHAT: Double Chicken Roll preparation to 100 units tomorrow, and stop making soup to eliminate waste."
                  value={answers.practicalProject.m5_insight}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m5_insight: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8eef7] mb-1">
                  3. Three-line Model Card: What it does, Data used, Where it fails: (3 Marks)
                </label>
                <textarea
                  rows={3}
                  placeholder="1. WHAT IT DOES: Classifies food plates (Chicken Roll vs Samosa Chaat) or reports 'Nothing' on counter.
2. DATA USED: 60 webcam photos per class across 3 lighting conditions and 2 student hands.
3. WHERE IT FAILS: Fails when food is wrapped in reflective aluminum foil, held far away, or in very dim lighting."
                  value={answers.practicalProject.m5_model_card}
                  onChange={(e) =>
                    onUpdateAnswers((prev) => ({
                      ...prev,
                      practicalProject: { ...prev.practicalProject, m5_model_card: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab("C")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1a2744] text-[#8ba0b5] text-xs font-semibold hover:text-[#e8eef7] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Section C</span>
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0e8f86] text-[#050a14] text-sm font-bold cyan-glow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Entire Examination</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md glass-panel rounded-2xl border border-[#00d4ff]/30 p-6 shadow-2xl bg-[#0a1224]/95 text-[#e8eef7] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8b86d]/10 border border-[#e8b86d]/30 flex items-center justify-center text-[#e8b86d]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#e8eef7]">Confirm Exam Submission?</h3>
                <p className="text-xs text-[#8ba0b5]">Student: {student.name} ({student.rollNumber})</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs text-[#8ba0b5] space-y-1.5">
              <p className="flex justify-between">
                <span>MCQs Answered:</span>
                <strong className="text-[#00d4ff]">{mcqsAnsweredCount} of 20</strong>
              </p>
              <p className="text-[11px] text-[#e8b86d]">
                Once submitted, your paper will be processed immediately by Groq AI, and your marksheet entry will be generated.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#1a2744] text-[#8ba0b5] hover:text-[#e8eef7]"
              >
                Go Back &amp; Review
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  onSubmitExam();
                }}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#00d4ff] text-[#050a14] hover:bg-[#7df9ff] cyan-glow flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Yes, Submit Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
