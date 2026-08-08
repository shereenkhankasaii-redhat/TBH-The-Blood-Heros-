import { donors } from "@/db/schema";
import { makeCollection } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const { GET, POST } = makeCollection(donors, ["name", "city", "phone", "email"], ["bloodGroup", "city"]);
