"use client";

import { useEffect } from "react";

export default function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const target = document.getElementById(hash);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return null;
}
