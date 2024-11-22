import {
	pgTable,
	serial,
	varchar,
	text,
	boolean,
	index,
	timestamp,
} from "drizzle-orm/pg-core";

export const locations = pgTable(
	"locations",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id").notNull(),
		name: varchar("name", { length: 256 }).notNull(),
		latitude: varchar("latitude", { length: 50 }).notNull(),
		longitude: varchar("longitude", { length: 50 }).notNull(),
		address: varchar("address", { length: 256 }), // Optional, fetched or user-provided
		visited: boolean("visited").default(false).notNull(),
		favorite: boolean("favorite").default(false).notNull(),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(locations) => ({
		userIdIndex: index("user_id_index").on(locations.userId),
	})
);
