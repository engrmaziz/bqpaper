"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StudentInfo } from "@/types/exam";
import { EXAM_INFO } from "@/data/examData";
import { User, Mail, Hash, BookOpen, Clock, Award, ShieldAlert, ArrowRight, CheckCircle2, Sparkles, Quote } from "lucide-react";

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
      {/* Official Hero Banner with Bano Qabil Logo & Patron Hafiz Naeem ur Rehman */}
      <div className="text-center space-y-5 mb-10 bq-card p-6 sm:p-10 relative overflow-hidden bg-white border border-[#d4e7dc]">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#015b30] via-[#008b74] to-[#7cb342]" />

        {/* Dual Portraits: Bano Qabil Official Logo + Patron Hafiz Naeem ur Rehman */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 pt-2">
          {/* Logo Card */}
          <div className="relative group text-center">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 p-2 bg-[#f4f8f5] rounded-3xl border-2 border-[#015b30]/20 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/bano-qabil.png"
                alt="Bano Qabil Pakistan"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[11px] font-bold text-[#015b30] mt-1.5 block uppercase tracking-wider">
              Bano Qabil Pakistan
            </span>
          </div>

          {/* Plus / Connector */}
          <div className="hidden sm:flex flex-col items-center">
            <span className="w-8 h-8 rounded-full bg-[#edf5f0] border border-[#a3cbb5] text-[#015b30] flex items-center justify-center text-xs font-bold">
              ★
            </span>
          </div>

          {/* Patron Hafiz Naeem ur Rehman Card */}
          <div className="relative group text-center">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 p-1 bg-[#edf5f0] rounded-3xl border-2 border-[#015b30] shadow-md flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 ring-4 ring-[#7cb342]/30">
              <Image
                src="/hafiz.png"
                alt="Patron Hafiz Naeem ur Rehman"
                width={112}
                height={112}
                className="object-cover rounded-2xl w-full h-full"
                priority
              />
            </div>
            <span className="text-[11px] font-extrabold text-[#015b30] mt-1.5 block">
              Hafiz Naeem ur Rehman
            </span>
            <span className="text-[10px] text-[#008b74] font-semibold block uppercase tracking-wider">
              Patron-in-Chief
            </span>
          </div>
        </div>

        {/* Vision Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#edf5f0] border border-[#a3cbb5] text-[#015b30] text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#c29b38]" />
          <span>UNDER THE VISIONARY PATRONAGE OF HAFIZ NAEEM UR REHMAN</span>
          <span className="text-[#008b74] font-semibold font-nastaliq text-xs hidden md:inline">| اپنی دنیا آپ پیدا کر</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#015b30]">
          {EXAM_INFO.title}
        </h1>

        <p className="text-sm sm:text-base font-semibold text-[#516d5e] max-w-2xl mx-auto">
          {EXAM_INFO.subtitle}
        </p>

        {/* Inspiring Patron Quote Card */}
        <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-[#edf5f0]/90 border border-[#c8e0d2] text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[#015b30] font-bold text-xs">
            <Quote className="w-3.5 h-3.5 text-[#008b74]" />
            <span>Patron&apos;s Message to Pakistani Youth</span>
          </div>
          <p className="text-sm sm:text-base text-[#014223] font-nastaliq leading-loose font-bold">
            &ldquo;ہماری جدوجہد ہے کہ پاکستان کا ہر باصلاحیت بیٹا اور بیٹی جدید ترین آرٹیفیشل انٹیلیجنس اور آئی ٹی کا ماہر بن کر ملک و قوم کا نام روشن کرے۔&rdquo;
          </p>
          <p className="text-xs text-[#516d5e]">
            — <strong className="font-nastaliq text-sm text-[#015b30]">حافظ نعیم الرحمن</strong> (بانی و سرپرستِ اعلیٰ، بنو قابل تحریک)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-[#516d5e]">
          <span className="px-3 py-1 rounded-lg bg-[#edf5f0] border border-[#d4e7dc]">
            Patron-in-Chief: <strong className="text-[#015b30]">{EXAM_INFO.patron}</strong>
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
                  <p className="text-[#516d5e]">2 Conceptual Problems (5 mks each)</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">10 Marks</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc]">
                <div>
                  <p className="font-bold text-[#0d2317]">Section C: Long Scenario Q</p>
                  <p className="text-[#516d5e]">Voice Assistant &amp; Ethics</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">20 Marks</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#edf5f0] border border-[#a3cbb5]">
                <div>
                  <p className="font-bold text-[#015b30]">Section D: Practical Project</p>
                  <p className="text-[#516d5e]">Karachi Traffic Vision (5 Milestones)</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">50 Marks</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#edf5f0] flex items-center justify-between text-xs text-[#516d5e]">
              <span className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-4 h-4 text-[#008b74]" /> 80 Minutes
              </span>
              <span className="font-bold text-[#015b30]">Total: 100 Marks</span>
            </div>
          </div>

          <div className="bq-card p-6 space-y-3 bg-[#edf5f0] border border-[#a3cbb5]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#015b30] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#008b74]" />
              Automated Groq AI Assessment
            </h4>
            <p className="text-xs text-[#516d5e] leading-relaxed">
              Upon submission, your subjective responses and practical design will be automatically evaluated in seconds against the official Bano Qabil syllabus rubric.
            </p>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7">
          <div className="bq-card p-6 sm:p-8 space-y-6 bg-white border border-[#d4e7dc] shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#015b30]">Student Candidate Verification</h3>
                <span className="text-[11px] font-bold text-[#008b74] px-2.5 py-0.5 rounded-full bg-[#edf5f0] border border-[#d4e7dc]">
                  Midterm 2026
                </span>
              </div>
              <p className="text-xs text-[#516d5e] mt-1">
                Please enter your registered Bano Qabil student credentials to begin the exam.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0d2317] mb-1.5">
                  Full Name (as registered in Bano Qabil)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Muhammad Bilal"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#7d9b89] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-sans"
                  />
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#7d9b89]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d2317] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@banoqabil.pk"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#7d9b89] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-sans"
                  />
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-[#7d9b89]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0d2317] mb-1.5">
                    Roll Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="e.g. BQ-801"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#7d9b89] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-mono"
                    />
                    <Hash className="absolute left-3 top-3 w-4 h-4 text-[#7d9b89]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0d2317] mb-1.5">
                    Batch / Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-sans"
                  >
                    <option value="Grade 8A">Grade 8A (Morning Lab)</option>
                    <option value="Grade 8B">Grade 8B (Afternoon Lab)</option>
                    <option value="Grade 8C">Grade 8C (Weekend Batch)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#015b30] hover:bg-[#014223] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Start Midterm Examination</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#7cb342]" />
                </button>
              </div>

              <p className="text-[11px] text-center text-[#516d5e] pt-1">
                By starting, the 80-minute timer will activate automatically. Powered by Bano Qabil AI Lab.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
