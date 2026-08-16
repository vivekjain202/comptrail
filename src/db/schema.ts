import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { CompEntry } from "@/lib/types";

export const timelines = pgTable("timelines", {
  slug: text("slug").primaryKey(),
  editToken: text("edit_token").notNull(),
  title: text("title").notNull().default("Salary Progression"),
  note: text("note").notNull().default(""),
  currency: text("currency").notNull().default("USD"),
  entries: jsonb("entries").notNull().$type<CompEntry[]>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TimelineRow = typeof timelines.$inferSelect;
