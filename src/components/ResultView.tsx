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
  TrendingUp, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  Lock,
  ShieldCheck,
  BookOpen,
  Sparkles,
  FileCheck
} from "lucide-react";

interface ResultViewProps {
  result: AssessmentResult;
  onRetake?: () => void; // Deprecated - Retakes prohibited
  onViewMarksheet?: () => void;
  isExaminer?: boolean;
  language?: Language;
}

export default function ResultView({ 
  result, 
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
      
      {/* =========================================================================
          SCREEN-ONLY VIEW: Interactive UI for Browser Exploration
          ========================================================================= */}
      <div className="screen-only space-y-8">
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
        <div className="no-print flex items-center gap-2 border-b border-[#d4e7dc] pb-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths Card */}
                <div className="p-6 rounded-2xl bq-card bg-white border border-[#d4e7dc] space-y-4">
                  <div className="flex items-center gap-2.5 text-[#015b30] font-bold text-sm">
                    <TrendingUp className="w-4 h-4 text-[#7cb342]" />
                    <h3>{t.keyStrengths}</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#0d2317]">
                    {result.generalFeedback?.strengths?.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-[#edf5f0] p-2.5 rounded-xl border border-[#d4e7dc]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#015b30] mt-0.5 flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    )) || (
                      <li className="text-[#516d5e] italic">{language === "ur" ? "کوئی خاص تبصرہ نہیں" : "No specific remarks recorded."}</li>
                    )}
                  </ul>
                </div>

                {/* Improvements Card */}
                <div className="p-6 rounded-2xl bq-card bg-white border border-[#d4e7dc] space-y-4">
                  <div className="flex items-center gap-2.5 text-amber-800 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <h3>{t.recommendations}</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#0d2317]">
                    {result.generalFeedback?.improvements?.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        <span>{imp}</span>
                      </li>
                    )) || (
                      <li className="text-[#516d5e] italic">{language === "ur" ? "کوئی منفی تبصرہ نہیں" : "Keep up the excellent learning progress!"}</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* General Feedback Box */}
              {result.generalFeedback?.summary && (
                <div className="p-6 rounded-2xl bq-banner-subtle border border-[#c8e0d2] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#015b30] flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#008b74]" />
                    {t.generalSummary}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#0d2317] leading-relaxed">
                    {result.generalFeedback.summary}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* MCQS VIEW */}
          {activeSectionView === "mcqs" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-white border border-[#d4e7dc] flex items-center justify-between text-xs">
                <span className="font-bold text-[#015b30]">
                  {language === "ur" ? "سیکشن A: تفصیلی جائزہ (20 سوالات)" : "Section A Review: 20 Objective Questions"}
                </span>
                <span className="font-mono font-bold text-[#008b74]">
                  {result.sectionScores.sectionA} / 20 {language === "ur" ? "درست" : "Correct"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {result.mcqResults?.map((mcq, idx) => {
                  const questionsList = language === "ur" ? MCQ_QUESTIONS_UR : MCQ_QUESTIONS;
                  const questionObj = questionsList.find((q) => q.id === mcq.id) || questionsList[idx];

                  return (
                    <div 
                      key={mcq.id}
                      className={`p-4 rounded-xl border transition-all ${
                        mcq.isCorrect 
                          ? "bg-white border-[#d4e7dc] hover:border-[#7cb342]" 
                          : "bg-red-50/40 border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <p className={`text-xs font-bold ${mcq.isCorrect ? "text-[#0d2317]" : "text-red-900"} ${language === "ur" ? "font-nastaliq" : ""}`}>
                            {idx + 1}. {questionObj?.question}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-[#f4f8f5] border border-[#d4e7dc] text-[#516d5e]">
                              {t.yourAns}: <strong className="text-[#0d2317] uppercase">{mcq.studentAnswer || (language === "ur" ? "خالی" : "Unanswered")}</strong>
                            </span>
                            {!mcq.isCorrect && (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[#015b30] font-bold">
                                {t.correctAns}: <strong className="uppercase">{mcq.correctAnswer}</strong>
                              </span>
                            )}
                          </div>
                          {questionObj?.explanation && (
                            <p className="text-[11px] text-[#516d5e] pt-1 italic">
                              💡 {questionObj.explanation}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 mt-1">
                          {mcq.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-[#015b30]" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUBJECTIVE QUESTIONS VIEW */}
          {activeSectionView === "subjective" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-white border border-[#d4e7dc] flex items-center justify-between text-xs">
                <span className="font-bold text-[#015b30]">
                  {language === "ur" ? "سیکشن B، C، D: تشریحی اور پروجیکٹ سوالات کا تفصیلی جائزہ" : "Sections B, C, D: Subjective & Project Detailed Rubric Feedback"}
                </span>
                <span className="text-[11px] text-[#516d5e]">
                  {Object.keys(result.subjectiveFeedback || {}).length} {language === "ur" ? "سوالات" : "Questions Graded"}
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(result.subjectiveFeedback || {}).map(([qKey, fb]) => (
                  <div 
                    key={qKey}
                    className="rounded-xl border border-[#d4e7dc] bg-white overflow-hidden shadow-2xs"
                  >
                    <div 
                      onClick={() => toggleQuestion(qKey)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#edf5f0]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#008b74]" />
                        <span className="text-xs font-bold text-[#0d2317] uppercase tracking-wide">
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
                        <p className="text-[#516d5e] font-semibold">{language === "ur" ? "انسٹرکٹر کا تبصرہ:" : "Instructor Note:"}</p>
                        <p className="italic bg-[#f4f8f5] p-2 rounded-lg border border-[#d4e7dc]">{fb.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer (Screen View) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#d4e7dc]">
          {/* Strictly Enforced Single Attempt Status */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#edf5f0] border border-[#a3cbb5] text-xs text-[#015b30] font-bold">
            <Lock className="w-3.5 h-3.5 text-[#008b74]" />
            <span>
              {language === "ur" 
                ? "امتحانی پرچہ مقفل ہے • دوبارہ امتحان دینے کی اجازت نہیں ہے" 
                : "Submission Locked • Single Attempt Policy Enforced"}
            </span>
          </div>

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
                    <span>{language === "ur" ? "انسٹرکٹر پورٹل" : "Instructor Portal"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRINT-ONLY VIEW: Official A4 Marksheet & Assessment Certificate
          Renders exclusively during window.print() with high contrast & exact margins
          ========================================================================= */}
      <div className="print-only bq-print-card space-y-6">
        {/* Certificate Header */}
        <div className="border-b-2 border-[#015b30] pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/bano-qabil.png"
              alt="Bano Qabil Official Logo"
              width={75}
              height={75}
              className="object-contain"
              priority
            />
            <div>
              <h2 className="text-lg font-bold text-[#015b30] uppercase tracking-wide">
                AL-KHIDMAT BANO QABIL 2.0
              </h2>
              <p className="text-xs font-bold text-[#008b74]">
                Directorate of Education & Artificial Intelligence Training
              </p>
              <p className="text-[10pt] text-[#0d2317] font-semibold mt-0.5">
                Official Midterm Examination Marksheet & Certificate of Assessment
              </p>
              <p className="text-[9pt] text-[#516d5e]">
                Course: Essentials of AI • Session: Midterm 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pl-4 border-l border-[#d4e7dc] text-right">
            <div>
              <span className="text-[8pt] uppercase font-bold text-[#008b74] block">Patron-in-Chief</span>
              <strong className="text-[10pt] text-[#015b30] block">Hafiz Naeem ur Rehman</strong>
              <span className="text-[8pt] text-[#516d5e] block font-nastaliq">الخدمت بنو قابل پاکستان</span>
            </div>
            <Image
              src="/hafiz.png"
              alt="Hafiz Naeem ur Rehman"
              width={60}
              height={60}
              className="object-cover rounded-xl border border-[#015b30]"
              priority
            />
          </div>
        </div>

        {/* Candidate Information Box */}
        <div className="grid grid-cols-2 gap-3 text-[10pt] p-3 rounded-lg bg-[#f4f8f5] border border-[#d4e7dc]">
          <div>
            <p><strong>Candidate Name:</strong> {result.student.name}</p>
            <p><strong>Roll Number:</strong> {result.student.rollNumber}</p>
            <p><strong>Batch / Section:</strong> {result.student.section}</p>
          </div>
          <div className="text-right">
            <p><strong>Candidate Email:</strong> {result.student.email}</p>
            <p><strong>Submission Date:</strong> {result.submittedAt}</p>
            <p><strong>Exam Duration:</strong> {formatSeconds(result.timeSpentSeconds)}</p>
          </div>
        </div>

        {/* Grand Score Display Box */}
        <div className="p-4 rounded-xl border-2 border-[#015b30] bg-[#edf5f0] flex items-center justify-around text-center">
          <div>
            <span className="text-[9pt] uppercase tracking-wider font-bold text-[#516d5e] block">Total Marks</span>
            <span className="text-3xl font-extrabold text-[#015b30] font-mono">{result.totalScore} / 100</span>
          </div>
          <div className="h-10 w-px bg-[#a3cbb5]" />
          <div>
            <span className="text-[9pt] uppercase tracking-wider font-bold text-[#516d5e] block">Percentage</span>
            <span className="text-3xl font-extrabold text-[#008b74] font-mono">{result.percentage}%</span>
          </div>
          <div className="h-10 w-px bg-[#a3cbb5]" />
          <div>
            <span className="text-[9pt] uppercase tracking-wider font-bold text-[#516d5e] block">Letter Grade</span>
            <span className="text-3xl font-extrabold text-[#015b30]">{result.grade}</span>
          </div>
          <div className="h-10 w-px bg-[#a3cbb5]" />
          <div>
            <span className="text-[9pt] uppercase tracking-wider font-bold text-[#516d5e] block">Evaluation Method</span>
            <span className="text-xs font-bold text-[#0d2317] block">
              {result.evaluatedBy === "groq-ai"
                ? "Groq AI Neural Assessment"
                : result.evaluatedBy === "gemini-ai"
                ? "Google Gemini AI Neural Assessment"
                : result.evaluatedBy === "openrouter-ai"
                ? "OpenRouter AI Neural Assessment"
                : "Standard Rubric Assessment"}
            </span>
            <span className="text-[8pt] text-[#516d5e]">{result.modelUsed}</span>
          </div>
        </div>

        {/* Section Marks Breakdown Table */}
        <div className="space-y-2 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#015b30]">
            Complete Section-by-Section Marks Breakdown
          </h3>
          <table className="w-full text-left text-[9pt] bq-print-table border-collapse">
            <thead>
              <tr>
                <th className="w-20">Section</th>
                <th>Topic & Assessment Area</th>
                <th className="w-28 text-center">Maximum Marks</th>
                <th className="w-28 text-center">Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Section A</td>
                <td>20 Objective Multiple Choice Questions (AI Fundamentals & Concepts)</td>
                <td className="text-center font-mono">20.0</td>
                <td className="text-center font-mono font-bold text-[#015b30]">{result.sectionScores.sectionA}</td>
              </tr>
              <tr>
                <td className="font-bold">Section B</td>
                <td>Short Questions: Supervised vs Unsupervised, Easypaisa/Daraz, Fixing Overfitting</td>
                <td className="text-center font-mono">10.0</td>
                <td className="text-center font-mono font-bold text-[#015b30]">{result.sectionScores.sectionB}</td>
              </tr>
              <tr>
                <td className="font-bold">Section C</td>
                <td>Long Scenario: Voice AI Pipeline (STT/LLM/TTS), Sarcasm & Slang, Hospital Stranger Ethics</td>
                <td className="text-center font-mono">20.0</td>
                <td className="text-center font-mono font-bold text-[#015b30]">{result.sectionScores.sectionC}</td>
              </tr>
              <tr>
                <td className="font-bold">Section D</td>
                <td>Practical Project: Smart Canteen AI (Vision Classes, Spreadsheet, Cleaning, Prompt, Card)</td>
                <td className="text-center font-mono">50.0</td>
                <td className="text-center font-mono font-bold text-[#015b30]">{result.sectionScores.sectionD}</td>
              </tr>
              <tr className="bg-[#edf5f0] font-bold text-[#015b30]">
                <td colSpan={2} className="text-right pr-4 uppercase">Grand Cumulative Total</td>
                <td className="text-center font-mono">100.0</td>
                <td className="text-center font-mono text-base">{result.totalScore}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Instructor Feedback & Performance Summary */}
        <div className="space-y-2 text-[9pt] print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#015b30]">
            Instructor Observations & Academic Feedback
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-[#d4e7dc] bg-[#f4f8f5]">
              <p className="font-bold text-[#015b30] mb-1">Key Strengths Demonstrated:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[#0d2317]">
                {result.generalFeedback?.strengths?.map((str, i) => (
                  <li key={i}>{str}</li>
                )) || <li>Solid core understanding of AI algorithms.</li>}
              </ul>
            </div>
            <div className="p-3 rounded-lg border border-[#d4e7dc] bg-[#f4f8f5]">
              <p className="font-bold text-amber-800 mb-1">Recommendations for Growth:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[#0d2317]">
                {result.generalFeedback?.improvements?.map((imp, i) => (
                  <li key={i}>{imp}</li>
                )) || <li>Continue refining prompt recipes and edge-case handling.</li>}
              </ul>
            </div>
          </div>
          {result.generalFeedback?.summary && (
            <p className="p-2.5 rounded-lg border border-[#c8e0d2] bg-white italic text-[#0d2317]">
              <strong>Performance Summary:</strong> {result.generalFeedback.summary}
            </p>
          )}
        </div>

        {/* Verification Signatures & Official Seal */}
        <div className="pt-6 border-t-2 border-[#d4e7dc] grid grid-cols-3 gap-6 text-center text-[8pt] print-avoid-break">
          <div>
            <div className="border-b border-[#0d2317] h-10 mb-1" />
            <p className="font-bold text-[#0d2317]">Candidate Signature</p>
            <p className="text-[#516d5e]">Verification Date: {new Date().toLocaleDateString("en-PK")}</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-[#015b30] flex items-center justify-center text-[7pt] font-bold text-[#015b30] uppercase text-center p-1">
              Bano Qabil AI Exam Seal
            </div>
            <span className="text-[7pt] text-[#516d5e] mt-1 font-mono">ID: {result.id}</span>
          </div>

          <div>
            <div className="border-b border-[#0d2317] h-10 mb-1 flex items-end justify-center pb-1">
              <span className="italic text-xs text-[#015b30] font-bold">Musharraf Aziz (io@maziz.me)</span>
            </div>
            <p className="font-bold text-[#0d2317]">{language === "ur" ? "مشرف عزیز" : "Musharraf Aziz"}</p>
            <p className="text-[#015b30] font-semibold text-[7.5pt]">{language === "ur" ? "انسٹرکٹر \"اپلائیڈ اے آئی\"، بنو قابل قصور" : "Instructor of \"Applied AI\", Bano Qabil Kasur"}</p>
          </div>
        </div>

        <p className="text-[7.5pt] text-center text-[#516d5e] pt-2">
          This document is an electronically verified examination marksheet issued by Alkhidmat Bano Qabil AI Portal. Verified by Musharraf Aziz, Instructor of &ldquo;Applied AI&rdquo; at Bano Qabil Kasur (io@maziz.me).
        </p>
      </div>

    </div>
  );
}
