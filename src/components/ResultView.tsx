"use client";

import React, { useEffect, useState } from "react";
import { AssessmentResult } from "@/types/exam";
import { SHORT_QUESTIONS, LONG_QUESTION, PRACTICAL_PROJECT_MILESTONES } from "@/data/examData";
import confetti from "canvas-confetti";
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Printer, 
  RotateCcw, 
  TrendingUp, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  ExternalLink
} from "lucide-react";

interface ResultViewProps {
  result: AssessmentResult;
  onRetake: () => void;
  onViewMarksheet: () => void;
}

export default function ResultView({ result, onRetake, onViewMarksheet }: ResultViewProps) {
  const [activeSectionView, setActiveSectionView] = useState<"summary" | "mcqs" | "subjective">("summary");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Launch celebratory confetti if student scored >= 70%
    if (result.percentage >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00d4ff", "#7df9ff", "#e8b86d", "#0e8f86"],
        });
      } catch {
        // Safe catch if confetti fails
      }
    }
  }, [result.percentage]);

  const toggleQuestion = (key: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getGradeColor = (g: string) => {
    if (g === "A+") return "text-[#7df9ff] border-[#00d4ff] bg-[#00d4ff]/10 cyan-glow";
    if (g === "A") return "text-[#00d4ff] border-[#00d4ff]/50 bg-[#00d4ff]/10";
    if (g === "B") return "text-[#e8b86d] border-[#e8b86d]/50 bg-[#e8b86d]/10";
    if (g === "C") return "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";
    return "text-red-400 border-red-500/50 bg-red-500/10";
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#00d4ff]/30 cyan-glow bg-[#0a1224]/90 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>ASSESSMENT COMPLETED INSTANTLY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e8eef7]">
              Student Midterm Scorecard
            </h1>
            <p className="text-sm text-[#8ba0b5]">
              Name: <strong className="text-[#e8eef7]">{result.student.name}</strong> • Roll No: <strong className="text-[#00d4ff]">{result.student.rollNumber}</strong> ({result.student.section})
            </p>
            <p className="text-xs text-[#8ba0b5] flex items-center justify-center md:justify-start gap-4 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#e8b86d]" /> Time: {formatSeconds(result.timeSpentSeconds)}
              </span>
              <span>Submitted: {result.submittedAt}</span>
            </p>
          </div>

          {/* Big Score Circle */}
          <div className="flex items-center gap-4">
            <div className="text-center p-4 rounded-2xl bg-[#050a14] border border-[#1a2744]">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#00d4ff] font-mono cyan-glow-text">
                {result.totalScore}
              </span>
              <span className="text-xs text-[#8ba0b5] block font-semibold">/ 100 MARKS</span>
            </div>

            <div className={`text-center p-4 rounded-2xl border ${getGradeColor(result.grade)} min-w-[90px]`}>
              <span className="text-3xl sm:text-4xl font-black block">{result.grade}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider block">GRADE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Section Score Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-[#1a2744] text-center space-y-1">
          <p className="text-[11px] font-semibold text-[#8ba0b5] uppercase tracking-wider">Section A (MCQs)</p>
          <p className="text-xl sm:text-2xl font-bold text-[#e8eef7]">
            <span className="text-[#00d4ff]">{result.sectionScores.sectionA}</span> / 20
          </p>
          <span className="text-[10px] text-[#8ba0b5]">20 Objective Questions</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#1a2744] text-center space-y-1">
          <p className="text-[11px] font-semibold text-[#8ba0b5] uppercase tracking-wider">Section B (Short Qs)</p>
          <p className="text-xl sm:text-2xl font-bold text-[#e8eef7]">
            <span className="text-[#00d4ff]">{result.sectionScores.sectionB}</span> / 10
          </p>
          <span className="text-[10px] text-[#8ba0b5]">Concepts &amp; Data Pillars</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#1a2744] text-center space-y-1">
          <p className="text-[11px] font-semibold text-[#8ba0b5] uppercase tracking-wider">Section C (Long Q)</p>
          <p className="text-xl sm:text-2xl font-bold text-[#e8eef7]">
            <span className="text-[#00d4ff]">{result.sectionScores.sectionC}</span> / 20
          </p>
          <span className="text-[10px] text-[#8ba0b5]">Systems &amp; Ethics</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#00d4ff]/30 text-center space-y-1 cyan-glow">
          <p className="text-[11px] font-semibold text-[#7df9ff] uppercase tracking-wider">Section D (Project)</p>
          <p className="text-xl sm:text-2xl font-bold text-[#e8eef7]">
            <span className="text-[#7df9ff]">{result.sectionScores.sectionD}</span> / 50
          </p>
          <span className="text-[10px] text-[#8ba0b5]">Smart Canteen AI</span>
        </div>
      </div>

      {/* AI Evaluator Badge & General Feedback */}
      <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1a2744] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#e8b86d]" />
            <h3 className="text-base font-bold text-[#e8eef7]">Teacher &amp; AI Evaluator Summary</h3>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050a14] border border-[#1a2744] text-xs text-[#8ba0b5]">
            <Zap className="w-3.5 h-3.5 text-[#00d4ff]" />
            <span>Assessed by: <strong className="text-[#e8eef7]">{result.evaluatedBy === "groq-ai" ? `Groq AI (${result.modelUsed})` : "Deterministic Rubric Engine"}</strong></span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#e8eef7] leading-relaxed bg-[#050a14] p-3.5 rounded-xl border border-[#1a2744]">
          {result.generalFeedback.summary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Strong Conceptual Areas
            </h4>
            <ul className="text-xs text-[#8ba0b5] space-y-1 list-disc list-inside">
              {result.generalFeedback.strengths.map((str, i) => (
                <li key={i}>{str}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
            <h4 className="text-xs font-bold text-[#e8b86d] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" /> Recommended Growth Areas
            </h4>
            <ul className="text-xs text-[#8ba0b5] space-y-1 list-disc list-inside">
              {result.generalFeedback.improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Review Section Selector */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1a2744] pb-2">
          <button
            onClick={() => setActiveSectionView("mcqs")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSectionView === "mcqs"
                ? "bg-[#00d4ff] text-[#050a14] font-bold cyan-glow"
                : "text-[#8ba0b5] hover:text-[#e8eef7]"
            }`}
          >
            Review MCQs (20 Questions)
          </button>
          <button
            onClick={() => setActiveSectionView("subjective")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSectionView === "subjective"
                ? "bg-[#00d4ff] text-[#050a14] font-bold cyan-glow"
                : "text-[#8ba0b5] hover:text-[#e8eef7]"
            }`}
          >
            Review Subjective &amp; Project Marks (80 Marks)
          </button>
        </div>

        {/* MCQs Review */}
        {activeSectionView === "mcqs" && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {result.mcqResults.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition-all ${
                  m.isCorrect
                    ? "bg-[#0a1224]/80 border-emerald-500/30"
                    : "bg-[#0a1224]/80 border-red-500/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {m.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-[#e8eef7]">
                        Question {m.id}
                      </p>
                      <div className="flex items-center gap-4 text-xs mt-1">
                        <span className={m.isCorrect ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                          Your Choice: {m.studentAnswer || "Not Answered"}
                        </span>
                        {!m.isCorrect && (
                          <span className="text-emerald-400 font-bold">
                            Correct: {m.correctAnswer}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8ba0b5] mt-1.5 italic bg-[#050a14] p-2 rounded-lg border border-[#1a2744]">
                        Rationale: {m.explanation}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    m.isCorrect ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"
                  }`}>
                    {m.isCorrect ? "1 / 1" : "0 / 1"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subjective Review */}
        {activeSectionView === "subjective" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {Object.entries(result.subjectiveFeedback).map(([qKey, fb]) => {
              const isExpanded = !!expandedQuestions[qKey];
              return (
                <div key={qKey} className="p-4 rounded-xl glass-panel border border-[#1a2744] space-y-2">
                  <div 
                    onClick={() => toggleQuestion(qKey)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-mono uppercase text-[#00d4ff] font-bold">{qKey.replace(/_/g, " ")}</span>
                      <p className="text-xs text-[#8ba0b5]">Click to expand rubric &amp; evaluation notes</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#e8eef7] px-2.5 py-1 rounded-full bg-[#050a14] border border-[#00d4ff]/30">
                        {fb.marksAwarded} / {fb.maxMarks} Marks
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#8ba0b5]" /> : <ChevronDown className="w-4 h-4 text-[#8ba0b5]" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-2 border-t border-[#1a2744] text-xs text-[#8ba0b5] space-y-2">
                      <div className="p-2.5 rounded-lg bg-[#050a14] border border-[#1a2744]">
                        <strong className="text-[#00d4ff]">AI Examiner Feedback:</strong> {fb.feedback}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1a2744]">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1a2744] hover:bg-[#1a2744] text-xs text-[#8ba0b5] hover:text-[#e8eef7] transition-all font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Take Exam Again</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#00d4ff]/30 hover:bg-[#00d4ff]/10 text-xs text-[#00d4ff] transition-all font-semibold"
          >
            <Printer className="w-4 h-4" />
            <span>Print Scorecard (PDF)</span>
          </button>

          <button
            onClick={onViewMarksheet}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00d4ff] text-[#050a14] text-xs font-bold cyan-glow hover:bg-[#7df9ff] transition-all font-semibold"
          >
            <Award className="w-4 h-4" />
            <span>View Full Marksheet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
