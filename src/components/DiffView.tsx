"use client";

interface Props {
  original: string;
  rewritten: string;
  onAccept: () => void;
  onDiscard: () => void;
}

export default function DiffView({ original, rewritten, onAccept, onDiscard }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Suggested rewrite</p>
        <div className="flex gap-2">
          <button
            onClick={onDiscard}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={onAccept}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Accept & copy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Before */}
        <div className="p-5">
          <p className="text-xs font-semibold text-red-500 mb-3 uppercase tracking-wide">Before</p>
          <p className="text-sm text-gray-600 leading-relaxed line-through decoration-red-300">
            {original}
          </p>
        </div>

        {/* After */}
        <div className="p-5 bg-emerald-50/40">
          <p className="text-xs font-semibold text-emerald-600 mb-3 uppercase tracking-wide">After</p>
          <p className="text-sm text-gray-800 leading-relaxed">{rewritten}</p>
        </div>
      </div>
    </div>
  );
}
