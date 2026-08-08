import { hospitals } from "@/db/schema";
import { makeCollection } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const { GET, POST } = makeCollection(hospitals, ["name", "city", "contactPerson"], ["city"]);
