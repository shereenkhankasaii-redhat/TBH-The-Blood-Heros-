"use client";

import Resource from "@/components/Resource";

const GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function PatientsPage() {
  return (
    <Resource
      title="Patients"
      subtitle="Patients registered in the TBH network and their needs."
      endpoint="/api/patients"
      emptyIcon="🧑‍⚕️"
      defaults={{ bloodGroup: "O+" }}
      filters={[{ key: "bloodGroup", label: "groups", options: GROUPS }]}
      fields={[
        { key: "name", label: "Name", required: true },
        {
          key: "bloodGroup", label: "Blood group", type: "select", options: GROUPS, required: true,
          render: (r) => <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700">{r.bloodGroup}</span>,
        },
        { key: "city", label: "City", required: true },
        { key: "phone", label: "Phone" },
        { key: "condition", label: "Condition" },
        { key: "hospitalId", label: "Hospital ID", type: "number", hideInTable: true },
      ]}
    />
  );
}
