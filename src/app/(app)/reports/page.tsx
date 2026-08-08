"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [s, setS] = useState<any>(null);

  useEffect(() => {
    fetch("/api/stats", { cache: "no-store" }).then((r) => r.json()).then(setS);
  }, []);

  if (!s) return <div className="h-64 animate-pulse rounded-xl bg-white" />;

  function exportCsv() {
    const rows = [["metric", "value"], ["donors", s.donors], ["available donors", s.availableDonors],
      ["hospitals", s.hospitals], ["patients", s.patients], ["requests", s.requests],
      ...s.byGroup.map((g: any) => [`donors ${g.bloodGroup}`, g.c]),
      ...s.byStatus.map((g: any) => [`requests ${g.status}`, g.c])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "tbh-report.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const sections: { title: string; data: { label: string; value: number }[] }[] = [
    { title: "Donors by blood group", data: s.byGroup.map((g: any) => ({ label: g.bloodGroup, value: g.c })) },
    { title: "Requests by status", data: s.byStatus.map((g: any) => ({ label: g.status, value: g.c })) },
    { title: "Requests by city", data: s.byCity.map((g: any) => ({ label: g.city, value: g.c })) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-slate-500">Analytics across donors, requests and coverage.</p>
        </div>
        <button onClick={exportCsv} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[["Donors", s.donors], ["Requests", s.requests], ["Fulfilment rate", `${Math.round(((s.byStatus.find((x: any) => x.status === "fulfilled")?.c ?? 0) / Math.max(1, s.requests)) * 100)}%`]].map(([l, v]) => (
          <div key={String(l)} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{l}</p>
            <p className="text-3xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {sections.map((sec) => {
          const max = Math.max(1, ...sec.data.map((d) => d.value));
          return (
            <div key={sec.title} className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{sec.title}</h2>
              {sec.data.length === 0 ? (
                <p className="mt-6 text-center text-sm text-slate-500">No data available.</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {sec.data.map((d) => (
                    <div key={d.label} className="flex items-center gap-3">
                      <span className="w-20 truncate text-xs font-medium text-slate-600">{d.label}</span>
                      <div className="h-3 flex-1 rounded-full bg-slate-100">
                        <div className="h-3 rounded-full bg-rose-500" style={{ width: `${(d.value / max) * 100}%` }} />
                      </div>
                      <span className="w-6 text-right text-sm">{d.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
