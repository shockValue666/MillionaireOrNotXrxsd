CREATE TABLE IF NOT EXISTS "hook_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"content" text NOT NULL
);
