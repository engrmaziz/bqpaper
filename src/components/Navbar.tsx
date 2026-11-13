"use client";

import React from "react";
import Image from "next/image";
import { Clock, ShieldCheck, Lock, Award, BookOpen, Sparkles, Languages } from "lucide-react";
import { Language, TRANSLATIONS } from "@/data/translations";

interface NavbarProps {
  currentView: "register" | "exam" | "result" | "admin";
  onNavigate: (view: "register" | "exam" | "result" | "admin") => void;
  timeRemaining?: number;
  studentName?: string;
  isExaminer?: boolean;
  onOpenExaminerLogin: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  timeRemaining,
  studentName,
  isExaminer = false,
  onOpenExaminerLogin,
  language,
  onToggleLanguage,
}: NavbarProps) {
  const t = TRANSLATIONS[language].navbar;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isTimeCritical = timeRemaining !== undefined && timeRemaining < 600;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#d4e7dc] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo + Patron Hype Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            onClick={() => onNavigate(currentView === "admin" ? "register" : currentView)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/bano-qabil.png"
                alt="Bano Qabil Official Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wide text-lg sm:text-xl text-[#015b30]">
                  {t.brandTitle}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#008b74]/10 text-[#008b74] border border-[#008b74]/30">
                  {t.aiLab}
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7cb342]/15 text-[#4e7d1d] border border-[#7cb342]/40">
                  {t.grade}
                </span>
              </div>
              <p className="text-xs text-[#516d5e] flex items-center gap-1.5">
                <span>{t.course}</span>
                <span className="text-[#a3cbb5]">•</span>
                <span className="text-[#008b74] font-semibold font-nastaliq text-sm leading-none inline-block">{t.motto}</span>
              </p>
            </div>
          </div>

          {/* Patron Hafiz Naeem ur Rehman Header Pill */}
          <div className="hidden lg:flex items-center gap-2.5 pl-4 border-l border-[#d4e7dc]">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#015b30] shadow-sm flex-shrink-0 ring-2 ring-[#7cb342]/40">
              <Image
                src="/hafiz.png"
                alt="Patron Hafiz Naeem ur Rehman"
                width={40}
                height={40}
                className="object-cover"
                priority
              />
            </div>
            <div className="leading-tight">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#008b74] block">
                {t.patronTitle}
              </span>
              <strong className="text-xs text-[#015b30] font-extrabold flex items-center gap-1">
                {t.patronName}
                <Sparkles className="w-3 h-3 text-[#c29b38]" />
              </strong>
            </div>
          </div>
        </div>

        {/* Mid-Bar Timer (Only when in Exam view) */}
        {currentView === "exam" && timeRemaining !== undefined && (
          <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-sm font-bold font-mono transition-all ${
            isTimeCritical 
              ? "bg-red-50 border-red-300 text-red-600 animate-pulse shadow-sm" 
              : "bg-[#edf5f0] border-[#9eccb3] text-[#015b30] shadow-sm"
          }`}>
            <Clock className={`w-4 h-4 ${isTimeCritical ? "text-red-500" : "text-[#008b74]"}`} />
            <span>{formatTime(timeRemaining)}</span>
            <span className="text-[10px] font-sans font-semibold text-[#516d5e] hidden sm:inline uppercase">
              {t.timeRemaining}
            </span>
          </div>
        )}

        {/* Right Actions: Language Switcher & Examiner Access */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bilingual Language Switcher Toggle */}
          <button
            onClick={onToggleLanguage}
            title={language === "en" ? "اردو نستعلیق میں تبدیل کریں (Switch to Urdu)" : "Switch to English"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#015b30] bg-white hover:bg-[#edf5f0] text-[#015b30] shadow-xs transition-all cursor-pointer group"
          >
            <Languages className="w-4 h-4 text-[#008b74] group-hover:rotate-12 transition-transform" />
            <span className={language === "en" ? "font-nastaliq text-sm text-[#015b30] font-bold leading-none" : "font-serif text-xs font-bold text-[#015b30]"}>
              {language === "en" ? "اردو Nastaliq" : "English"}
            </span>
          </button>

          {studentName && currentView === "exam" && (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#edf5f0] border border-[#d4e7dc] text-xs text-[#516d5e]">
              <span className="w-2 h-2 rounded-full bg-[#7cb342] animate-pulse" />
              <span>{t.studentLabel}: <strong className="text-[#0d2317]">{studentName}</strong></span>
            </div>
          )}

          {/* Marksheet / Admin View Toggle (Role-Protected for io@maziz.me) */}
          {isExaminer ? (
            <button
              onClick={() => onNavigate(currentView === "admin" ? "register" : "admin")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === "admin"
                  ? "bg-[#015b30] text-white shadow-md hover:bg-[#014223]"
                  : "bg-[#edf5f0] border border-[#015b30]/30 text-[#015b30] hover:bg-[#e1efe6]"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#7cb342]" />
              <span>{currentView === "admin" ? t.backToExam : "io@maziz.me"}</span>
            </button>
          ) : (
            <button
              onClick={onOpenExaminerLogin}
              title="Restricted Access: Only io@maziz.me can access the full mark sheet"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#d4e7dc] hover:border-[#015b30] text-[#015b30] text-xs font-bold shadow-2xs hover:bg-[#edf5f0] transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#008b74]" />
              <span className="hidden sm:inline">{t.teacherMarksheet}</span>
              <span className="text-[10px] font-bold text-[#c29b38] bg-[#c29b38]/10 px-1.5 py-0.2 rounded">
                {t.restricted}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
