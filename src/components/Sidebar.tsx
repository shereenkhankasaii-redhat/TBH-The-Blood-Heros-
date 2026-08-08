"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/donors", label: "Donors", icon: "🧑‍🤝‍🧑" },
  { href: "/requests", label: "Blood Requests", icon: "🚑" },
  { href: "/patients", label: "Patients", icon: "🧑‍⚕️" },
  { href: "/hospitals", label: "Hospitals", icon: "🏥" },
  { href: "/reports", label: "Reports", icon: "📈" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
];

export default function Sidebar({ user }: { user: { name: string; email: string; role: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const nav = (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-rose-600 text-white shadow" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white lg:hidden">
        <span className="font-bold">🩸 TBH</span>
        <button onClick={() => setOpen(!open)} className="rounded-md bg-white/10 px-3 py-1.5 text-sm">
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && <div className="bg-slate-900 px-4 pb-4 text-white lg:hidden">{nav}</div>}

      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-slate-900 p-5 text-white lg:flex">
        <div>
          <Link href="/dashboard" className="mb-8 flex items-center gap-2 text-lg font-bold">
            <span className="text-2xl">🩸</span>
            <span>
              The Blood Heroes
              <span className="block text-xs font-normal text-slate-400">TBH Platform</span>
            </span>
          </Link>
          {nav}
        </div>
        <div className="space-y-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-rose-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-300">
              {user.role}
            </span>
          </div>
          <button onClick={logout} className="w-full rounded-lg bg-white/10 py-2 text-sm hover:bg-white/20">
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
