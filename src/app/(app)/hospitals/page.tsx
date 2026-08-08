"use client";

import Resource from "@/components/Resource";

export default function HospitalsPage() {
  return (
    <Resource
      title="Hospitals"
      subtitle="Partner hospitals and blood banks in the network."
      endpoint="/api/hospitals"
      emptyIcon="🏥"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "city", label: "City", required: true },
        { key: "address", label: "Address" },
        { key: "phone", label: "Phone" },
        { key: "contactPerson", label: "Contact person" },
        { key: "beds", label: "Beds", type: "number" },
      ]}
    />
  );
}
