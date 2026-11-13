"use client";

import React, { useState } from "react";
import { Key, X, CheckCircle, ShieldCheck, Zap, ExternalLink } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}: SettingsModalProps) {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput("");
    onSaveKey("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-[#00d4ff]/30 p-6 shadow-2xl bg-[#0a1224]/95 text-[#e8eef7]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1a2744]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff] cyan-glow">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e8eef7]">Groq AI Assessment Engine</h3>
              <p className="text-xs text-[#8ba0b5]">Fast Llama 3.3 70B evaluation for midterm papers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8ba0b5] hover:text-[#e8eef7] hover:bg-[#1a2744] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-[#050a14] border border-[#1a2744] text-xs text-[#8ba0b5] space-y-2">
            <p className="text-[#e8eef7] font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00d4ff]" />
              Free Groq API Key Configuration
            </p>
            <p>
              Groq provides super-fast LLM inference (<span className="text-[#00d4ff]">~300 tokens/sec</span>). You can obtain a free key at{" "}
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#00d4ff] hover:underline inline-flex items-center gap-1 font-semibold"
              >
                console.groq.com <ExternalLink className="w-3 h-3" />
              </a>.
            </p>
            <p className="text-[11px] text-[#e8b86d]">
              * Note: If no custom key is provided, the platform automatically uses the server&apos;s environment key or the built-in deterministic marking engine.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8ba0b5] uppercase tracking-wider mb-2">
              Enter Groq API Key (gsk_...)
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050a14] border border-[#1a2744] text-sm text-[#e8eef7] placeholder-[#41536b] focus:outline-none focus:border-[#00d4ff] transition-all font-mono"
              />
              <Key className="absolute right-3 top-3 w-4 h-4 text-[#41536b]" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1a2744]">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-[#8ba0b5] hover:text-red-400 transition-colors"
          >
            Clear Key
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#1a2744] hover:bg-[#1a2744] text-[#8ba0b5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-[#00d4ff] text-[#050a14] hover:bg-[#7df9ff] transition-all cyan-glow"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save API Key</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

