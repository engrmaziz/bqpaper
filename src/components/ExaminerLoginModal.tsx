"use client";

import React, { useState } from "react";
import Image from "next/image";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#d4e7dc] p-6 sm:p-8 bq-card shadow-2xl overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#015b30] via-[#008b74] to-[#7cb342]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#516d5e] hover:text-[#0d2317] hover:bg-[#edf5f0] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Official Logo & Patron Portrait */}
        <div className="flex items-center gap-3.5 mb-6 pt-2">
          <div className="flex items-center -space-x-2.5">
            <div className="relative w-14 h-14 rounded-2xl bg-[#f4f8f5] border border-[#d4e7dc] p-1.5 flex items-center justify-center shadow-xs z-10">
              <Image
                src="/bano-qabil.png"
                alt="Bano Qabil Official Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="relative w-14 h-14 rounded-2xl bg-[#edf5f0] border-2 border-[#015b30] p-0.5 flex items-center justify-center shadow-xs overflow-hidden ring-2 ring-[#7cb342]/40">
              <Image
                src="/hafiz.png"
                alt="Patron Hafiz Naeem ur Rehman"
                width={48}
                height={48}
                className="object-cover rounded-xl w-full h-full"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#015b30]">Examiner Portal</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#015b30]/10 text-[#015b30] border border-[#015b30]/30">
                RESTRICTED
              </span>
            </div>
            <p className="text-xs text-[#516d5e]">Patron: <strong>Hafiz Naeem ur Rehman</strong> • io@maziz.me</p>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3.5 mb-5 rounded-2xl bg-[#edf5f0] border border-[#d4e7dc] text-xs text-[#516d5e] space-y-1">
          <p className="text-[#015b30] font-bold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#008b74]" />
            Role-Based Confidential Access
          </p>
          <p className="text-[11px] leading-relaxed">
            Students can only view their own scorecards. Only <strong className="text-[#015b30]">io@maziz.me</strong> has authorization to view all student marks and export the class marksheet.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0d2317] mb-1.5">
              Authorized Examiner Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="io@maziz.me"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0d2317] mb-1.5">
              Examiner Security Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter examiner passcode"
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-[#f4f8f5] border border-[#d4e7dc] text-xs sm:text-sm text-[#0d2317] focus:outline-none focus:border-[#015b30] focus:bg-white transition-all font-mono"
            />
            <p className="text-[10px] text-[#516d5e] mt-1 italic">
              Default passcode: <code className="text-[#015b30] font-bold">maziz2026</code> (configured via EXAMINER_PASSCODE).
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#015b30] hover:bg-[#014223] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#7cb342]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Teacher Marksheet</span>
                  <ArrowRight className="w-4 h-4 text-[#7cb342]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
