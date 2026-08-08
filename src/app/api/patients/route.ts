import { patients } from "@/db/schema";
import { makeCollection } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const { GET, POST } = makeCollection(patients, ["name", "city", "condition"], ["bloodGroup", "city"]);
