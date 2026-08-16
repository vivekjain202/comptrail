import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { timelines } from "@/db/schema";
import { renderTimelineImage } from "@/lib/og-image";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();

  const [row] = await db.select().from(timelines).where(eq(timelines.slug, slug)).limit(1);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return renderTimelineImage({
    title: row.title,
    note: row.note,
    currency: row.currency,
    entries: row.entries,
  });
}
