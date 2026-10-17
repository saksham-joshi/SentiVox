import { pgTable, index, pgPolicy, check, varchar, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	email: varchar({ length: 256 }).notNull(),
	fullName: varchar("full_name", { length: 32 }).notNull(),
	apiKey: varchar("api_key", { length: 256 }).notNull(),
	joinDate: timestamp("join_date", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	apiKeyUpdateTime: timestamp("api_key_update_time", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("api_key_index").using("btree", table.apiKey.asc().nullsLast().op("text_ops")),
	index("email_index").using("btree", table.email.asc().nullsLast().op("text_ops")),
	pgPolicy("No hard deletes", { as: "permissive", for: "delete", to: ["public"], using: sql`false` }),
	pgPolicy("Site role can insert in Users", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Site role can select from Users", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Site role can update Users", { as: "permissive", for: "update", to: ["public"] }),
	check("valid_api_key", sql`length((api_key)::text) = 128`),
	check("valid_email", sql`(email)::text ~ '^[A-Za-z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$'::text`),
	check("valid_full_name", sql`(length((full_name)::text) >= 3) AND (length((full_name)::text) <= 31)`),
]);
