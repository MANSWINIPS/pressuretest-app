import { AnalysisResult } from "@/lib/types";
import { getResult } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  const result = await getResult(id);
  if (!result) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(result);
}
