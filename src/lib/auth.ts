import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.AUTH_SECRET ?? "tbh-dev-secret";

export function hashPassword(password: string, salt?: string) {
  const s = salt ?? crypto.randomBytes(12).toString("hex");
  const h = crypto.scryptSync(password, s, 32).toString("hex");
  return `${s}:${h}`;
}

export function verifyPassword(password: string, stored: string) {
  const [s] = stored.split(":");
  return hashPassword(password, s) === stored;
}

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function createSession(userId: number) {
  const value = String(userId);
  const token = `${value}.${sign(value)}`;
  const store = await cookies();
  store.set("tbh_session", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
}

export async function destroySession() {
  const store = await cookies();
  store.delete("tbh_session");
}

export type SessionUser = { id: number; name: string; email: string; role: string };

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get("tbh_session")?.value;
  if (!token) return null;
  const [value, sig] = token.split(".");
  if (!value || sig !== sign(value)) return null;
  const rows = await db.select().from(users).where(eq(users.id, Number(value))).limit(1);
  const u = rows[0];
  if (!u) return null;
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}
