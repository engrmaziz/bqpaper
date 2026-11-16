"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StudentInfo } from "@/types/exam";
import { EXAM_INFO } from "@/data/examData";
import { EXAM_INFO_UR } from "@/data/examDataUrdu";
import { Language, TRANSLATIONS } from "@/data/translations";
import { User, Mail, Hash, BookOpen, Clock, Award, ShieldAlert, ArrowRight, CheckCircle2, Sparkles, Quote } from "lucide-react";

interface StudentRegistrationProps {
  onStartExam: (student: StudentInfo) => void;
  language?: Language;
}

export default function StudentRegistration({ onStartExam, language = "en" }: StudentRegistrationProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [section, setSection] = useState("Batch A");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const t = TRANSLATIONS[language].registration;
  const examInfo = language === "ur" ? EXAM_INFO_UR : EXAM_INFO;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(language === "ur" ? "برائے مہربانی اپنا مکمل نام درج کریں۔" : "Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError(language === "ur" ? "برائے مہربانی درست ای میل ایڈریس درج کریں۔" : "Please enter a valid email address.");
      return;
    }
    if (!rollNumber.trim()) {
      setError(language === "ur" ? "برائے مہربانی اپنا رول نمبر درج کریں۔" : "Please enter your roll number.");
      return;
    }

    const normRoll = rollNumber.trim().toUpperCase();
    const normEmail = email.trim().toLowerCase();

    // 1. Client-side LocalStorage Check (Single Attempt Rule)
    try {
      if (localStorage.getItem(`bq_completed_${normRoll}`) === "true") {
        setError(
          language === "ur"
            ? `امتحانی ریکارڈ: رول نمبر ${normRoll} کا پرچہ پہلے ہی اس براؤزر پر جمع ہو چکا ہے۔ دوبارہ پرچہ دینے کی اجازت نہیں ہے۔`
            : `Examination Record: Roll Number ${normRoll} has already submitted their paper. Single attempt policy strictly enforced.`
        );
        return;
      }
    } catch {}

    // 2. Server-side Supabase Database Check
    setIsChecking(true);
    setError("");
    try {
      const res = await fetch(
        `/api/submissions/check?rollNumber=${encodeURIComponent(normRoll)}&email=${encodeURIComponent(normEmail)}`
      );
      if (res.ok) {
        const checkData = await res.json();
        if (checkData.exists) {
          setError(
            language === "ur"
              ? `امتحانی ریکارڈ: رول نمبر ${normRoll} کا پرچہ پہلے ہی ${checkData.submittedAt || "جمع"} ہو چکا ہے۔ بنو قابل قواعد کے مطابق دوبارہ امتحان دینے کی اجازت نہیں ہے۔`
              : `Examination Record: Roll Number ${normRoll} already submitted their exam on ${checkData.submittedAt || "earlier"}. Multiple attempts are prohibited.`
          );
          setIsChecking(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Pre-submission verification check bypassed:", err);
    } finally {
      setIsChecking(false);
    }

    const student: StudentInfo = {
      id: `std_${Date.now()}`,
      name: name.trim(),
      email: normEmail,
      rollNumber: normRoll,
      section,
      startTime: Date.now(),
    };

    onStartExam(student);
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 py-8 sm:py-12 ${language === "ur" ? "rtl text-right" : ""}`}>
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
              {language === "ur" ? "بنو قابل پاکستان" : "Bano Qabil Pakistan"}
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
              {language === "ur" ? "حافظ نعیم الرحمن" : "Hafiz Naeem ur Rehman"}
            </span>
            <span className="text-[10px] text-[#008b74] font-semibold block uppercase tracking-wider">
              {language === "ur" ? "سرپرستِ اعلیٰ" : "Patron-in-Chief"}
            </span>
          </div>
        </div>

        {/* Vision Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#edf5f0] border border-[#a3cbb5] text-[#015b30] text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#c29b38]" />
          <span>{t.underPatronage}</span>
          <span className="text-[#008b74] font-semibold font-nastaliq text-xs hidden md:inline">| اپنی دنیا آپ پیدا کر</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#015b30]">
          {examInfo.title}
        </h1>

        <p className="text-sm sm:text-base font-semibold text-[#516d5e] max-w-2xl mx-auto">
          {examInfo.subtitle}
        </p>

        {/* Inspiring Patron Quote Card */}
        <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-[#edf5f0]/90 border border-[#c8e0d2] text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[#015b30] font-bold text-xs">
            <Quote className="w-3.5 h-3.5 text-[#008b74]" />
            <span>{t.patronMessageTitle}</span>
          </div>
          <p className="text-sm sm:text-base text-[#014223] font-nastaliq leading-loose font-bold">
            &ldquo;{t.patronQuote}&rdquo;
          </p>
          <p className="text-xs text-[#516d5e]">
            — <strong className="font-nastaliq text-sm text-[#015b30]">{t.patronQuoteAuthor}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-[#516d5e]">
          <span className="px-3 py-1 rounded-lg bg-[#edf5f0] border border-[#d4e7dc]">
            {language === "ur" ? "سرپرستِ اعلیٰ" : "Patron-in-Chief"}: <strong className="text-[#015b30]">{examInfo.patron}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#edf5f0] border border-[#d4e7dc]">
            {language === "ur" ? "اساتذہ" : "Instructors"}: <strong className="text-[#008b74]">{examInfo.instructors}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#edf5f0] border border-[#d4e7dc]">
            {language === "ur" ? "کورس کوڈ" : "Course"}: <strong className="text-[#015b30]">{examInfo.courseCode}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Exam Structure & Rules */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bq-card p-6 space-y-4 bg-white border border-[#d4e7dc]">
            <h3 className="text-base font-bold text-[#015b30] flex items-center gap-2 border-b border-[#edf5f0] pb-3">
              <Award className="w-5 h-5 text-[#008b74]" />
              {t.examPattern}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc]">
                <div>
                  <p className="font-bold text-[#0d2317]">{t.secA}</p>
                  <p className="text-[#516d5e]">{t.secASub}</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">20 {language === "ur" ? "نمبر" : "Marks"}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc]">
                <div>
                  <p className="font-bold text-[#0d2317]">{t.secB}</p>
                  <p className="text-[#516d5e]">{t.secBSub}</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">10 {language === "ur" ? "نمبر" : "Marks"}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc]">
                <div>
                  <p className="font-bold text-[#0d2317]">{t.secC}</p>
                  <p className="text-[#516d5e]">{t.secCSub}</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">20 {language === "ur" ? "نمبر" : "Marks"}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#edf5f0] border border-[#a3cbb5]">
                <div>
                  <p className="font-bold text-[#015b30]">{t.secD}</p>
                  <p className="text-[#516d5e]">{t.secDSub}</p>
                </div>
                <span className="font-bold text-[#015b30] text-sm">50 {language === "ur" ? "نمبر" : "Marks"}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#edf5f0] flex items-center justify-between text-xs text-[#516d5e]">
              <span className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-4 h-4 text-[#008b74]" /> {t.timeAllowed}
              </span>
              <span className="font-bold text-[#015b30]">{t.totalMarks}</span>
            </div>
          </div>

          <div className="bq-card p-6 space-y-3 bg-[#edf5f0] border border-[#a3cbb5]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#015b30] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#008b74]" />
              {t.aiAssessingTitle}
            </h4>
            <p className="text-xs text-[#516d5e] leading-relaxed">
              {t.aiAssessingDesc}
            </p>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7">
          <div className="bq-card p-6 sm:p-8 space-y-6 bg-white border border-[#d4e7dc] shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#015b30]">{t.candidateVerif}</h3>
                <span className="text-[11px] font-bold text-[#008b74] px-2.5 py-0.5 rounded-full bg-[#edf5f0] border border-[#d4e7dc]">
                  2026
                </span>
              </div>
              <p className="text-xs text-[#516d5e] mt-1">
                {t.candidateSub}
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
                  {t.fullNameLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#7d9b89] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-sans"
                  />
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#7d9b89]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d2317] mb-1.5">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#7d9b89] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-sans"
                  />
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-[#7d9b89]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0d2317] mb-1.5">
                    {t.rollNoLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder={t.rollNoPlaceholder}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] placeholder-[#7d9b89] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-mono"
                    />
                    <Hash className="absolute left-3 top-3 w-4 h-4 text-[#7d9b89]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0d2317] mb-1.5">
                    {t.batchLabel}
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-sans"
                  >
                    <option value="Batch A">{language === "ur" ? "بیچ A (صبح کی لیب)" : "Batch A (Morning Lab)"}</option>
                    <option value="Batch B">{language === "ur" ? "بیچ B (دوپہر کی لیب)" : "Batch B (Afternoon Lab)"}</option>
                    <option value="Batch C">{language === "ur" ? "بیچ C (ویک اینڈ بیچ)" : "Batch C (Weekend Batch)"}</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  {language === "ur"
                    ? "اہم نوٹس: امتحان صرف ایک بار دیا جا سکتا ہے۔ پرچہ جمع ہونے کے بعد دوبارہ موقع نہیں ملے گا۔"
                    : "Strict Single Attempt Policy: Once submitted, the paper is locked and retakes are not allowed."}
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#015b30] hover:bg-[#014223] disabled:bg-[#516d5e] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>{isChecking ? (language === "ur" ? "تصدیق ہو رہی ہے..." : "Verifying Candidate Record...") : t.startExamBtn}</span>
                  {!isChecking && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#7cb342]" />}
                </button>
              </div>

              <p className="text-[11px] text-center text-[#516d5e] pt-1">
                {t.timerNotice}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
