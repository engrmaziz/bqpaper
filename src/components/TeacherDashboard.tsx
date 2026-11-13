"use client";

import React, { useEffect, useState } from "react";
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
  ArrowUpDown,
  ShieldCheck,
  LogOut
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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-[#00d4ff]/30 cyan-glow bg-[#0a1224]/90">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#00d4ff]" />
              EXAMINER PORTAL
            </span>
            <span className="text-xs text-[#8ba0b5]">
              Verified: <strong className="text-[#00d4ff]">io@maziz.me</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e8eef7] mt-1">
            Midterm Marksheet &amp; Class Analytics
          </h1>
          <p className="text-xs text-[#8ba0b5] mt-0.5">
            Full class access restricted to <span className="text-[#e8b86d]">io@maziz.me</span> • Powered by Groq AI
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1a2744] hover:bg-[#1a2744] text-xs font-semibold text-[#8ba0b5] hover:text-[#e8eef7] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0e8f86] text-[#050a14] text-xs font-bold cyan-glow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download Marksheet (CSV)</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Lock Examiner Portal"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-xs font-semibold text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center justify-between">
          <p>⚠️ {error}</p>
          {onLogout && (
            <button onClick={onLogout} className="underline font-bold ml-4">
              Re-authenticate as io@maziz.me
            </button>
          )}
        </div>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-[#1a2744] space-y-1">
          <div className="flex items-center justify-between text-[#8ba0b5] text-[11px] font-semibold uppercase">
            <span>Submissions</span>
            <Users className="w-4 h-4 text-[#00d4ff]" />
          </div>
          <p className="text-2xl font-bold text-[#e8eef7]">{totalStudents}</p>
          <span className="text-[10px] text-[#8ba0b5]">Registered students</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#1a2744] space-y-1">
          <div className="flex items-center justify-between text-[#8ba0b5] text-[11px] font-semibold uppercase">
            <span>Class Average</span>
            <TrendingUp className="w-4 h-4 text-[#00d4ff]" />
          </div>
          <p className="text-2xl font-bold text-[#00d4ff]">{avgScore}</p>
          <span className="text-[10px] text-[#8ba0b5]">Out of 100</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#1a2744] space-y-1">
          <div className="flex items-center justify-between text-[#8ba0b5] text-[11px] font-semibold uppercase">
            <span>Highest Score</span>
            <Award className="w-4 h-4 text-[#e8b86d]" />
          </div>
          <p className="text-2xl font-bold text-[#e8b86d]">{highestScore}</p>
          <span className="text-[10px] text-[#8ba0b5]">Top performance</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#1a2744] space-y-1">
          <div className="flex items-center justify-between text-[#8ba0b5] text-[11px] font-semibold uppercase">
            <span>Lowest Score</span>
            <GraduationCap className="w-4 h-4 text-[#8ba0b5]" />
          </div>
          <p className="text-2xl font-bold text-[#8ba0b5]">{lowestScore}</p>
          <span className="text-[10px] text-[#8ba0b5]">Minimum scored</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#00d4ff]/30 space-y-1 cyan-glow">
          <div className="flex items-center justify-between text-[#7df9ff] text-[11px] font-semibold uppercase">
            <span>Pass Rate</span>
            <Zap className="w-4 h-4 text-[#00d4ff]" />
          </div>
          <p className="text-2xl font-bold text-[#7df9ff]">{passRate}%</p>
          <span className="text-[10px] text-[#8ba0b5]">&gt;= 50% threshold</span>
        </div>
      </div>

      {/* Marksheet Table Card */}
      <div className="glass-panel rounded-2xl border border-[#1a2744] overflow-hidden space-y-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#00d4ff]" />
            <h3 className="text-base font-bold text-[#e8eef7]">Official Student Marksheet</h3>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name, roll no, section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#41536b]" />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-[#1a2744] rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050a14] border-b border-[#1a2744] text-[#8ba0b5] uppercase tracking-wider font-semibold">
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
            <tbody className="divide-y divide-[#1a2744] text-[#e8eef7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[#8ba0b5]">
                    No student submissions found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#0f1b36]/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#00d4ff]">{s.student.rollNumber}</td>
                    <td className="py-3 px-4 font-semibold">
                      <div>{s.student.name}</div>
                      <span className="text-[10px] text-[#8ba0b5]">{s.student.email}</span>
                    </td>
                    <td className="py-3 px-4 text-[#8ba0b5]">{s.student.section}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.sectionScores.sectionA}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.sectionScores.sectionB}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.sectionScores.sectionC}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.sectionScores.sectionD}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-sm text-[#00d4ff] font-mono">{s.totalScore}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        s.grade === "A+" || s.grade === "A"
                          ? "bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30"
                          : s.grade === "B"
                          ? "bg-[#e8b86d]/10 text-[#e8b86d] border-[#e8b86d]/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                      }`}>
                        {s.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedSubmission(s)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#050a14] border border-[#1a2744] hover:border-[#00d4ff]/40 text-[#00d4ff] text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col glass-panel rounded-3xl border border-[#00d4ff]/30 shadow-2xl bg-[#0a1224]/95 text-[#e8eef7]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1a2744]">
              <div>
                <h3 className="text-lg font-bold text-[#e8eef7]">
                  Exam Inspection: {selectedSubmission.student.name}
                </h3>
                <p className="text-xs text-[#8ba0b5]">
                  Roll No: <strong className="text-[#00d4ff]">{selectedSubmission.student.rollNumber}</strong> • Score: <strong className="text-[#00d4ff]">{selectedSubmission.totalScore}/100</strong> (Grade {selectedSubmission.grade})
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-xl text-[#8ba0b5] hover:text-[#e8eef7] hover:bg-[#1a2744]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#050a14] border border-[#1a2744]">
                  <span className="text-[#8ba0b5] block">Sec A (MCQ)</span>
                  <span className="text-sm font-bold text-[#00d4ff]">{selectedSubmission.sectionScores.sectionA}/20</span>
                </div>
                <div className="p-3 rounded-xl bg-[#050a14] border border-[#1a2744]">
                  <span className="text-[#8ba0b5] block">Sec B (Short)</span>
                  <span className="text-sm font-bold text-[#00d4ff]">{selectedSubmission.sectionScores.sectionB}/10</span>
                </div>
                <div className="p-3 rounded-xl bg-[#050a14] border border-[#1a2744]">
                  <span className="text-[#8ba0b5] block">Sec C (Long)</span>
                  <span className="text-sm font-bold text-[#00d4ff]">{selectedSubmission.sectionScores.sectionC}/20</span>
                </div>
                <div className="p-3 rounded-xl bg-[#050a14] border border-[#00d4ff]/30 cyan-glow">
                  <span className="text-[#7df9ff] block">Sec D (Project)</span>
                  <span className="text-sm font-bold text-[#7df9ff]">{selectedSubmission.sectionScores.sectionD}/50</span>
                </div>
              </div>

              {/* Feedback */}
              <div className="p-4 rounded-xl bg-[#050a14] border border-[#1a2744] space-y-2">
                <h4 className="font-bold text-[#e8eef7] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#00d4ff]" /> AI Assessment Evaluation Notes
                </h4>
                <p className="text-[#8ba0b5] leading-relaxed">
                  {selectedSubmission.generalFeedback.summary}
                </p>
              </div>

              {/* Question Feedback Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#e8eef7]">Subjective Question Scores &amp; Rubric Feedback</h4>
                {Object.entries(selectedSubmission.subjectiveFeedback).map(([qKey, fb]) => (
                  <div key={qKey} className="p-3 rounded-xl bg-[#070e1c] border border-[#1a2744] space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-[#00d4ff] font-bold">{qKey.toUpperCase()}</span>
                      <span className="text-[#e8eef7] font-semibold">{fb.marksAwarded} / {fb.maxMarks} Mks</span>
                    </div>
                    <p className="text-[#8ba0b5]">{fb.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1a2744] flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#1a2744] text-[#e8eef7] hover:bg-[#25365c]"
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
