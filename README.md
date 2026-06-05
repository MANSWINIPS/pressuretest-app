# PressureTest

**Dry-run your PRD review meeting before it happens.**
Four perspectives, one readiness score, in 30 seconds.

Built for the Mind the Product *World Product Day 2026 — Everyone Ships Now* hackathon.

---

## What it does

Paste any PRD → four AI stakeholders (Engineering Lead, Designer, Sales Lead, CFO) review it in parallel → you get:

- **Overall Review Readiness Score** (0–100)
- **Per-persona breakdown** — score, severity bullets (red / yellow / green), and the verbatim weakest paragraph from your doc
- **One-tap rewrite** — pick a flagged paragraph, get a side-by-side before/after diff, accept it and the PRD is updated and rescored
- **Shareable permalink** — send the result URL to your team

## Why not just ChatGPT?

ChatGPT is the engine. This is the car.

| ChatGPT | PressureTest |
|---|---|
| One generic reviewer | Four named, role-specific stakeholders |
| Wall of prose | Quantified score + severity badges |
| Generic advice | Verbatim quotes from *your* doc |
| Lost in chat history | Shareable permalink |
| Suggestion in prose | Side-by-side rewrite diff you can accept |

## Stack

- **Next.js 16** App Router, TypeScript, Tailwind CSS
- **Groq + Llama 3.3 70B** for analysis & rewrites (free, sub-second)
- File-system result store (no DB needed)
- Vercel-ready

## Local setup

```bash
git clone https://github.com/MANSWINIPS/pressuretest-app.git
cd pressuretest-app
npm install
cp .env.example .env.local
# add your free Groq key from https://console.groq.com/keys
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `GROQ_API_KEY` | yes | Free at https://console.groq.com/keys |

## Project structure

```
src/
  app/
    page.tsx              # Landing
    analyze/page.tsx      # Core tool (paste PRD → score)
    result/[id]/page.tsx  # Shareable permalink
    api/
      analyze/route.ts    # POST: PRD → 4-persona analysis
      rewrite/route.ts    # POST: paragraph → rewritten paragraph
      result/route.ts     # GET:  load saved result by id
  components/
    ScoreRing.tsx         # SVG donut score
    PersonaCard.tsx       # Animated expandable persona card
    DiffView.tsx          # Before/after rewrite diff
  lib/
    prompts.ts            # 4-persona system prompts
    types.ts              # Shared TypeScript types
    store.ts              # File-system result storage
```

## License

MIT

