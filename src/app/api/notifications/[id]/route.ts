import { notifications } from "@/db/schema";
import { makeItem } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const { PUT, DELETE } = makeItem(notifications);
