import { AnalysisResult } from "@/lib/types";

/**
 * Encode an analysis result into a URL-safe base64 string so it can be
 * embedded directly in a shareable permalink — no database required.
 * Works in both browser (btoa) and server (Buffer) environments.
 */
export function encodeResult(result: AnalysisResult): string {
  const json = JSON.stringify(result);
  let b64: string;
  if (typeof window !== "undefined") {
    const bytes = new TextEncoder().encode(json);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    b64 = btoa(bin);
  } else {
    b64 = Buffer.from(json, "utf-8").toString("base64");
  }
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeResult(encoded: string): AnalysisResult | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    let json: string;
    if (typeof window !== "undefined") {
      const bin = atob(b64);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    } else {
      json = Buffer.from(b64, "base64").toString("utf-8");
    }
    return JSON.parse(json) as AnalysisResult;
  } catch {
    return null;
  }
}
