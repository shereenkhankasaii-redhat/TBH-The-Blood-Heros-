import { notifications } from "@/db/schema";
import { makeCollection } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const { GET, POST } = makeCollection(notifications, ["title", "body"], ["type"]);
