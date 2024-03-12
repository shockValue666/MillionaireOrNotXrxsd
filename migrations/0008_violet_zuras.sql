CREATE TABLE IF NOT EXISTS "private_tab" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"user_id" uuid NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "private_tab" ADD CONSTRAINT "private_tab_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
