"use client";

import Resource from "@/components/Resource";

const GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const CITIES = ["Austin", "Denver", "Seattle", "Chicago", "Miami"];

export default function DonorsPage() {
  return (
    <Resource
      title="Donors"
      subtitle="Manage the donor registry, availability and donation history."
      endpoint="/api/donors"
      emptyIcon="🧑‍🤝‍🧑"
      defaults={{ available: true, bloodGroup: "O+", totalDonations: 0 }}
      filters={[
        { key: "bloodGroup", label: "groups", options: GROUPS },
        { key: "city", label: "cities", options: CITIES },
      ]}
      fields={[
        { key: "name", label: "Name", required: true },
        {
          key: "bloodGroup", label: "Blood group", type: "select", options: GROUPS, required: true,
          render: (r) => <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700">{r.bloodGroup}</span>,
        },
        { key: "city", label: "City", required: true },
        { key: "phone", label: "Phone", required: true },
        { key: "email", label: "Email" },
        { key: "age", label: "Age", type: "number" },
        { key: "totalDonations", label: "Donations", type: "number" },
        { key: "lastDonation", label: "Last donation" },
        {
          key: "available", label: "Available", type: "checkbox",
          render: (r) => (
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${r.available ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {r.available ? "Available" : "Unavailable"}
            </span>
          ),
        },
      ]}
    />
  );
}
