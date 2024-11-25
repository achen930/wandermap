CREATE TABLE IF NOT EXISTS "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(256) NOT NULL,
	"latitude" varchar(50) NOT NULL,
	"longitude" varchar(50) NOT NULL,
	"address" varchar(256),
	"visited" boolean DEFAULT false NOT NULL,
	"favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"start_date" date DEFAULT now() NOT NULL,
	"end_date" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_index" ON "locations" USING btree ("user_id");