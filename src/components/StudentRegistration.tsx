"use client";

import React, { useState } from "react";
import { StudentInfo } from "@/types/exam";
import { EXAM_INFO } from "@/data/examData";
import { User, Mail, Hash, BookOpen, Clock, Award, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

interface StudentRegistrationProps {
  onStartExam: (student: StudentInfo) => void;
}

export default function StudentRegistration({ onStartExam }: StudentRegistrationProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [section, setSection] = useState("Grade 8A");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!rollNumber.trim()) {
      setError("Please enter your roll number.");
      return;
    }

    const student: StudentInfo = {
      id: `std_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      rollNumber: rollNumber.trim().toUpperCase(),
      section,
      startTime: Date.now(),
    };

    onStartExam(student);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Banner */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] text-xs font-semibold tracking-wide cyan-glow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-POWERED AUTOMATED ASSESSMENT PLATFORM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#e8eef7]">
          {EXAM_INFO.title}
        </h1>
        <p className="text-base sm:text-lg font-medium text-[#8ba0b5]">
          {EXAM_INFO.subtitle} • Patron: <span className="text-[#e8b86d]">{EXAM_INFO.patron}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Exam Structure & Rules */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-[#1a2744] space-y-4">
            <h3 className="text-base font-bold text-[#e8eef7] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#00d4ff]" />
              Exam Structure & Blueprint
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#050a14] border border-[#1a2744]">
                <div>
                  <p className="font-semibold text-[#e8eef7]">Section A: 20 MCQs</p>
                  <p className="text-[#8ba0b5]">Core Concepts (Weeks 1-6)</p>
                </div>
                <span className="font-bold text-[#00d4ff] text-sm">20 Marks</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#050a14] border border-[#1a2744]">
                <div>
                  <p className="font-semibold text-[#e8eef7]">Section B: Short Questions</p>
                  <p className="text-[#8ba0b5]">Supervised vs Unsupervised, Data</p>
                </div>
                <span className="font-bold text-[#00d4ff] text-sm">10 Marks</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#050a14] border border-[#1a2744]">
                <div>
                  <p className="font-semibold text-[#e8eef7]">Section C: Long Question</p>
                  <p className="text-[#8ba0b5]">Voice Assistants, Sentiment, Ethics</p>
                </div>
                <span className="font-bold text-[#00d4ff] text-sm">20 Marks</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#050a14] border border-[#00d4ff]/30 cyan-glow">
                <div>
                  <p className="font-semibold text-[#7df9ff]">Section D: Practical Project</p>
                  <p className="text-[#8ba0b5]">Smart Canteen AI (5 Milestones)</p>
                </div>
                <span className="font-bold text-[#7df9ff] text-sm">50 Marks</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1a2744] flex items-center justify-between text-xs text-[#8ba0b5]">
              <span className="flex items-center gap-1.5 text-[#e8b86d] font-semibold">
                <Clock className="w-4 h-4" /> 80 Minutes Paced
              </span>
              <span className="font-bold text-[#e8eef7]">Total: 100 Marks</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a1224] border border-[#1a2744] text-xs text-[#8ba0b5] space-y-2">
            <p className="text-[#e8eef7] font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#e8b86d]" />
              Exam Guidelines for Grade 8
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#8ba0b5]">
              <li>Purely conceptual based — no memorization (*ratta*) required.</li>
              <li>Timer runs continuously (1 hr 20 min). Paper auto-submits at 00:00.</li>
              <li>Groq AI automatically grades subjective questions and calculates marks instantly.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#00d4ff]/30 cyan-glow bg-[#0a1224]/95">
            <div className="space-y-1 mb-6">
              <h2 className="text-xl font-bold text-[#e8eef7]">Student Portal Sign-In</h2>
              <p className="text-xs text-[#8ba0b5]">
                Enter your details to generate your unique examination paper and marksheet entry.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8ba0b5] uppercase tracking-wider mb-1.5">
                  Full Student Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Bilal"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050a14] border border-[#1a2744] text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                  />
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[#41536b]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8ba0b5] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. bilal.ahmed@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050a14] border border-[#1a2744] text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
                  />
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#41536b]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8ba0b5] uppercase tracking-wider mb-1.5">
                    Roll Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. BQ-845"
                      value={rollNumber}
                      onChange={(e) => { setRollNumber(e.target.value); setError(""); }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050a14] border border-[#1a2744] text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] uppercase font-mono transition-all"
                    />
                    <Hash className="absolute left-3.5 top-3 w-4 h-4 text-[#41536b]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8ba0b5] uppercase tracking-wider mb-1.5">
                    Class & Section *
                  </label>
                  <div className="relative">
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050a14] border border-[#1a2744] text-sm text-[#e8eef7] focus:outline-none focus:border-[#00d4ff] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Grade 8A">Grade 8A</option>
                      <option value="Grade 8B">Grade 8B</option>
                      <option value="Grade 8C">Grade 8C</option>
                      <option value="Grade 8D">Grade 8D</option>
                    </select>
                    <BookOpen className="absolute left-3.5 top-3 w-4 h-4 text-[#41536b]" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0e8f86] text-[#050a14] font-bold text-sm tracking-wide hover:brightness-110 active:scale-[0.99] transition-all cyan-glow cursor-pointer"
                >
                  <span>Begin Midterm Examination (80 Mins)</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
