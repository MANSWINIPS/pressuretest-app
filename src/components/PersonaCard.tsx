"use client";

import { useState } from "react";
import { PersonaResult, Severity } from "@/lib/types";

const SEVERITY_COLORS: Record<Severity, string> = {
  red: "text-red-600 bg-red-50 border-red-200",
  yellow: "text-amber-600 bg-amber-50 border-amber-200",
  green: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

const SEVERITY_DOT: Record<Severity, string> = {
  red: "bg-red-500",
  yellow: "bg-amber-400",
  green: "bg-emerald-500",
};

const SCORE_RING: Record<string, string> = {
  red: "stroke-red-500",
  yellow: "stroke-amber-400",
  green: "stroke-emerald-500",
};

function scoreColor(score: number): Severity {
  if (score < 40) return "red";
  if (score < 70) return "yellow";
  return "green";
}

interface Props {
  persona: PersonaResult;
  onFixRequest: (paragraph: string, personaId: string) => void;
  delay?: number;
}

export default function PersonaCard({ persona, onFixRequest, delay = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const color = scoreColor(persona.score);
  const circumference = 2 * Math.PI * 20;
  const dashOffset = circumference - (persona.score / 100) * circumference;

  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm transition-all duration-300 animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-4">
          {/* Score ring */}
          <svg width="52" height="52" className="-rotate-90">
            <circle cx="26" cy="26" r="20" strokeWidth="4" className="stroke-gray-100 fill-none" />
            <circle
              cx="26"
              cy="26"
              r="20"
              strokeWidth="4"
              strokeLinecap="round"
              className={`fill-none transition-all duration-700 ${SCORE_RING[color]}`}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
            <text
              x="26"
              y="26"
              textAnchor="middle"
              dominantBaseline="central"
              className="rotate-90 origin-center text-xs font-bold fill-gray-800"
              style={{ transform: "rotate(90deg)", transformOrigin: "26px 26px" }}
            >
              {persona.score}
            </text>
          </svg>
          <div>
            <p className="font-semibold text-gray-900">{persona.name}</p>
            <p className="text-sm text-gray-500">{persona.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${SEVERITY_COLORS[color]}`}
          >
            {color === "red" ? "Blocker" : color === "yellow" ? "Needs work" : "Ready"}
          </span>
          <span className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            ▾
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
          {persona.bullets.map((bullet, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${SEVERITY_DOT[bullet.severity]}`} />
              <p className="text-sm text-gray-700">{bullet.text}</p>
            </div>
          ))}

          {persona.weakestParagraph && (
            <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Flagged paragraph
              </p>
              <p className="text-sm text-gray-600 italic">"{persona.weakestParagraph}"</p>
              <button
                onClick={() => onFixRequest(persona.weakestParagraph!, persona.id)}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
              >
                Fix this paragraph →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
