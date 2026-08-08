"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function LoginInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState(params.get("mode") === "register" ? "register" : "login");
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "donor", phone: "", city: "", bloodGroup: "O+",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200">
        <Link href="/" className="mb-6 flex items-center gap-2 text-lg font-bold text-rose-700">
          <span className="text-2xl">🩸</span> The Blood Heroes
        </Link>
        <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "login" ? "Sign in to your TBH dashboard." : "Join the network and start saving lives."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "register" && (
            <>
              <Field label="Full name" value={form.name} onChange={(v) => set("name", v)} required />
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Role</span>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                  >
                    {["donor", "patient", "hospital", "member", "admin"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Blood group</span>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.bloodGroup}
                    onChange={(e) => set("bloodGroup", e.target.value)}
                  >
                    {GROUPS.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
                <Field label="City" value={form.city} onChange={(v) => set("city", v)} />
              </div>
            </>
          )}
          <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required />
          <Field label="Password" type="password" value={form.password} onChange={(v) => set("password", v)} required />

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-rose-600 py-2.5 font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-sm text-slate-600 hover:text-rose-700"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>

      </div>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-rose-500"
      />
    </label>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
