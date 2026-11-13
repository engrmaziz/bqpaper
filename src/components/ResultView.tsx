"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  Lock,
  ShieldCheck,
  BookOpen
} from "lucide-react";

interface ResultViewProps {
  result: AssessmentResult;
  onRetake: () => void;
  onViewMarksheet?: () => void;
  isExaminer?: boolean;
}

export default function ResultView({ 
  result, 
  onRetake, 
  onViewMarksheet,
  isExaminer = false
}: ResultViewProps) {
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
          colors: ["#015b30", "#008b74", "#7cb342", "#c29b38"],
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

  const getGradeBadge = (g: string) => {
    if (g === "A+") return "bg-[#edf5f0] text-[#015b30] border-[#015b30]";
    if (g === "A") return "bg-[#edf5f0] text-[#015b30] border-[#015b30]/60";
    if (g === "B") return "bg-amber-50 text-amber-800 border-amber-300";
    if (g === "C") return "bg-yellow-50 text-yellow-800 border-yellow-300";
    return "bg-red-50 text-red-700 border-red-300";
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Official Top Banner Card */}
      <div className="bq-card bg-white p-6 sm:p-8 border border-[#d4e7dc] shadow-md relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#015b30] via-[#008b74] to-[#7cb342]" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          {/* Logo & Student Info */}
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="relative w-20 h-20 flex-shrink-0 bg-[#f4f8f5] p-2 rounded-2xl border border-[#d4e7dc] flex items-center justify-center shadow-xs">
              <Image
                src="/bano-qabil.png"
                alt="Bano Qabil Official Logo"
                width={72}
                height={72}
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5] text-[#015b30] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008b74]" />
                <span>OFFICIAL EXAMINATION SCORECARD</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#015b30]">
                Midterm Paper Assessment
              </h1>
              <p className="text-sm text-[#0d2317]">
                Student: <strong className="text-[#015b30] font-bold">{result.student.name}</strong> • Roll No: <strong className="text-[#008b74] font-bold">{result.student.rollNumber}</strong> ({result.student.section})
              </p>
              <p className="text-xs text-[#516d5e] flex items-center justify-center md:justify-start gap-3 pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7cb342]" /> Time: {formatSeconds(result.timeSpentSeconds)}
                </span>
                <span>• Submitted: {result.submittedAt}</span>
              </p>
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] text-[#008b74] font-semibold pt-1">
                <Lock className="w-3.5 h-3.5 text-[#008b74]" />
                <span>Confidential Scorecard: Visible to student only. Master mark sheet restricted to <strong>io@maziz.me</strong>.</span>
              </div>
            </div>
          </div>

          {/* Big Score Card */}
          <div className="flex items-center gap-3">
            <div className="text-center p-4 rounded-2xl bg-[#f4f8f5] border border-[#d4e7dc] min-w-[110px]">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#015b30] font-mono">
                {result.totalScore}
              </span>
              <span className="text-[10px] text-[#516d5e] block font-bold uppercase tracking-wider">/ 100 MARKS</span>
            </div>

            <div className={`text-center p-4 rounded-2xl border ${getGradeBadge(result.grade)} min-w-[95px]`}>
              <span className="text-3xl sm:text-4xl font-black block font-mono">{result.grade}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider block">GRADE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Section Score Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] text-center space-y-1">
          <p className="text-[11px] font-bold text-[#516d5e] uppercase tracking-wider">Section A (MCQs)</p>
          <p className="text-xl sm:text-2xl font-bold text-[#0d2317]">
            <span className="text-[#015b30]">{result.sectionScores.sectionA}</span> / 20
          </p>
          <span className="text-[10px] text-[#516d5e]">20 Objective Questions</span>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] text-center space-y-1">
          <p className="text-[11px] font-bold text-[#516d5e] uppercase tracking-wider">Section B (Short Qs)</p>
          <p className="text-xl sm:text-2xl font-bold text-[#0d2317]">
            <span className="text-[#015b30]">{result.sectionScores.sectionB}</span> / 10
          </p>
          <span className="text-[10px] text-[#516d5e]">Concepts &amp; Data Pillars</span>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] text-center space-y-1">
          <p className="text-[11px] font-bold text-[#516d5e] uppercase tracking-wider">Section C (Long Q)</p>
          <p className="text-xl sm:text-2xl font-bold text-[#0d2317]">
            <span className="text-[#015b30]">{result.sectionScores.sectionC}</span> / 20
          </p>
          <span className="text-[10px] text-[#516d5e]">Voice AI &amp; Vision Ethics</span>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] text-center space-y-1">
          <p className="text-[11px] font-bold text-[#008b74] uppercase tracking-wider">Section D (Project)</p>
          <p className="text-xl sm:text-2xl font-bold text-[#0d2317]">
            <span className="text-[#008b74]">{result.sectionScores.sectionD}</span> / 50
          </p>
          <span className="text-[10px] text-[#516d5e]">Smart Canteen AI</span>
        </div>
      </div>

      {/* AI Feedback Highlights */}
      <div className="bq-card bg-white rounded-2xl p-6 border border-[#d4e7dc] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#edf5f0] pb-3">
          <Lightbulb className="w-5 h-5 text-[#008b74]" />
          <h2 className="text-base font-bold text-[#015b30]">Examiner Qualitative Feedback &amp; AI Analysis</h2>
        </div>

        <p className="text-sm text-[#0d2317] italic bg-[#f4f8f5] p-3.5 rounded-xl border border-[#d4e7dc]">
          &ldquo;{result.generalFeedback.summary}&rdquo;
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[#edf5f0] border border-[#a3cbb5] space-y-2">
            <h4 className="text-xs font-bold text-[#015b30] flex items-center gap-1.5 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-[#7cb342]" /> Demonstrated Strengths
            </h4>
            <ul className="text-xs text-[#0d2317] space-y-1 list-disc list-inside">
              {result.generalFeedback.strengths.map((str, i) => (
                <li key={i}>{str}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
              <TrendingUp className="w-4 h-4 text-amber-700" /> Recommendations for Growth
            </h4>
            <ul className="text-xs text-[#0d2317] space-y-1 list-disc list-inside">
              {result.generalFeedback.improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Review Section Selector */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#d4e7dc] pb-2">
          <button
            onClick={() => setActiveSectionView("mcqs")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSectionView === "mcqs"
                ? "bg-[#015b30] text-white shadow-xs"
                : "text-[#516d5e] hover:text-[#015b30] hover:bg-[#edf5f0]"
            }`}
          >
            Review MCQs (20 Questions)
          </button>
          <button
            onClick={() => setActiveSectionView("subjective")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSectionView === "subjective"
                ? "bg-[#015b30] text-white shadow-xs"
                : "text-[#516d5e] hover:text-[#015b30] hover:bg-[#edf5f0]"
            }`}
          >
            Review Written &amp; Project Marks (80 Marks)
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
                    ? "bg-[#fafdfb] border-[#a3cbb5]"
                    : "bg-red-50/40 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {m.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-[#015b30] flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#0d2317]">
                        Question {m.id}
                      </p>
                      <div className="flex items-center gap-4 text-xs mt-1">
                        <span className={m.isCorrect ? "text-[#015b30] font-bold" : "text-red-700 font-bold"}>
                          Your Choice: {m.studentAnswer || "Not Answered"}
                        </span>
                        {!m.isCorrect && (
                          <span className="text-[#015b30] font-bold">
                            Correct: {m.correctAnswer}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#516d5e] mt-1.5 italic bg-[#f4f8f5] p-2.5 rounded-lg border border-[#d4e7dc]">
                        Rationale: {m.explanation}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    m.isCorrect ? "bg-[#edf5f0] text-[#015b30]" : "bg-red-100 text-red-700"
                  }`}>
                    {m.isCorrect ? "1 / 1 Mk" : "0 / 1 Mk"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subjective & Project Breakdown */}
        {activeSectionView === "subjective" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-white border border-[#d4e7dc] space-y-3">
              <h3 className="text-sm font-bold text-[#015b30]">Subjective Questions &amp; Practical Rubric Breakdown</h3>
              <p className="text-xs text-[#516d5e]">
                Click any question to view the examiner marking rubric and specific feedback.
              </p>

              <div className="space-y-2">
                {Object.entries(result.subjectiveFeedback).map(([qKey, fb]) => (
                  <div key={qKey} className="border border-[#d4e7dc] rounded-xl overflow-hidden bg-[#fafdfb]">
                    <div 
                      onClick={() => toggleQuestion(qKey)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#edf5f0] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#015b30] uppercase">
                          {qKey.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#015b30] px-2.5 py-0.5 rounded bg-[#edf5f0]">
                          {fb.marksAwarded} / {fb.maxMarks} Marks
                        </span>
                        {expandedQuestions[qKey] ? (
                          <ChevronUp className="w-4 h-4 text-[#516d5e]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#516d5e]" />
                        )}
                      </div>
                    </div>

                    {expandedQuestions[qKey] && (
                      <div className="p-3.5 border-t border-[#d4e7dc] bg-white text-xs text-[#0d2317] space-y-1">
                        <p className="text-[#516d5e] font-semibold">Examiner Note:</p>
                        <p className="italic bg-[#f4f8f5] p-2 rounded-lg border border-[#d4e7dc]">{fb.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#d4e7dc]">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#d4e7dc] bg-white hover:bg-[#edf5f0] text-xs text-[#516d5e] hover:text-[#015b30] transition-all font-bold cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Take Exam Again</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#015b30]/30 bg-white hover:bg-[#edf5f0] text-xs text-[#015b30] transition-all font-bold cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Scorecard (PDF)</span>
          </button>

          {onViewMarksheet && (
            <button
              onClick={onViewMarksheet}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isExaminer
                  ? "bg-[#015b30] text-white shadow-sm hover:bg-[#014223]"
                  : "bg-[#edf5f0] border border-[#d4e7dc] hover:border-[#015b30]/30 text-[#516d5e] hover:text-[#015b30]"
              }`}
            >
              {isExaminer ? (
                <>
                  <Award className="w-4 h-4" />
                  <span>View Full Marksheet</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#008b74]" />
                  <span>Examiner Portal</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
