import { donors } from "@/db/schema";
import { makeItem } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const { PUT, DELETE } = makeItem(donors);
