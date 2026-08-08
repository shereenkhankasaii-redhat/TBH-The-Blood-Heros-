import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
