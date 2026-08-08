"use client";

import { useEffect, useState } from "react";

type N = { id: number; title: string; body: string; type: string; read: boolean; createdAt?: string };

const color: Record<string, string> = {
  critical: "border-rose-500 bg-rose-50",
  success: "border-emerald-500 bg-emerald-50",
  info: "border-slate-300 bg-white",
};

export default function NotificationsPage() {
  const [items, setItems] = useState<N[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", body: "", type: "info" });

  async function load() {
    const r = await fetch("/api/notifications", { cache: "no-store" });
    if (r.ok) setItems(await r.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function toggleRead(n: N) {
    setItems((s) => s.map((x) => (x.id === n.id ? { ...x, read: !x.read } : x)));
    await fetch(`/api/notifications/${n.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: !n.read }),
    });
  }

  async function remove(n: N) {
    setItems((s) => s.filter((x) => x.id !== n.id));
    await fetch(`/api/notifications/${n.id}`, { method: "DELETE" });
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.body) return;
    const temp = { ...form, id: -Date.now(), read: false } as N;
    setItems((s) => [temp, ...s]);
    setForm({ title: "", body: "", type: "info" });
    const res = await fetch("/api/notifications", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    if (res.ok) {
      const saved = await res.json();
      setItems((s) => s.map((x) => (x.id === temp.id ? saved : x)));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-slate-500">Alerts about critical requests, donors and fulfilments.</p>
      </div>

      <form onSubmit={create} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_2fr_auto_auto]">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Message"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          {["info", "critical", "success"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Broadcast</button>
      </form>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-white" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl bg-white p-14 text-center shadow-sm">
          <div className="text-5xl">🔕</div>
          <p className="mt-3 font-semibold">No notifications</p>
          <p className="text-sm text-slate-500">You&apos;re all caught up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className={`flex flex-wrap items-start justify-between gap-3 rounded-xl border-l-4 p-4 shadow-sm ${color[n.type] ?? color.info} ${n.read ? "opacity-60" : ""}`}>
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-slate-600">{n.body}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleRead(n)} className="rounded-md bg-white px-3 py-1 text-xs font-semibold shadow">
                  {n.read ? "Mark unread" : "Mark read"}
                </button>
                <button onClick={() => remove(n)} className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-rose-600 shadow">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
