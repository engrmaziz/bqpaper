"use client";

import React from "react";
import { GraduationCap, Clock, Award, ShieldAlert, ShieldCheck, Lock } from "lucide-react";

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
    <header className="sticky top-0 z-50 glass-panel border-b border-[#1a2744] bg-[#050a14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate(currentView === "admin" ? "register" : currentView)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#0e8f86] flex items-center justify-center cyan-glow transition-transform group-hover:scale-105">
            <GraduationCap className="w-6 h-6 text-[#050a14] stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-sm sm:text-base text-[#e8eef7]">
                BANO QABIL
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30">
                AI LAB
              </span>
            </div>
            <p className="text-[11px] text-[#8ba0b5]">Essentials of AI • Midterm Evaluation</p>
          </div>
        </div>

        {/* Mid-Bar Timer (Only when in Exam view) */}
        {currentView === "exam" && timeRemaining !== undefined && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-mono font-semibold transition-all ${isTimeCritical
              ? "bg-red-500/10 border-red-500/40 text-red-400 animate-pulse"
              : "bg-[#0a1224] border-[#00d4ff]/30 text-[#00d4ff] cyan-glow"
            }`}>
            <Clock className={`w-4 h-4 ${isTimeCritical ? "text-red-400" : "text-[#00d4ff]"}`} />
            <span>{formatTime(timeRemaining)}</span>
            <span className="text-[10px] text-[#8ba0b5] hidden sm:inline">REMAINING</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {studentName && currentView === "exam" && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0a1224] border border-[#1a2744] text-xs text-[#8ba0b5]">
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-ping" />
              <span>Student: <strong className="text-[#e8eef7]">{studentName}</strong></span>
            </div>
          )}

          {/* Marksheet / Admin View Toggle (Role-Protected for io@maziz.me) */}
          {isExaminer ? (
            <button
              onClick={() => onNavigate(currentView === "admin" ? "register" : "admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${currentView === "admin"
                  ? "bg-[#00d4ff] text-[#050a14] font-bold shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                  : "bg-[#0a1224] border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10"
                }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span>{currentView === "admin" ? "Back to Exam" : "io@maziz.me (Marksheet)"}</span>
            </button>
          ) : (
            <button
              onClick={onOpenExaminerLogin}
              title="Restricted Access: Only io@maziz.me can access the full mark sheet"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0a1224] border border-[#1a2744] text-[#8ba0b5] hover:text-[#e8eef7] hover:border-[#00d4ff]/30 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#e8b86d]" />
              <span>Examiner Portal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

