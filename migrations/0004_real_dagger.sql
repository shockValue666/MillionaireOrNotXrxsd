CREATE TABLE IF NOT EXISTS "gamble" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"user_id" uuid NOT NULL,
	"amount" text NOT NULL,
	"choice" text NOT NULL,
	"winner" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gamble" ADD CONSTRAINT "gamble_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
