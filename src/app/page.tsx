import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="font-bold text-gray-900 text-lg tracking-tight">
          Pressure<span className="text-indigo-600">Test</span>
        </span>
        <Link
          href="/analyze"
          className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try it free &rarr;
        </Link>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-indigo-100">
          No sign-up required
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          Dry-run your Product Requirement Document (PRD) review<br />
          <span className="text-indigo-600">before it happens.</span>
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
          Paste your PRD. Get four perspectives — engineering, design, sales, and finance —
          with a readiness score and a one-click paragraph rewrite. In 30 seconds.
        </p>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          Pressure Test my PRD &rarr;
        </Link>
        <p className="mt-4 text-sm text-gray-400">Free to use &middot; No account &middot; Results are shareable</p>
      </section>

      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Every PRD fails in the same four places.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { persona: "Engineering", quote: "How does this handle [edge case]? This is not specced." },
              { persona: "Design", quote: "What happens when there is no data? No empty state defined." },
              { persona: "Sales", quote: "I cannot tell who this is actually for from this doc." },
              { persona: "Finance", quote: "What is the success metric? How do we know if this worked?" },
            ].map((item) => (
              <div key={item.persona} className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">{item.persona}</p>
                <p className="text-sm text-gray-600 italic">"{item.quote}"</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-8 text-sm">Pressure Test surfaces all of this before your stakeholders do.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">How it works</h2>
        <div className="space-y-6">
          {[
            { step: "1", title: "Paste your PRD", desc: "Any format. No template required." },
            { step: "2", title: "Get four perspectives", desc: "Eng Lead, Designer, Sales Lead, and CFO each give a readiness score and three specific bullets quoting your doc." },
            { step: "3", title: "Fix what matters", desc: "Click any flagged paragraph and get a one-click rewrite. Accept it, copy it, paste it back into your doc." },
            { step: "4", title: "Share the result", desc: "Copy a permalink and send it to your co-author. They see exactly what you saw." },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">{item.step}</div>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-indigo-200 text-sm font-semibold mb-3">The obvious question</p>
          <h2 className="text-2xl font-bold mb-4">Why not just use ChatGPT?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            ChatGPT is the engine. This is the car. Four named stakeholders, a quantified readiness score, quotes from your actual doc, and a shareable result.
          </p>
          <Link href="/analyze" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            See the difference &rarr;
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        Built for the Mind the Product World Product Day Hackathon. Free forever.
      </footer>
    </main>
  );
}
