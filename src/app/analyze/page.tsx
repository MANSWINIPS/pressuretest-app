"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnalysisResult } from "@/lib/types";
import { encodeResult } from "@/lib/share";
import PersonaCard from "@/components/PersonaCard";
import ScoreRing from "@/components/ScoreRing";
import DiffView from "@/components/DiffView";

const DEMO_PRD = `# Feature: Notifications v2

## Overview
We want to improve our notification system so users get better notifications.

## Goals
- Users will get more relevant notifications
- Reduce notification fatigue
- Improve engagement

## User Stories
- As a user, I want to receive notifications about things that matter to me
- As a user, I want to control my notifications

## Technical Notes
We'll use the existing notification infrastructure and add some new settings.

## Success Metrics
More users will engage with notifications after this change.

## Timeline
Q3 2026`;

function replaceParagraph(prd: string, original: string, rewritten: string): string {
  if (!original) return prd;

  // 1. Exact match
  if (prd.includes(original)) {
    return prd.replace(original, rewritten);
  }

  // 2. Whitespace-tolerant match: collapse runs of whitespace on both sides
  const norm = (s: string) => s.replace(/\s+/g, " ").trim();
  const normOriginal = norm(original);
  if (!normOriginal) return prd;

  // Walk the PRD looking for a window whose normalized form equals normOriginal
  const prdNorm = norm(prd);
  if (!prdNorm.includes(normOriginal)) {
    // 3. Last-resort: match by the first significant line of the original
    const firstLine = original
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 10);
    if (firstLine && prd.includes(firstLine)) {
      return prd.replace(firstLine, rewritten);
    }
    return prd;
  }

  // Try to locate the exact span in the original (non-normalized) text whose
  // normalized form matches normOriginal.
  const len = original.length;
  for (let start = 0; start <= prd.length - 1; start++) {
    for (let end = start + Math.max(len - 20, 5); end <= Math.min(prd.length, start + len + 40); end++) {
      const slice = prd.slice(start, end);
      if (norm(slice) === normOriginal) {
        return prd.slice(0, start) + rewritten + prd.slice(end);
      }
    }
  }
  return prd;
}

export default function AnalyzePage() {
  const [prd, setPrd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rewriting, setRewriting] = useState(false);
  const [rewrite, setRewrite] = useState<{ original: string; rewritten: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [prdCopied, setPrdCopied] = useState(false);
  const [showPrd, setShowPrd] = useState(false);
  const diffRef = useRef<HTMLDivElement>(null);

  async function handleAnalyze() {
    if (prd.trim().length < 50) {
      setError("Please paste a PRD with at least 50 characters.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    setRewrite(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFixRequest(paragraph: string, personaId: string) {
    if (!result) return;
    setRewriting(true);
    setRewrite(null);

    // Scroll to where the rewrite spinner / diff will appear
    setTimeout(() => {
      diffRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    try {
      const persona = result.personas.find((p) => p.id === personaId);
      const redBullets =
        persona?.bullets.filter((b) => b.severity === "red").map((b) => b.text) ?? [];
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prd,
          paragraph,
          personaName: persona?.name ?? "Reviewer",
          redBullets,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rewrite failed");
      setRewrite({ original: paragraph, rewritten: data.rewritten });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Rewrite failed.");
    } finally {
      setRewriting(false);
    }
  }

  async function handleAcceptRewrite() {
    if (!rewrite) return;
    navigator.clipboard.writeText(rewrite.rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Replace the original paragraph in the PRD with the rewrite.
    const updatedPrd = replaceParagraph(prd, rewrite.original, rewrite.rewritten);
    const prdChanged = updatedPrd !== prd;
    setPrd(updatedPrd);
    setRewrite(null);

    // If the paragraph couldn't be located (already replaced, etc.), keep
    // the existing score instead of pinging the model with the same input.
    if (!prdChanged) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prd: updatedPrd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Re-analysis failed");
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Re-analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    if (!result) return;
    const encoded = encodeResult(result);
    const url = `${window.location.origin}/result/${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="font-bold text-gray-900 text-lg tracking-tight">
          Pressure<span className="text-indigo-600">Test</span>
        </Link>
        {result && (
          <button
            onClick={handleShare}
            className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            {copied ? "✓ Copied!" : "Share result"}
          </button>
        )}
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Input */}
        {!result && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pressure Test your PRD</h1>
            <p className="text-gray-500 text-sm mb-5">
              Paste your PRD below. Four stakeholders will review it and give you a readiness score.
            </p>
            <textarea
              value={prd}
              onChange={(e) => setPrd(e.target.value)}
              rows={16}
              placeholder="Paste your PRD here..."
              className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-800 font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-300"
            />
            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setPrd(DEMO_PRD)}
                className="text-sm text-indigo-500 hover:text-indigo-700 underline underline-offset-2"
              >
                Load demo PRD
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Pressure Test →"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Score header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing score={result.overallScore} size={120} />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Review Readiness Score</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Based on how your engineering lead, designer, sales lead, and CFO would react in a review meeting.
                </p>
                <p className="text-[11px] text-gray-400 mb-4 italic">
                  Powered by the free Groq + Llama 3.3 tier. Upgrading to a premium model (GPT-4o, Claude Opus, Llama 405B) yields sharper, more consistent scores.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <button
                    onClick={handleShare}
                    className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {copied ? "✓ Link copied!" : "Share this result"}
                  </button>
                  <button
                    onClick={() => { setResult(null); setPrd(""); setRewrite(null); }}
                    className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Test another PRD
                  </button>
                </div>
              </div>
            </div>

            {/* Updated PRD panel */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setShowPrd((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Your PRD</h3>
                  <p className="text-xs text-gray-500">
                    {rewrite || rewriting
                      ? "Accepting a rewrite will update this and rescore."
                      : "Updated as you accept rewrites."}
                  </p>
                </div>
                <span className="text-gray-400 text-sm">{showPrd ? "Hide ▲" : "Show ▼"}</span>
              </button>
              {showPrd && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  <textarea
                    value={prd}
                    onChange={(e) => setPrd(e.target.value)}
                    rows={14}
                    className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-800 font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(prd);
                        setPrdCopied(true);
                        setTimeout(() => setPrdCopied(false), 2000);
                      }}
                      className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {prdCopied ? "✓ Copied!" : "Copy PRD"}
                    </button>
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                    >
                      {loading ? "Re-scoring..." : "Re-test PRD"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Rewrite diff */}
            <div ref={diffRef} className="scroll-mt-6">
              {rewrite && (
                <DiffView
                  original={rewrite.original}
                  rewritten={rewrite.rewritten}
                  onAccept={handleAcceptRewrite}
                  onDiscard={() => setRewrite(null)}
                />
              )}

              {rewriting && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                  <div className="inline-block h-5 w-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-3" />
                  <p className="text-sm text-gray-500">Rewriting paragraph...</p>
                </div>
              )}
            </div>

            {/* Persona cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 px-1">Stakeholder perspectives</h3>
              {result.personas.map((persona, i) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  onFixRequest={handleFixRequest}
                  delay={i * 120}
                />
              ))}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </>
        )}
      </div>
    </main>
  );
}
