import { notFound } from "next/navigation";
import Link from "next/link";
import { getResult } from "@/lib/store";
import ScoreRing from "@/components/ScoreRing";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) notFound();

  const scoreColor = result.overallScore < 40 ? "text-red-600" : result.overallScore < 70 ? "text-amber-600" : "text-emerald-600";

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="font-bold text-gray-900 text-lg tracking-tight">
          Pressure<span className="text-indigo-600">Test</span>
        </Link>
        <Link
          href="/analyze"
          className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Test your PRD →
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing score={result.overallScore} size={120} />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Shared PRD Analysis</p>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Review Readiness: <span className={scoreColor}>{result.overallScore}/100</span>
            </h1>
            <p className="text-sm text-gray-500 italic line-clamp-2">"{result.prdSnippet}..."</p>
            <p className="text-xs text-gray-400 mt-2">
              Analyzed {new Date(result.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Rewrite (if accepted) */}
        {result.rewrite && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
              <p className="text-sm font-semibold text-gray-700">Accepted rewrite</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-5">
                <p className="text-xs font-semibold text-red-500 mb-2 uppercase tracking-wide">Before</p>
                <p className="text-sm text-gray-600 leading-relaxed line-through decoration-red-300">{result.rewrite.original}</p>
              </div>
              <div className="p-5 bg-emerald-50/40">
                <p className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wide">After</p>
                <p className="text-sm text-gray-800 leading-relaxed">{result.rewrite.rewritten}</p>
              </div>
            </div>
          </div>
        )}

        {/* Persona results */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 px-1">Stakeholder perspectives</h2>
          {result.personas.map((persona) => {
            const color = persona.score < 40 ? "red" : persona.score < 70 ? "yellow" : "green";
            const badgeClass = color === "red"
              ? "text-red-600 bg-red-50 border-red-200"
              : color === "yellow"
              ? "text-amber-600 bg-amber-50 border-amber-200"
              : "text-emerald-600 bg-emerald-50 border-emerald-200";
            const dotClass = color === "red" ? "bg-red-500" : color === "yellow" ? "bg-amber-400" : "bg-emerald-500";

            return (
              <div key={persona.id} className="rounded-2xl border bg-white shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">{persona.name}</p>
                    <p className="text-sm text-gray-500">{persona.role}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-800">{persona.score}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                      {color === "red" ? "Blocker" : color === "yellow" ? "Needs work" : "Ready"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {persona.bullets.map((bullet, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${dotClass}`} />
                      <p className="text-sm text-gray-700">{bullet.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pb-8">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Pressure Test your own PRD →
          </Link>
        </div>
      </div>
    </main>
  );
}
