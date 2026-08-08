import { db } from "@/db";
import { users, donors, hospitals, patients, bloodRequests, notifications } from "@/db/schema";
import { hashPassword } from "./auth";
import { sql } from "drizzle-orm";

let seeded = false;

export async function ensureSeed() {
  if (seeded) return;
  const existing = await db.select({ c: sql<number>`count(*)::int` }).from(users);
  if ((existing[0]?.c ?? 0) > 0) {
    seeded = true;
    return;
  }

  await db.insert(users).values([
    { name: "Admin Hero", email: "admin@tbh.org", passwordHash: hashPassword("admin123"), role: "admin", phone: "+1 555 0100" },
    { name: "Maya Patel", email: "member@tbh.org", passwordHash: hashPassword("member123"), role: "member", phone: "+1 555 0111" },
    { name: "Dr. Liam Ross", email: "hospital@tbh.org", passwordHash: hashPassword("hospital123"), role: "hospital", phone: "+1 555 0122" },
  ]);

  const hosp = await db
    .insert(hospitals)
    .values([
      { name: "St. Mary General Hospital", city: "Austin", address: "120 Cedar St", phone: "+1 512 220 3311", contactPerson: "Dr. Liam Ross", beds: 420 },
      { name: "Riverside Medical Center", city: "Denver", address: "88 River Rd", phone: "+1 303 771 9922", contactPerson: "Dr. Ana Cruz", beds: 260 },
      { name: "Northlake Children's Hospital", city: "Seattle", address: "5 Lakeview Ave", phone: "+1 206 553 8080", contactPerson: "Dr. Kim Yu", beds: 180 },
    ])
    .returning();

  const groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const cities = ["Austin", "Denver", "Seattle", "Chicago", "Miami"];
  const names = [
    "Noah Bennett", "Olivia Hayes", "Ethan Brooks", "Ava Sinclair", "Lucas Moore", "Mia Torres",
    "James Whitfield", "Sofia Rivera", "Henry Cole", "Isabella Nguyen", "Jack Sullivan", "Amelia Ford",
  ];
  await db.insert(donors).values(
    names.map((n, i) => ({
      name: n,
      email: n.toLowerCase().replace(/[^a-z]/g, ".") + "@mail.com",
      phone: `+1 555 01${(20 + i).toString().padStart(2, "0")}`,
      bloodGroup: groups[i % groups.length],
      city: cities[i % cities.length],
      age: 22 + (i * 3) % 30,
      available: i % 4 !== 0,
      lastDonation: `2025-${String((i % 12) + 1).padStart(2, "0")}-1${i % 9}`,
      totalDonations: (i * 2) % 11,
    }))
  );

  await db.insert(patients).values([
    { name: "Grace Miller", bloodGroup: "O-", phone: "+1 555 0301", city: "Austin", hospitalId: hosp[0].id, condition: "Post-surgery anemia" },
    { name: "Daniel Ortiz", bloodGroup: "B+", phone: "+1 555 0302", city: "Denver", hospitalId: hosp[1].id, condition: "Thalassemia" },
    { name: "Ruby Chen", bloodGroup: "A+", phone: "+1 555 0303", city: "Seattle", hospitalId: hosp[2].id, condition: "Leukemia treatment" },
  ]);

  await db.insert(bloodRequests).values([
    { patientName: "Grace Miller", bloodGroup: "O-", units: 3, urgency: "critical", status: "pending", hospitalId: hosp[0].id, city: "Austin", notes: "Needed within 6 hours" },
    { patientName: "Daniel Ortiz", bloodGroup: "B+", units: 2, urgency: "urgent", status: "approved", hospitalId: hosp[1].id, city: "Denver", notes: "Monthly transfusion" },
    { patientName: "Ruby Chen", bloodGroup: "A+", units: 1, urgency: "normal", status: "fulfilled", hospitalId: hosp[2].id, city: "Seattle" },
    { patientName: "Owen Fisher", bloodGroup: "AB-", units: 2, urgency: "urgent", status: "pending", hospitalId: hosp[0].id, city: "Austin" },
  ]);

  await db.insert(notifications).values([
    { title: "Critical request: O-", body: "Grace Miller needs 3 units of O- at St. Mary General Hospital.", type: "critical" },
    { title: "New donor registered", body: "Amelia Ford joined the Austin donor network.", type: "info" },
    { title: "Request fulfilled", body: "Ruby Chen's A+ request was fulfilled successfully.", type: "success", read: true },
  ]);

  seeded = true;
}
