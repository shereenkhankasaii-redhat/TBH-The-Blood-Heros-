"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "select" | "checkbox" | "textarea";
  options?: string[];
  required?: boolean;
  hideInTable?: boolean;
  render?: (row: any) => React.ReactNode;
};

export type FilterDef = { key: string; label: string; options: string[] };

type Props = {
  title: string;
  subtitle: string;
  endpoint: string;
  fields: FieldDef[];
  filters?: FilterDef[];
  emptyIcon?: string;
  defaults?: Record<string, any>;
};

export default function Resource({ title, subtitle, endpoint, fields, filters = [], emptyIcon = "📄", defaults = {} }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<any | null>(null);
  const [toast, setToast] = useState("");

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    Object.entries(active).forEach(([k, v]) => v && v !== "all" && sp.set(k, v));
    return sp.toString();
  }, [q, active]);

  const load = useCallback(async () => {
    const res = await fetch(`${endpoint}?${query}`, { cache: "no-store" });
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }, [endpoint, query]);

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [load]);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function save(data: any) {
    const isEdit = Boolean(data.id);
    const tempId = data.id ?? -Date.now();
    setRows((r) => (isEdit ? r.map((x) => (x.id === data.id ? { ...x, ...data } : x)) : [{ ...data, id: tempId }, ...r]));
    setEditing(null);
    const res = await fetch(isEdit ? `${endpoint}/${data.id}` : endpoint, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      notify("Save failed");
      load();
      return;
    }
    const saved = await res.json();
    setRows((r) => r.map((x) => (x.id === tempId ? saved : x)));
    notify(isEdit ? "Changes saved" : "Created successfully");
  }

  async function remove(row: any) {
    if (!confirm(`Delete "${row[fields[0].key]}"?`)) return;
    const prev = rows;
    setRows((r) => r.filter((x) => x.id !== row.id));
    const res = await fetch(`${endpoint}/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      setRows(prev);
      notify("Delete failed");
    } else notify("Deleted");
  }

  const cols = fields.filter((f) => !f.hideInTable);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <button
          onClick={() => setEditing({ ...defaults })}
          className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          + New
        </button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow-sm">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="min-w-[200px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-500"
        />
        {filters.map((f) => (
          <select
            key={f.key}
            value={active[f.key] ?? "all"}
            onChange={(e) => setActive((a) => ({ ...a, [f.key]: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All {f.label}</option>
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => <div key={i} className="h-8 animate-pulse rounded bg-slate-100" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-14 text-center">
            <div className="text-5xl">{emptyIcon}</div>
            <p className="mt-3 font-semibold text-slate-700">Nothing here yet</p>
            <p className="text-sm text-slate-500">Try adjusting filters or create a new record.</p>
            <button onClick={() => setEditing({ ...defaults })} className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
              Create the first one
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {cols.map((c) => <th key={c.key} className="px-4 py-3">{c.label}</th>)}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    {cols.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-slate-700">
                        {c.render ? c.render(row) : c.type === "checkbox" ? (row[c.key] ? "Yes" : "No") : String(row[c.key] ?? "—")}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button onClick={() => setEditing(row)} className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200">Edit</button>
                      <button onClick={() => remove(row)} className="rounded-md px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && <FormModal fields={fields} initial={editing} onClose={() => setEditing(null)} onSave={save} title={title} />}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}

function FormModal({ fields, initial, onClose, onSave, title }: {
  fields: FieldDef[]; initial: any; onClose: () => void; onSave: (d: any) => void; title: string;
}) {
  const [data, setData] = useState<any>({ ...initial });
  const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold">{data.id ? "Edit" : "New"} {title.replace(/s$/, "")}</h2>
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const payload: any = { ...data };
            fields.forEach((f) => {
              if (f.type === "number") payload[f.key] = payload[f.key] === "" || payload[f.key] == null ? null : Number(payload[f.key]);
              if (f.type === "checkbox") payload[f.key] = Boolean(payload[f.key]);
            });
            onSave(payload);
          }}
        >
          {fields.map((f) => (
            <label key={f.key} className={`block text-sm ${f.type === "textarea" ? "sm:col-span-2" : ""}`}>
              <span className="mb-1 block font-medium text-slate-700">{f.label}</span>
              {f.type === "select" ? (
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2" value={data[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                  <option value="">—</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === "checkbox" ? (
                <input type="checkbox" className="h-5 w-5 accent-rose-600" checked={Boolean(data[f.key])} onChange={(e) => set(f.key, e.target.checked)} />
              ) : f.type === "textarea" ? (
                <textarea rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2" value={data[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
              ) : (
                <input
                  type={f.type === "number" ? "number" : "text"}
                  required={f.required}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-rose-500"
                  value={data[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
            </label>
          ))}
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
            <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
