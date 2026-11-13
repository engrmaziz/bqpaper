"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AssessmentResult } from "@/types/exam";
import { 
  Award, 
  Download, 
  Search, 
  RefreshCw, 
  FileSpreadsheet, 
  Eye, 
  X, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Zap,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface TeacherDashboardProps {
  onBackToExam: () => void;
  examinerToken?: string;
  onLogout?: () => void;
}

export default function TeacherDashboard({ 
  onBackToExam, 
  examinerToken = "", 
  onLogout 
}: TeacherDashboardProps) {
  const [submissions, setSubmissions] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<AssessmentResult | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        headers: {
          "Authorization": `Bearer ${examinerToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Access denied.");
      }
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err: any) {
      console.error("Failed to fetch submissions:", err);
      setError(err.message || "Unauthorized access.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [examinerToken]);

  const filtered = submissions.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.student.name.toLowerCase().includes(q) ||
      s.student.email.toLowerCase().includes(q) ||
      s.student.rollNumber.toLowerCase().includes(q) ||
      s.student.section.toLowerCase().includes(q) ||
      s.grade.toLowerCase().includes(q)
    );
  });

  // Analytics
  const totalStudents = submissions.length;
  const avgScore = totalStudents > 0 
    ? Math.round((submissions.reduce((acc, s) => acc + s.totalScore, 0) / totalStudents) * 10) / 10 
    : 0;
  const highestScore = totalStudents > 0 ? Math.max(...submissions.map(s => s.totalScore)) : 0;
  const lowestScore = totalStudents > 0 ? Math.min(...submissions.map(s => s.totalScore)) : 0;
  const passCount = submissions.filter(s => s.totalScore >= 50).length;
  const passRate = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;

  const handleDownloadCSV = () => {
    window.location.href = `/api/submissions/export?token=${encodeURIComponent(examinerToken)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Official Bano Qabil Examiner Top Banner */}
      <div className="bq-card bg-white p-6 sm:p-8 border border-[#d4e7dc] shadow-sm relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#015b30] via-[#008b74] to-[#7cb342]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[#f4f8f5] p-2 rounded-2xl border border-[#d4e7dc] flex items-center justify-center shadow-xs">
              <Image
                src="/bano-qabil.png"
                alt="Bano Qabil Official Logo"
                width={70}
                height={70}
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#015b30]/10 text-[#015b30] border border-[#015b30]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#015b30]" />
                  EXAMINER PORTAL
                </span>
                <span className="text-xs text-[#516d5e]">
                  Authorized Examiner: <strong className="text-[#015b30]">io@maziz.me</strong>
                </span>
                <span className="text-xs text-[#008b74] font-semibold italic hidden sm:inline">
                  | بنو قابل • اپنی دنیا آپ پیدا کر
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#015b30]">
                Midterm Marksheet &amp; Class Analytics
              </h1>
              <p className="text-xs text-[#516d5e]">
                Master evaluation record restricted to <span className="font-semibold text-[#015b30]">io@maziz.me</span> • Essentials of AI (BQ-009)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#d4e7dc] bg-white hover:bg-[#edf5f0] text-xs font-semibold text-[#516d5e] hover:text-[#015b30] shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#008b74] ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#015b30] hover:bg-[#014223] text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#7cb342]" />
              <span>Download Marksheet (CSV)</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Lock Examiner Portal"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-xs font-semibold text-red-700 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Lock Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p>{error}</p>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="underline font-bold ml-4 text-red-800">
              Re-authenticate as io@maziz.me
            </button>
          )}
        </div>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#516d5e] text-[11px] font-semibold uppercase">
            <span>Submissions</span>
            <Users className="w-4 h-4 text-[#008b74]" />
          </div>
          <p className="text-2xl font-bold text-[#015b30]">{totalStudents}</p>
          <span className="text-[10px] text-[#516d5e]">Registered students</span>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#516d5e] text-[11px] font-semibold uppercase">
            <span>Class Average</span>
            <TrendingUp className="w-4 h-4 text-[#015b30]" />
          </div>
          <p className="text-2xl font-bold text-[#015b30]">{avgScore}</p>
          <span className="text-[10px] text-[#516d5e]">Out of 100 marks</span>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#516d5e] text-[11px] font-semibold uppercase">
            <span>Highest Score</span>
            <Award className="w-4 h-4 text-[#c29b38]" />
          </div>
          <p className="text-2xl font-bold text-[#c29b38]">{highestScore}</p>
          <span className="text-[10px] text-[#516d5e]">Top student score</span>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-white border border-[#d4e7dc] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#516d5e] text-[11px] font-semibold uppercase">
            <span>Lowest Score</span>
            <GraduationCap className="w-4 h-4 text-[#516d5e]" />
          </div>
          <p className="text-2xl font-bold text-[#516d5e]">{lowestScore}</p>
          <span className="text-[10px] text-[#516d5e]">Minimum scored</span>
        </div>

        <div className="p-4 rounded-2xl bq-card bg-[#edf5f0] border border-[#a3cbb5] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#015b30] text-[11px] font-semibold uppercase">
            <span>Pass Rate</span>
            <Zap className="w-4 h-4 text-[#015b30]" />
          </div>
          <p className="text-2xl font-bold text-[#015b30]">{passRate}%</p>
          <span className="text-[10px] text-[#516d5e]">&gt;= 50% passing mark</span>
        </div>
      </div>

      {/* Marksheet Table Card */}
      <div className="bq-card bg-white rounded-2xl border border-[#d4e7dc] overflow-hidden space-y-4 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#edf5f0]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#edf5f0] text-[#015b30]">
              <FileSpreadsheet className="w-5 h-5 text-[#015b30]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#015b30]">Official Student Marksheet</h3>
              <p className="text-xs text-[#516d5e]">Complete record of individual question breakdowns and grades</p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name, roll no, section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs text-[#0d2317] placeholder-[#7d9b89] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-sans"
            />
            <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-[#7d9b89]" />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-[#d4e7dc] rounded-xl shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#edf5f0] border-b border-[#d4e7dc] text-[#015b30] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-3 text-center">Sec A (20)</th>
                <th className="py-3 px-3 text-center">Sec B (10)</th>
                <th className="py-3 px-3 text-center">Sec C (20)</th>
                <th className="py-3 px-3 text-center">Sec D (50)</th>
                <th className="py-3 px-4 text-center">Total (/100)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf5f0] text-[#0d2317]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-[#516d5e]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <GraduationCap className="w-8 h-8 text-[#a3cbb5]" />
                      <p className="font-semibold text-sm">No student submissions found matching your search.</p>
                      <p className="text-xs text-[#7d9b89]">Once students submit their exam, their results will appear here in real-time.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#f4f8f5] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#015b30]">{s.student.rollNumber}</td>
                    <td className="py-3.5 px-4 font-semibold">
                      <div className="text-[#0d2317]">{s.student.name}</div>
                      <span className="text-[10px] text-[#516d5e] font-sans">{s.student.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#516d5e]">{s.student.section}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-semibold">{s.sectionScores.sectionA}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-semibold">{s.sectionScores.sectionB}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-semibold">{s.sectionScores.sectionC}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-semibold">{s.sectionScores.sectionD}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-sm text-[#015b30] font-mono">{s.totalScore}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        s.grade === "A+" || s.grade === "A"
                          ? "bg-[#edf5f0] text-[#015b30] border-[#015b30]"
                          : s.grade === "B"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : s.grade === "C"
                          ? "bg-yellow-50 text-yellow-800 border-yellow-300"
                          : "bg-red-50 text-red-700 border-red-300"
                      }`}>
                        {s.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedSubmission(s)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#d4e7dc] hover:border-[#015b30] hover:bg-[#edf5f0] text-[#015b30] text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#008b74]" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Paper Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bq-card bg-white rounded-3xl border border-[#d4e7dc] shadow-2xl overflow-hidden">
            {/* Top Accent Strip */}
            <div className="h-2 bg-gradient-to-r from-[#015b30] via-[#008b74] to-[#7cb342] flex-shrink-0" />

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#d4e7dc] bg-[#f4f8f5]">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex-shrink-0 bg-white p-1 rounded-xl border border-[#d4e7dc] flex items-center justify-center">
                  <Image
                    src="/bano-qabil.png"
                    alt="Bano Qabil Official Logo"
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#015b30]">
                    Exam Inspection: {selectedSubmission.student.name}
                  </h3>
                  <p className="text-xs text-[#516d5e]">
                    Roll No: <strong className="text-[#015b30]">{selectedSubmission.student.rollNumber}</strong> • Score: <strong className="text-[#015b30]">{selectedSubmission.totalScore}/100</strong> (Grade {selectedSubmission.grade})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-xl text-[#516d5e] hover:text-[#0d2317] hover:bg-white border border-transparent hover:border-[#d4e7dc] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs bg-white">
              {/* Score breakdown pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#edf5f0] border border-[#d4e7dc]">
                  <span className="text-[#516d5e] block font-semibold text-[11px]">Sec A (MCQ)</span>
                  <span className="text-base font-bold text-[#015b30] font-mono">{selectedSubmission.sectionScores.sectionA}/20</span>
                </div>
                <div className="p-3 rounded-xl bg-[#edf5f0] border border-[#d4e7dc]">
                  <span className="text-[#516d5e] block font-semibold text-[11px]">Sec B (Short)</span>
                  <span className="text-base font-bold text-[#015b30] font-mono">{selectedSubmission.sectionScores.sectionB}/10</span>
                </div>
                <div className="p-3 rounded-xl bg-[#edf5f0] border border-[#d4e7dc]">
                  <span className="text-[#516d5e] block font-semibold text-[11px]">Sec C (Long)</span>
                  <span className="text-base font-bold text-[#015b30] font-mono">{selectedSubmission.sectionScores.sectionC}/20</span>
                </div>
                <div className="p-3 rounded-xl bg-[#edf5f0] border border-[#a3cbb5]">
                  <span className="text-[#015b30] block font-bold text-[11px]">Sec D (Project)</span>
                  <span className="text-base font-bold text-[#015b30] font-mono">{selectedSubmission.sectionScores.sectionD}/50</span>
                </div>
              </div>

              {/* General Feedback */}
              <div className="p-4 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] space-y-2">
                <h4 className="font-bold text-[#015b30] flex items-center gap-1.5 text-sm">
                  <Zap className="w-4 h-4 text-[#008b74]" /> Automated AI Evaluation Notes
                </h4>
                <p className="text-[#516d5e] leading-relaxed">
                  {selectedSubmission.generalFeedback.summary}
                </p>
              </div>

              {/* Subjective Question Feedback */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#015b30] text-sm">Subjective Question Scores &amp; Rubric Feedback</h4>
                {Object.entries(selectedSubmission.subjectiveFeedback).map(([qKey, fb]) => (
                  <div key={qKey} className="p-3.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-[#015b30] font-bold uppercase">{qKey}</span>
                      <span className="text-[#015b30] font-bold px-2 py-0.5 rounded-full bg-white border border-[#d4e7dc]">
                        {fb.marksAwarded} / {fb.maxMarks} Mks
                      </span>
                    </div>
                    <p className="text-[#516d5e] leading-relaxed">{fb.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#d4e7dc] bg-[#f4f8f5] flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-white border border-[#d4e7dc] text-[#015b30] hover:bg-[#edf5f0] transition-all cursor-pointer shadow-2xs"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
