"use client";

import React, { useState } from "react";
import { Shield, Lock, AlertCircle, CheckCircle2, X, ArrowRight, Loader2 } from "lucide-react";

interface ExaminerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, email: string) => void;
}

export default function ExaminerLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: ExaminerLoginModalProps) {
  const [email, setEmail] = useState("io@maziz.me");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email.trim().toLowerCase() !== "io@maziz.me") {
      setError("Access Restricted: Only io@maziz.me has permission to access the teacher marksheet.");
      return;
    }

    if (!passcode) {
      setError("Please enter the examiner passcode.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/examiner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onSuccess(data.token, data.email);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a14]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0a1224] border border-[#00d4ff]/40 p-6 sm:p-8 cyan-glow shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#8ba0b5] hover:text-[#e8eef7] hover:bg-[#1a2744] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#0e8f86] flex items-center justify-center text-[#050a14] shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#e8eef7]">Examiner Portal</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#e8b86d]/10 text-[#e8b86d] border border-[#e8b86d]/30">
                RESTRICTED
              </span>
            </div>
            <p className="text-xs text-[#8ba0b5]">Class Marksheet &amp; Evaluation Access</p>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3.5 mb-5 rounded-2xl bg-[#050a14] border border-[#1a2744] text-xs text-[#8ba0b5] space-y-1">
          <p className="text-[#e8eef7] font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#00d4ff]" />
            Role-Based Confidential Access
          </p>
          <p className="text-[11px] leading-relaxed">
            Students can only see their individual scorecards. Only <strong className="text-[#00d4ff]">io@maziz.me</strong> has authorization to view all student marks and export the class marksheet.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#e8eef7] mb-1.5">
              Authorized Examiner Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="io@maziz.me"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] focus:outline-none focus:border-[#00d4ff] transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e8eef7] mb-1.5">
              Examiner Security Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter examiner passcode"
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs sm:text-sm text-[#e8eef7] focus:outline-none focus:border-[#00d4ff] transition-all font-mono"
            />
            <p className="text-[10px] text-[#8ba0b5] mt-1 italic">
              Default passcode: <code className="text-[#00d4ff]">maziz2026</code> (configured via EXAMINER_PASSCODE).
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0e8f86] text-[#050a14] text-xs sm:text-sm font-bold cyan-glow hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Teacher Marksheet</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

