import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { donors, patients, bloodRequests, notifications } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cur = await getCurrentUser();
  if (!cur) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (cur.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  if (!body || body.confirm !== true) {
    return NextResponse.json({ error: "Confirmation required" }, { status: 400 });
  }

  await db.delete(bloodRequests);
  await db.delete(notifications);
  await db.delete(donors);
  await db.delete(patients);

  return NextResponse.json({ ok: true });
}
