DROP INDEX IF EXISTS "user_id_index";--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_index" ON "locations" USING btree ("user_id");