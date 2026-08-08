import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq, desc, sql, SQL, and, or, ilike } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { getCurrentUser } from "./auth";
import { ensureSeed } from "./seed";

type AnyTable = PgTable & { id: never };

export async function requireUser() {
  await ensureSeed();
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
}

export function makeCollection(table: any, searchCols: string[], filterCols: string[] = []) {
  return {
    async GET(req: NextRequest) {
      const user = await requireUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const sp = req.nextUrl.searchParams;
      const q = sp.get("q")?.trim();
      const conditions: SQL[] = [];
      if (q && searchCols.length) {
        const parts = searchCols.map((c) => ilike(table[c], `%${q}%`));
        const combined = or(...parts);
        if (combined) conditions.push(combined);
      }
      for (const f of filterCols) {
        const v = sp.get(f);
        if (v && v !== "all") conditions.push(eq(table[f], v));
      }
      const base = db.select().from(table);
      const rows = conditions.length
        ? await base.where(and(...conditions)).orderBy(desc(table.id))
        : await base.orderBy(desc(table.id));
      return NextResponse.json(rows);
    },
    async POST(req: NextRequest) {
      const user = await requireUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const body = await req.json();
      delete body.id;
      const row = ((await db.insert(table).values(body).returning()) as any[])[0];
      return NextResponse.json(row, { status: 201 });
    },
  };
}

export function makeItem(table: any) {
  return {
    async PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
      const user = await requireUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const { id } = await ctx.params;
      const body = await req.json();
      delete body.id;
      delete body.createdAt;
      const row = ((await db.update(table).set(body).where(eq(table.id, Number(id))).returning()) as any[])[0];
      if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(row);
    },
    async DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
      const user = await requireUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const { id } = await ctx.params;
      await db.delete(table).where(eq(table.id, Number(id)));
      return NextResponse.json({ ok: true });
    },
  };
}

export const countAll = async (table: any) => {
  const r = await db.select({ c: sql<number>`count(*)::int` }).from(table);
  return r[0]?.c ?? 0;
};
export type { AnyTable };
