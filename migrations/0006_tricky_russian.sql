CREATE TABLE IF NOT EXISTS "ads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"profile_id" uuid NOT NULL,
	"amount" double precision NOT NULL,
	"views" integer NOT NULL,
	"clicks" integer NOT NULL,
	"website" text NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	"pay_per_view" double precision NOT NULL,
	"pay_per_click" double precision NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ads" ADD CONSTRAINT "ads_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
