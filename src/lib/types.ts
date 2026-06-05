export type Severity = "red" | "yellow" | "green";

export interface PersonaBullet {
  text: string;
  severity: Severity;
}

export interface PersonaResult {
  id: "eng" | "design" | "sales" | "cfo";
  name: string;
  role: string;
  score: number; // 0-100
  bullets: PersonaBullet[];
  weakestParagraph?: string; // the quoted PRD text this persona flagged most
}

export interface AnalysisResult {
  id: string;
  overallScore: number; // 0-100
  personas: PersonaResult[];
  rewrite?: {
    original: string;
    rewritten: string;
    personaId: string;
  };
  createdAt: string;
  prdSnippet: string; // first 200 chars of PRD for display
}

export interface AnalyzeRequest {
  prd: string;
}

export interface RewriteRequest {
  prd: string;
  resultId: string;
  personaId: string;
  paragraph: string;
}
