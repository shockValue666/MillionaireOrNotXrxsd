CREATE TABLE IF NOT EXISTS "fee_received_transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"amount" double precision NOT NULL,
	"profile_id" uuid NOT NULL,
	"fee" double precision NOT NULL,
	"transaction_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fee_received_transaction" ADD CONSTRAINT "fee_received_transaction_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fee_received_transaction" ADD CONSTRAINT "fee_received_transaction_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
