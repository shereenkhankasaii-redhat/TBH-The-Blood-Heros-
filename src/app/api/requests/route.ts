import { bloodRequests } from "@/db/schema";
import { makeCollection } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const { GET, POST } = makeCollection(
  bloodRequests,
  ["patientName", "city", "notes"],
  ["bloodGroup", "status", "urgency", "city"]
);
