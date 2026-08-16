"use client";

import { useRef } from "react";
import ExportMenu from "./ExportMenu";
import { MarkdownPreview } from "./MarkdownEditor";
import SectionShareButton from "./SectionShareButton";

interface LearningsSectionProps {
  learnings: string;
  slug?: string | null;
}

const SECTION_ID = "learnings-section";

export default function LearningsSection({ learnings, slug }: LearningsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!learnings.trim()) return null;

  return (
    <div
      ref={containerRef}
      id={SECTION_ID}
      className="relative scroll-mt-4 rounded-lg border p-5"
      style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Career Learnings
        </h2>
        <div className="flex items-center gap-1.5" data-export-ignore>
          <SectionShareButton slug={slug} anchor={SECTION_ID} />
          <ExportMenu getNode={() => containerRef.current} filename="career-learnings" label="career learnings" />
        </div>
      </div>
      <MarkdownPreview value={learnings} />
    </div>
  );
}
