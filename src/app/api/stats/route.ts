import { NextResponse } from "next/server";
import { db } from "@/db";
import { donors, hospitals, patients, bloodRequests, notifications } from "@/db/schema";
import { sql, eq, desc } from "drizzle-orm";
import { requireUser } from "@/lib/crud";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const count = async (t: any) => (await db.select({ c: sql<number>`count(*)::int` }).from(t))[0]?.c ?? 0;

  const byGroup = await db
    .select({ bloodGroup: donors.bloodGroup, c: sql<number>`count(*)::int` })
    .from(donors)
    .groupBy(donors.bloodGroup);

  const byStatus = await db
    .select({ status: bloodRequests.status, c: sql<number>`count(*)::int` })
    .from(bloodRequests)
    .groupBy(bloodRequests.status);

  const byCity = await db
    .select({ city: bloodRequests.city, c: sql<number>`count(*)::int` })
    .from(bloodRequests)
    .groupBy(bloodRequests.city);

  const recent = await db.select().from(bloodRequests).orderBy(desc(bloodRequests.id)).limit(6);
  const unread = (
    await db.select({ c: sql<number>`count(*)::int` }).from(notifications).where(eq(notifications.read, false))
  )[0]?.c ?? 0;
  const available = (
    await db.select({ c: sql<number>`count(*)::int` }).from(donors).where(eq(donors.available, true))
  )[0]?.c ?? 0;

  return NextResponse.json({
    donors: await count(donors),
    availableDonors: available,
    hospitals: await count(hospitals),
    patients: await count(patients),
    requests: await count(bloodRequests),
    unread,
    byGroup,
    byStatus,
    byCity,
    recent,
  });
}
