import type { Metadata } from "next";
import Script from "next/script";
import PendoInitializer from "@/components/PendoInitializer";
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
      <head>
        <Script id="pendo-install" strategy="afterInteractive">{`
(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track', 'trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('993c1147-63aa-420a-af7d-9ee4da52af16');
        `}</Script>
      </head>
      <body className="min-h-full flex flex-col">
        <PendoInitializer />
        {children}
      </body>
    </html>
  );
}
