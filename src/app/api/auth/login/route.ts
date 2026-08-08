import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, verifyPassword } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await ensureSeed();
  const { email, password } = await req.json();
  const rows = await db.select().from(users).where(eq(users.email, String(email).toLowerCase().trim())).limit(1);
  const u = rows[0];
  if (!u || !verifyPassword(String(password), u.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  await createSession(u.id);
  return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role });
}
