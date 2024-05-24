CREATE TABLE IF NOT EXISTS "cum_bets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"profile_id" uuid NOT NULL,
	"bet_amount" double precision NOT NULL,
	"target_value" double precision NOT NULL,
	"achieved_value" double precision NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cum_bets" ADD CONSTRAINT "cum_bets_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
