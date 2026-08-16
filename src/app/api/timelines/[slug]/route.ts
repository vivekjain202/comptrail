import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { timelines } from "@/db/schema";
import { ValidationError, parseTimelinePayload } from "@/lib/validate";

function toPublicShape(row: typeof timelines.$inferSelect) {
  return {
    slug: row.slug,
    title: row.title,
    note: row.note,
    learnings: row.learnings,
    currency: row.currency,
    entries: row.entries,
    updatedAt: row.updatedAt,
    viewCount: row.viewCount,
  };
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();

  const [row] = await db.select().from(timelines).where(eq(timelines.slug, slug)).limit(1);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(toPublicShape(row));
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();

  const body = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null || typeof body.editToken !== "string") {
    return NextResponse.json({ error: "Missing edit token" }, { status: 400 });
  }

  let payload;
  try {
    payload = parseTimelinePayload(body);
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const [existing] = await db.select().from(timelines).where(eq(timelines.slug, slug)).limit(1);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.editToken !== body.editToken) {
    return NextResponse.json({ error: "Invalid edit token" }, { status: 403 });
  }

  const [updated] = await db
    .update(timelines)
    .set({
      title: payload.title,
      note: payload.note,
      learnings: payload.learnings,
      currency: payload.currency,
      entries: payload.entries,
      updatedAt: new Date(),
    })
    .where(eq(timelines.slug, slug))
    .returning();

  return NextResponse.json(toPublicShape(updated));
}
