import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cur = await getCurrentUser();
  if (!cur) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (cur.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const id = Number(body.id || 0);
  const role = String(body.role || "");

  if (!id || !["admin", "member", "donor", "patient", "hospital"].includes(role)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await db.update(users).set({ role }).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}
