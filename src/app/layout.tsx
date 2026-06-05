import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PressureTest — Dry-run your PRD review",
  description: "Paste your PRD and get four stakeholder perspectives — engineering, design, sales, and finance — with a readiness score in 30 seconds.",
  openGraph: {
    title: "PressureTest — Dry-run your PRD review before it happens",
    description: "Four perspectives, one readiness score, in 30 seconds. Free, no sign-up.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        {/* Novus.ai analytics — snippet added before submission */}
      </body>
    </html>
  );
}
