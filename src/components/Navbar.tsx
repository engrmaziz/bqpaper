"use client";

import React from "react";
import Image from "next/image";
import { Clock, ShieldCheck, Lock, Award, BookOpen } from "lucide-react";

interface NavbarProps {
  currentView: "register" | "exam" | "result" | "admin";
  onNavigate: (view: "register" | "exam" | "result" | "admin") => void;
  timeRemaining?: number;
  studentName?: string;
  isExaminer?: boolean;
  onOpenExaminerLogin: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  timeRemaining,
  studentName,
  isExaminer = false,
  onOpenExaminerLogin,
}: NavbarProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isTimeCritical = timeRemaining !== undefined && timeRemaining < 600;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#d4e7dc] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate(currentView === "admin" ? "register" : currentView)}
          className="flex items-center gap-3.5 cursor-pointer group"
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
                Bano Qabil
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#008b74]/10 text-[#008b74] border border-[#008b74]/30">
                AI Lab
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7cb342]/15 text-[#4e7d1d] border border-[#7cb342]/40">
                ★ Grade 8
              </span>
            </div>
            <p className="text-xs text-[#516d5e] flex items-center gap-1.5">
              <span>Essentials of AI (BQ-009)</span>
              <span className="text-[#a3cbb5]">•</span>
              <span className="text-[#008b74] font-semibold italic">اپنی دنیا آپ پیدا کر</span>
            </p>
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
              REMAINING
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {studentName && currentView === "exam" && (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#edf5f0] border border-[#d4e7dc] text-xs text-[#516d5e]">
              <span className="w-2 h-2 rounded-full bg-[#7cb342] animate-pulse" />
              <span>Student: <strong className="text-[#0d2317]">{studentName}</strong></span>
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
              <span>{currentView === "admin" ? "Back to Exam" : "io@maziz.me (Marksheet)"}</span>
            </button>
          ) : (
            <button
              onClick={onOpenExaminerLogin}
              title="Restricted Access: Only io@maziz.me can access the full mark sheet"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#edf5f0] border border-[#d4e7dc] text-[#516d5e] hover:text-[#015b30] hover:border-[#015b30]/40 hover:bg-[#e4f0e8] transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#008b74]" />
              <span>Examiner Portal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
