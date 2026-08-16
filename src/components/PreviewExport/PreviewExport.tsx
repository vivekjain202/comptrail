"use client";

import { useRef } from "react";
import ExportMenu from "../ExportMenu/ExportMenu";

interface PreviewExportProps {
  filename: string;
  children: React.ReactNode;
}

export default function PreviewExport({ filename, children }: PreviewExportProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ExportMenu getNode={() => containerRef.current} filename={filename} label="full preview" />
      </div>
      <div ref={containerRef} className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
