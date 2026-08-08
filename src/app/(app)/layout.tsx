import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  await ensureSeed();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar user={user} />
      <main className="flex-1 bg-slate-50 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
