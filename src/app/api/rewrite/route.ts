import Groq from "groq-sdk";
import { REWRITE_SYSTEM_PROMPT, buildRewritePrompt } from "@/lib/prompts";
import { getResult, saveResult } from "@/lib/store";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: Request) {
  try {
    const { prd, resultId, personaId, paragraph } = await request.json();

    const result = await getResult(resultId);
    if (!result) {
      return Response.json({ error: "Result not found." }, { status: 404 });
    }

    const persona = result.personas.find((p) => p.id === personaId);
    if (!persona) {
      return Response.json({ error: "Persona not found." }, { status: 404 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: REWRITE_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildRewritePrompt(
            paragraph,
            persona.name,
            persona.bullets.filter((b) => b.severity === "red").map((b) => b.text),
            prd
          ),
        },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw.replace(/```json\n?|```/g, "").trim());

    result.rewrite = {
      original: paragraph,
      rewritten: parsed.rewritten,
      personaId,
    };
    await saveResult(result);

    return Response.json({ rewritten: parsed.rewritten, resultId });
  } catch (err) {
    console.error("rewrite error", err);
    return Response.json(
      { error: "Rewrite failed. Please try again." },
      { status: 500 }
    );
  }
}
