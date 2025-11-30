import { usersInAuth } from "@/server/lib/db/schema/auth";
import { pgTable, uuid } from "drizzle-orm/pg-core";

export const idea = pgTable("ideas", {
  id: uuid("id").primaryKey().defaultRandom(),
  owner: uuid("owner")
    .references(() => usersInAuth.id)
    .notNull(),
});
