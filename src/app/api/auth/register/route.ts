import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, donors, notifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, hashPassword } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await ensureSeed();
  const body = await req.json();
  const email = String(body.email || "").toLowerCase().trim();
  if (!email || !body.password || !body.name) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
  }
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const role = ["admin", "member", "donor", "patient", "hospital"].includes(body.role) ? body.role : "member";
  const [u] = await db
    .insert(users)
    .values({ name: body.name, email, passwordHash: hashPassword(String(body.password)), role, phone: body.phone ?? null })
    .returning();

  if (role === "donor" && body.bloodGroup) {
    await db.insert(donors).values({
      name: body.name,
      email,
      phone: body.phone ?? "n/a",
      bloodGroup: body.bloodGroup,
      city: body.city ?? "Unknown",
    });
  }
  await db.insert(notifications).values({
    title: "New account created",
    body: `${body.name} joined The Blood Heroes as ${role}.`,
    type: "info",
  });

  await createSession(u.id);
  return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role }, { status: 201 });
}
