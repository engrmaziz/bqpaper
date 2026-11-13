"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AssessmentResult } from "@/types/exam";
import { MCQ_QUESTIONS, SHORT_QUESTIONS, LONG_QUESTION, PRACTICAL_PROJECT_MILESTONES } from "@/data/examData";
import { MCQ_QUESTIONS_UR } from "@/data/examDataUrdu";
import { Language, TRANSLATIONS } from "@/data/translations";
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
  language?: Language;
}

export default function ResultView({ 
  result, 
  onRetake, 
  onViewMarksheet,
  isExaminer = false,
  language = "en"
}: ResultViewProps) {
  const [activeSectionView, setActiveSectionView] = useState<"summary" | "mcqs" | "subjective">("summary");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const t = TRANSLATIONS[language].result;

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
    return `${m}${language === "ur" ? " منٹ " : "m "}${s}${language === "ur" ? " سیکنڈ" : "s"}`;
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300 ${language === "ur" ? "rtl text-right" : ""}`}>
      {/* Official Top Banner Card */}
      <div className="bq-card bg-white p-6 sm:p-8 border border-[#d4e7dc] shadow-md relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#015b30] via-[#008b74] to-[#7cb342]" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          {/* Logo & Student Info with Patron Portrait */}
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="flex items-center -space-x-3">
              <div className="relative w-20 h-20 flex-shrink-0 bg-[#f4f8f5] p-2 rounded-2xl border border-[#d4e7dc] flex items-center justify-center shadow-xs z-10">
                <Image
                  src="/bano-qabil.png"
                  alt="Bano Qabil Official Logo"
                  width={72}
                  height={72}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative w-20 h-20 flex-shrink-0 bg-[#edf5f0] p-1 rounded-2xl border-2 border-[#015b30] flex items-center justify-center overflow-hidden shadow-xs ring-2 ring-[#7cb342]/40">
                <Image
                  src="/hafiz.png"
                  alt="Patron Hafiz Naeem ur Rehman"
                  width={72}
                  height={72}
                  className="object-cover rounded-xl w-full h-full"
                  priority
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf5f0] border border-[#a3cbb5] text-[#015b30] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008b74]" />
                <span>{t.scorecard}</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold text-[#015b30] ${language === "ur" ? "font-nastaliq" : ""}`}>
                {t.paperAssessment}
              </h1>
              <p className="text-sm text-[#0d2317]">
                {t.studentLabel}: <strong className="text-[#015b30] font-bold">{result.student.name}</strong> • {language === "ur" ? "رول نمبر" : "Roll No"}: <strong className="text-[#008b74] font-bold">{result.student.rollNumber}</strong> ({result.student.section})
              </p>
              <p className="text-xs text-[#516d5e] flex items-center justify-center md:justify-start gap-3 pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7cb342]" /> {t.timeSpent}: {formatSeconds(result.timeSpentSeconds)}
                </span>
                <span>• {t.submittedAt}: {result.submittedAt}</span>
              </p>
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] text-[#008b74] font-semibold pt-1">
                <Lock className="w-3.5 h-3.5 text-[#008b74]" />
                <span>{t.confidentialNotice}</span>
              </div>
            </div>
          </div>

          {/* Big Score Card */}
          <div className="flex items-center gap-3">
            <div className="text-center p-4 rounded-2xl bg-[#f4f8f5] border border-[#d4e7dc] min-w-[110px]">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#015b30] font-mono">
                {result.totalScore}
              </span>
              <span className="text-[10px] text-[#516d5e] block font-bold uppercase tracking-wider">/ 100 {language === "ur" ? "نمبر" : "MARKS"}</span>
            </div>

            <div className={`text-center p-4 rounded-2xl border min-w-[90px] shadow-sm ${getGradeBadge(result.grade)}`}>
              <span className="text-3xl sm:text-4xl font-extrabold block">
                {result.grade}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider">{t.letterGrade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Breakdown Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] space-y-1 shadow-xs">
          <span className="text-[#516d5e] text-[11px] font-bold uppercase tracking-wider block">
            {language === "ur" ? "سیکشن A: کثیر الانتخابی" : "Sec A: MCQs"}
          </span>
          <p className="text-xl font-extrabold text-[#015b30] font-mono">
            {result.sectionScores.sectionA} <span className="text-xs text-[#516d5e] font-sans">/ 20</span>
          </p>
          <div className="w-full h-1.5 rounded-full bg-[#edf5f0] overflow-hidden">
            <div 
              className="h-full bg-[#015b30] rounded-full"
              style={{ width: `${(result.sectionScores.sectionA / 20) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] space-y-1 shadow-xs">
          <span className="text-[#516d5e] text-[11px] font-bold uppercase tracking-wider block">
            {language === "ur" ? "سیکشن B: مختصر سوالات" : "Sec B: Short Qs"}
          </span>
          <p className="text-xl font-extrabold text-[#015b30] font-mono">
            {result.sectionScores.sectionB} <span className="text-xs text-[#516d5e] font-sans">/ 10</span>
          </p>
          <div className="w-full h-1.5 rounded-full bg-[#edf5f0] overflow-hidden">
            <div 
              className="h-full bg-[#015b30] rounded-full"
              style={{ width: `${(result.sectionScores.sectionB / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] space-y-1 shadow-xs">
          <span className="text-[#516d5e] text-[11px] font-bold uppercase tracking-wider block">
            {language === "ur" ? "سیکشن C: تفصیلی سوال" : "Sec C: Long Q"}
          </span>
          <p className="text-xl font-extrabold text-[#015b30] font-mono">
            {result.sectionScores.sectionC} <span className="text-xs text-[#516d5e] font-sans">/ 20</span>
          </p>
          <div className="w-full h-1.5 rounded-full bg-[#edf5f0] overflow-hidden">
            <div 
              className="h-full bg-[#015b30] rounded-full"
              style={{ width: `${(result.sectionScores.sectionC / 20) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-[#edf5f0] border border-[#a3cbb5] space-y-1 shadow-xs">
          <span className="text-[#015b30] text-[11px] font-bold uppercase tracking-wider block">
            {language === "ur" ? "سیکشن D: پروجیکٹ" : "Sec D: Practical"}
          </span>
          <p className="text-xl font-extrabold text-[#015b30] font-mono">
            {result.sectionScores.sectionD} <span className="text-xs text-[#015b30] font-sans">/ 50</span>
          </p>
          <div className="w-full h-1.5 rounded-full bg-white overflow-hidden">
            <div 
              className="h-full bg-[#008b74] rounded-full"
              style={{ width: `${(result.sectionScores.sectionD / 50) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#d4e7dc] pb-2">
        <button
          onClick={() => setActiveSectionView("summary")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSectionView === "summary"
              ? "bg-[#015b30] text-white shadow-xs"
              : "text-[#516d5e] hover:text-[#015b30] hover:bg-[#edf5f0]"
          }`}
        >
          {t.summaryTab}
        </button>
        <button
          onClick={() => setActiveSectionView("mcqs")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSectionView === "mcqs"
              ? "bg-[#015b30] text-white shadow-xs"
              : "text-[#516d5e] hover:text-[#015b30] hover:bg-[#edf5f0]"
          }`}
        >
          {t.mcqReviewTab}
        </button>
        <button
          onClick={() => setActiveSectionView("subjective")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSectionView === "subjective"
              ? "bg-[#015b30] text-white shadow-xs"
              : "text-[#516d5e] hover:text-[#015b30] hover:bg-[#edf5f0]"
          }`}
        >
          {t.subjectiveTab}
        </button>
      </div>

      {/* View Content */}
      <div className="space-y-6">
        {/* SUMMARY VIEW */}
        {activeSectionView === "summary" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* AI Evaluator Summary Card */}
            <div className="bq-card bg-white p-6 rounded-2xl border border-[#d4e7dc] space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#edf5f0] pb-3">
                <h3 className="text-base font-bold text-[#015b30] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#008b74]" />
                  <span>{t.aiSummaryTitle}</span>
                </h3>
                <span className="text-[11px] font-bold text-[#008b74] px-2.5 py-0.5 rounded-full bg-[#edf5f0] border border-[#a3cbb5]">
                  {result.modelUsed}
                </span>
              </div>

              <p className="text-sm text-[#0d2317] leading-relaxed italic bg-[#f4f8f5] p-4 rounded-xl border border-[#d4e7dc]">
                &ldquo;{result.generalFeedback.summary}&rdquo;
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-[#edf5f0] border border-[#a3cbb5] space-y-2">
                  <h4 className="text-xs font-bold text-[#015b30] flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-[#008b74]" />
                    <span>{t.keyStrengths}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#0d2317]">
                    {result.generalFeedback.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#008b74] font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>{t.areasToImprove}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#0d2317]">
                    {result.generalFeedback.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MCQs REVIEW */}
        {activeSectionView === "mcqs" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {result.mcqResults.map((mcq, idx) => {
              const questionObj = (language === "ur" ? MCQ_QUESTIONS_UR : MCQ_QUESTIONS).find((m) => m.id === mcq.id);
              return (
                <div 
                  key={mcq.id}
                  className={`p-4 rounded-xl bq-card bg-white border ${
                    mcq.isCorrect ? "border-[#d4e7dc]" : "border-red-200 bg-red-50/20"
                  } shadow-xs space-y-2`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xs font-bold text-[#516d5e] w-6 pt-0.5">
                        Q{idx + 1}
                      </span>
                      <p className={`text-xs font-semibold text-[#0d2317] ${language === "ur" ? "font-nastaliq" : ""}`}>
                        {questionObj?.question || `Question ${mcq.id}`}
                      </p>
                    </div>
                    {mcq.isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#edf5f0] text-[#015b30] border border-[#a3cbb5] text-[10px] font-bold flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-[#008b74]" /> {language === "ur" ? "درست (1 نمبر)" : "Correct (1 Mk)"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold flex-shrink-0">
                        <XCircle className="w-3 h-3 text-red-600" /> {language === "ur" ? "غلط (0 نمبر)" : "Incorrect (0 Mks)"}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] space-y-1 pl-8">
                    <p className="text-[#516d5e]">
                      {language === "ur" ? "آپ کا منتخب کردہ جواب" : "Your Selected Option"}: <strong className={mcq.isCorrect ? "text-[#015b30]" : "text-red-700"}>({mcq.studentAnswer || (language === "ur" ? "حل نہیں کیا" : "Not Answered")})</strong> • {language === "ur" ? "درست جواب" : "Correct Key"}: <strong className="text-[#015b30]">({mcq.correctAnswer})</strong>
                    </p>
                    <p className="text-[#516d5e] italic bg-[#f4f8f5] p-2 rounded-lg border border-[#d4e7dc]">
                      {language === "ur" ? "وضاحت" : "Explanation"}: {questionObj?.explanation || mcq.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SUBJECTIVE QUESTIONS FEEDBACK */}
        {activeSectionView === "subjective" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bq-card bg-white p-6 rounded-2xl border border-[#d4e7dc] space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-[#015b30] border-b border-[#edf5f0] pb-3">
                Subjective Questions AI Assessment &amp; Marks Breakdown
              </h3>

              <div className="space-y-3">
                {Object.entries(result.subjectiveFeedback).map(([qKey, fb]) => (
                  <div 
                    key={qKey}
                    className="border border-[#d4e7dc] rounded-xl overflow-hidden bg-[#fafdfb]"
                  >
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
                          {fb.marksAwarded} / {fb.maxMarks} {language === "ur" ? "نمبر" : "Marks"}
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
                        <p className="text-[#516d5e] font-semibold">{language === "ur" ? "ممتحن کا تبصرہ:" : "Examiner Note:"}</p>
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
          <span>{t.retake}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#015b30]/30 bg-white hover:bg-[#edf5f0] text-xs text-[#015b30] transition-all font-bold cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printResult}</span>
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
                  <span>{t.viewMarksheet}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#008b74]" />
                  <span>{language === "ur" ? "امتحانی پورٹل" : "Examiner Portal"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
