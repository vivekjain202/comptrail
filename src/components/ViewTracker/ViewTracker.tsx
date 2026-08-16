"use client";

import { useEffect } from "react";
import { getEditToken } from "@/lib/local-store";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (getEditToken(slug)) return;
    fetch(`/api/timelines/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
