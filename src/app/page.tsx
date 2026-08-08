import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function Home() {
  await ensureSeed();
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-700 via-red-700 to-slate-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xl font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-2xl">🩸</span>
            The Blood Heroes
          </div>
          <Link href="/login" className="rounded-lg bg-white px-5 py-2 font-semibold text-rose-700 hover:bg-rose-50">
            Sign in
          </Link>
        </header>

        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-black leading-tight">Every drop counts. Every hero matters.</h1>
            <p className="text-lg text-white/80">
              TBH connects donors, patients, hospitals and administrators in one platform — real-time blood
              requests, donor matching, reporting and notifications.
            </p>
            <div className="flex gap-3">
              <Link href="/login" className="rounded-lg bg-white px-6 py-3 font-semibold text-rose-700 hover:bg-rose-50">
                Enter dashboard
              </Link>
              <Link href="/login?mode=register" className="rounded-lg border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">
                Become a donor
              </Link>
            </div>
            <p className="text-sm text-white/60">Demo admin: admin@tbh.org / admin123</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["🧑‍🤝‍🧑", "Donor network", "Searchable, filterable donor registry with availability."],
              ["🏥", "Hospitals", "Manage partner facilities and their contacts."],
              ["🚑", "Requests", "Track critical, urgent and normal blood requests."],
              ["📊", "Reports", "Live analytics by blood group, city and status."],
            ].map(([icon, title, body]) => (
              <div key={title} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <div className="text-3xl">{icon}</div>
                <div className="mt-3 font-semibold">{title}</div>
                <p className="mt-1 text-sm text-white/70">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
