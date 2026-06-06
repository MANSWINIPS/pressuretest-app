"use client";

import { useEffect } from "react";

function getAnonymousVisitorId(): string {
  const KEY = "pendo_anon_visitor_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = `anon-${crypto.randomUUID()}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

export default function PendoInitializer() {
  useEffect(() => {
    if (typeof pendo !== "undefined") {
      pendo.initialize({
        visitor: {
          id: getAnonymousVisitorId(),
        },
      });
    }
  }, []);

  return null;
}
