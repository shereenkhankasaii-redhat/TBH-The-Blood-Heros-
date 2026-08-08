"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = {
  donors: number; availableDonors: number; hospitals: number; patients: number; requests: number; unread: number;
  byGroup: { bloodGroup: string; c: number }[];
  byStatus: { status: string; c: number }[];
  recent: any[];
};

export default function DashboardPage() {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats", { cache: "no-store" }).then((r) => r.json()).then(setS).catch(() => setS(null));
  }, []);

  if (!s) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-white" />)}
      </div>
    );
  }

  const cards = [
    { label: "Total donors", value: s.donors, sub: `${s.availableDonors} available now`, icon: "🧑‍🤝‍🧑", href: "/donors" },
    { label: "Blood requests", value: s.requests, sub: "all time", icon: "🚑", href: "/requests" },
    { label: "Patients", value: s.patients, sub: "registered", icon: "🧑‍⚕️", href: "/patients" },
    { label: "Hospitals", value: s.hospitals, sub: "partners", icon: "🏥", href: "/hospitals" },
  ];

  const maxGroup = Math.max(1, ...s.byGroup.map((g) => g.c));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">Live overview of The Blood Heroes network.</p>
        </div>
        <Link href="/notifications" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-sm">
          🔔 {s.unread} unread
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{c.label}</span>
              <span className="text-xl">{c.icon}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-400">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Donors by blood group</h2>
          <div className="mt-4 space-y-2">
            {s.byGroup.length === 0 && <p className="text-sm text-slate-500">No donor data yet.</p>}
            {s.byGroup.map((g) => (
              <div key={g.bloodGroup} className="flex items-center gap-3">
                <span className="w-10 text-sm font-bold text-rose-700">{g.bloodGroup}</span>
                <div className="h-3 flex-1 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-rose-500" style={{ width: `${(g.c / maxGroup) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-sm text-slate-600">{g.c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Requests by status</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {s.byStatus.map((x) => (
              <div key={x.status} className="rounded-lg bg-slate-50 p-4">
                <p className="text-2xl font-bold">{x.c}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{x.status}</p>
              </div>
            ))}
            {s.byStatus.length === 0 && <p className="text-sm text-slate-500">No requests yet.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent blood requests</h2>
          <Link href="/requests" className="text-sm font-semibold text-rose-600">View all →</Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {s.recent.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No requests yet.</p>}
          {s.recent.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-medium text-slate-800">{r.patientName}</p>
                <p className="text-xs text-slate-500">{r.city} · {r.units} unit(s)</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-rose-100 px-2 py-1 text-rose-700">{r.bloodGroup}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{r.urgency}</span>
                <span className="rounded-full bg-slate-900 px-2 py-1 text-white">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
