/**
 * Simple in-process store for development.
 * On Vercel this uses the filesystem (/tmp) which is ephemeral —
 * swap for Vercel KV (upstash redis) for production persistence.
 */
import fs from "fs/promises";
import path from "path";
import { AnalysisResult } from "@/lib/types";

const STORE_DIR =
  process.env.NODE_ENV === "production"
    ? "/tmp/pressuretest"
    : path.join(process.cwd(), ".store");

async function ensureDir() {
  await fs.mkdir(STORE_DIR, { recursive: true });
}

export async function saveResult(result: AnalysisResult): Promise<void> {
  await ensureDir();
  const file = path.join(STORE_DIR, `${result.id}.json`);
  await fs.writeFile(file, JSON.stringify(result, null, 2), "utf-8");
}

export async function getResult(id: string): Promise<AnalysisResult | null> {
  await ensureDir();
  try {
    const file = path.join(STORE_DIR, `${id}.json`);
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as AnalysisResult;
  } catch {
    return null;
  }
}
