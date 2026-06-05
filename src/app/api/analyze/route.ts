import Groq from "groq-sdk";
import { AnalysisResult, PersonaResult } from "@/lib/types";
import { SYSTEM_PROMPT, buildAnalyzePrompt } from "@/lib/prompts";
import { saveResult } from "@/lib/store";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: Request) {
  try {
    const { prd } = await request.json();

    if (!prd || typeof prd !== "string" || prd.trim().length < 50) {
      return Response.json(
        { error: "PRD must be at least 50 characters." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildAnalyzePrompt(prd) },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw.replace(/```json\n?|```/g, "").trim());

    const personas: PersonaResult[] = parsed.personas;
    const overallScore = Math.round(
      personas.reduce((sum, p) => sum + p.score, 0) / personas.length
    );

    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      overallScore,
      personas,
      createdAt: new Date().toISOString(),
      prdSnippet: prd.slice(0, 200),
    };

    await saveResult(result);

    return Response.json(result);
  } catch (err) {
    console.error("analyze error", err);
    return Response.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
