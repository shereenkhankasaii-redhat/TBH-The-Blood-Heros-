"use client";

import Resource from "@/components/Resource";

const GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const STATUS = ["pending", "approved", "fulfilled", "rejected"];
const URGENCY = ["critical", "urgent", "normal"];

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  fulfilled: "bg-emerald-100 text-emerald-700",
  rejected: "bg-slate-200 text-slate-600",
};
const urgencyColor: Record<string, string> = {
  critical: "bg-rose-600 text-white",
  urgent: "bg-orange-100 text-orange-700",
  normal: "bg-slate-100 text-slate-600",
};

export default function RequestsPage() {
  return (
    <Resource
      title="Blood Requests"
      subtitle="Track and manage incoming blood requests from patients and hospitals."
      endpoint="/api/requests"
      emptyIcon="🚑"
      defaults={{ status: "pending", urgency: "normal", units: 1, bloodGroup: "O+" }}
      filters={[
        { key: "status", label: "statuses", options: STATUS },
        { key: "urgency", label: "urgency", options: URGENCY },
        { key: "bloodGroup", label: "groups", options: GROUPS },
      ]}
      fields={[
        { key: "patientName", label: "Patient", required: true },
        {
          key: "bloodGroup", label: "Blood group", type: "select", options: GROUPS, required: true,
          render: (r) => <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700">{r.bloodGroup}</span>,
        },
        { key: "units", label: "Units", type: "number" },
        {
          key: "urgency", label: "Urgency", type: "select", options: URGENCY,
          render: (r) => <span className={`rounded-full px-2 py-1 text-xs font-semibold ${urgencyColor[r.urgency] ?? ""}`}>{r.urgency}</span>,
        },
        {
          key: "status", label: "Status", type: "select", options: STATUS,
          render: (r) => <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor[r.status] ?? ""}`}>{r.status}</span>,
        },
        { key: "city", label: "City", required: true },
        { key: "hospitalId", label: "Hospital ID", type: "number", hideInTable: true },
        { key: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  );
}
