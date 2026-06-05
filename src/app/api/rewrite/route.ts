import Groq from "groq-sdk";
import { REWRITE_SYSTEM_PROMPT, buildRewritePrompt } from "@/lib/prompts";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: Request) {
  try {
    const { prd, paragraph, personaName, redBullets } = await request.json();

    if (!paragraph || !personaName) {
      return Response.json({ error: "Missing paragraph or persona." }, { status: 400 });
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
            personaName,
            Array.isArray(redBullets) ? redBullets : [],
            prd
          ),
        },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw.replace(/```json\n?|```/g, "").trim());

    return Response.json({ rewritten: parsed.rewritten });
  } catch (err) {
    console.error("rewrite error", err);
    return Response.json(
      { error: "Rewrite failed. Please try again." },
      { status: 500 }
    );
  }
}
