"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StudentInfo } from "@/types/exam";
import { EXAM_INFO } from "@/data/examData";
import { User, Mail, Hash, BookOpen, Clock, Award, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";

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
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Official Hero Banner */}
      <div className="text-center space-y-4 mb-10 bq-card p-8 sm:p-10 relative overflow-hidden bg-white border border-[#d4e7dc]">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#015b30] via-[#008b74] to-[#7cb342]" />

        {/* Bano Qabil Official Logo */}
        <div className="flex justify-center mb-2">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 p-2 bg-[#f4f8f5] rounded-3xl border border-[#d4e7dc] shadow-sm flex items-center justify-center">
            <Image
              src="/bano-qabil.png"
              alt="Bano Qabil Pakistan"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#edf5f0] border border-[#a3cbb5] text-[#015b30] text-xs font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#7cb342]" />
          <span>BANO QABIL • ESSENTIALS OF AI LAB</span>
          <span className="text-[#008b74] font-semibold italic text-[11px]">| اپنی دنیا آپ پیدا کر</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#015b30]">
          {EXAM_INFO.title}
        </h1>

        <p className="text-sm sm:text-base font-semibold text-[#516d5e] max-w-2xl mx-auto">
          {EXAM_INFO.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-[#516d5e]">
          <span className="px-3 py-1 rounded-lg bg-[#edf5f0] border border-[#d4e7dc]">
            Patron: <strong className="text-[#015b30]">{EXAM_INFO.patron}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#edf5f0] border border-[#d4e7dc]">
            Instructors: <strong className="text-[#008b74]">{EXAM_INFO.instructors}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#edf5f0] border border-[#d4e7dc]">
            Target: <strong className="text-[#015b30]">{EXAM_INFO.targetGrade}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Exam Structure & Rules */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bq-card p-6 space-y-4 bg-white border border-[#d4e7dc]">
            <h3 className="text-base font-bold text-[#015b30] flex items-center gap-2 border-b border-[#edf5f0] pb-3">
              <Award className="w-5 h-5 text-[#008b74]" />
              Official Examination Pattern
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc]">
                <div>
                  <p className="font-bold text-[#0d2317]">Section A: 20 MCQs</p>
                  <p className="text-[#516d5e]">Core Concepts (Weeks 1 to 6)</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">20 Marks</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc]">
                <div>
                  <p className="font-bold text-[#0d2317]">Section B: Short Questions</p>
                  <p className="text-[#516d5e]">Supervised vs Unsupervised, Data Pillars</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">10 Marks</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc]">
                <div>
                  <p className="font-bold text-[#0d2317]">Section C: Long Question</p>
                  <p className="text-[#516d5e]">Voice Assistant Chain, Sentiment &amp; Vision Ethics</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">20 Marks</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#edf5f0] border border-[#008b74]/30 shadow-xs">
                <div>
                  <p className="font-bold text-[#008b74]">Section D: Practical Project</p>
                  <p className="text-[#516d5e]">The Smart Canteen AI (5 Milestones)</p>
                </div>
                <span className="font-bold text-[#008b74] text-sm">50 Marks</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#edf5f0] flex items-center justify-between text-xs font-bold text-[#0d2317]">
              <span className="flex items-center gap-1.5 text-[#015b30]">
                <Clock className="w-4 h-4 text-[#7cb342]" /> Total Time: 80 Minutes
              </span>
              <span className="text-[#015b30] text-sm font-extrabold">Total: 100 Marks</span>
            </div>
          </div>

          <div className="bq-card p-5 bg-[#edf5f0] border border-[#a3cbb5] text-xs text-[#516d5e] space-y-2.5">
            <p className="text-[#015b30] font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#008b74]" />
              Exam Guidelines for Grade 8
            </p>
            <ul className="space-y-1.5 text-[12px] text-[#0d2317]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7cb342] flex-shrink-0 mt-0.5" />
                <span><strong>No memorization (Ratta):</strong> All questions test real conceptual understanding.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7cb342] flex-shrink-0 mt-0.5" />
                <span><strong>Timer:</strong> 80 minutes continuous countdown with auto-submit at 00:00.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7cb342] flex-shrink-0 mt-0.5" />
                <span><strong>Instant Marking:</strong> AI grades subjective answers and produces your scorecard immediately.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7">
          <div className="bq-card p-6 sm:p-8 bg-white border border-[#a3cbb5] shadow-md">
            <div className="flex items-center gap-3 mb-6 border-b border-[#edf5f0] pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#edf5f0] border border-[#d4e7dc] flex items-center justify-center text-[#015b30] font-bold">
                <User className="w-5 h-5 text-[#015b30]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#015b30]">Student Examination Portal</h2>
                <p className="text-xs text-[#516d5e]">
                  Enter your official enrollment credentials to begin your paper.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#015b30] uppercase tracking-wider mb-1.5">
                  Full Student Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Bilal"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-medium"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#516d5e]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#015b30] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. bilal.ahmed@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-medium"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#516d5e]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#015b30] uppercase tracking-wider mb-1.5">
                    Roll Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. BQ-845"
                      value={rollNumber}
                      onChange={(e) => { setRollNumber(e.target.value); setError(""); }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-sm text-[#0d2317] placeholder-[#8ba395] focus:outline-none focus:border-[#015b30] focus:bg-white uppercase font-mono font-bold transition-all"
                    />
                    <Hash className="absolute left-3.5 top-3.5 w-4 h-4 text-[#516d5e]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#015b30] uppercase tracking-wider mb-1.5">
                    Class &amp; Section *
                  </label>
                  <div className="relative">
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-sm text-[#0d2317] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="Grade 8A">Grade 8A</option>
                      <option value="Grade 8B">Grade 8B</option>
                      <option value="Grade 8C">Grade 8C</option>
                      <option value="Grade 8D">Grade 8D</option>
                    </select>
                    <BookOpen className="absolute left-3.5 top-3.5 w-4 h-4 text-[#516d5e]" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#015b30] hover:bg-[#014223] text-white font-bold text-sm tracking-wide shadow-md active:scale-[0.99] transition-all cursor-pointer"
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
