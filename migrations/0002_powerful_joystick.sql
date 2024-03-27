CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"coin" text NOT NULL,
	"amount" text NOT NULL,
	"signature" text
);
