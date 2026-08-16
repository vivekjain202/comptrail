import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { timelines } from "@/db/schema";
import { generateEditToken, generateSlug } from "@/lib/ids";
import { ValidationError, parseTimelinePayload } from "@/lib/validate";

export async function POST(request: Request) {
  let payload;
  try {
    payload = parseTimelinePayload(await request.json());
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const db = getDb();
  const editToken = generateEditToken();

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = generateSlug();
    try {
      await db.insert(timelines).values({
        slug,
        editToken,
        title: payload.title,
        note: payload.note,
        currency: payload.currency,
        entries: payload.entries,
      });
      return NextResponse.json({ slug, editToken }, { status: 201 });
    } catch (err) {
      const isUniqueViolation = err instanceof Error && "code" in err && (err as { code?: string }).code === "23505";
      if (!isUniqueViolation) {
        return NextResponse.json({ error: "Failed to save timeline" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ error: "Could not generate a unique link, please try again" }, { status: 500 });
}
