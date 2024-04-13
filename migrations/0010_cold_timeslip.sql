CREATE TABLE IF NOT EXISTS "double_emoji_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"amount" double precision NOT NULL,
	"spinz" integer NOT NULL,
	"current_amount" double precision DEFAULT 0 NOT NULL,
	"current_spin" integer DEFAULT 0 NOT NULL,
	"profile_id" uuid NOT NULL,
	"current_emojis" text DEFAULT '["🤑", "🤑", "🤑", "🤑", "🤑"]' NOT NULL,
	"pay_per_spin" double precision NOT NULL,
	"entry_amount" double precision NOT NULL,
	"pnl" double precision DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "double_emoji_slots" ADD CONSTRAINT "double_emoji_slots_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
