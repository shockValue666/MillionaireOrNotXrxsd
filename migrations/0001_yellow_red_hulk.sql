ALTER TABLE "emoji_slot" ADD COLUMN "current_amount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "emoji_slot" ADD COLUMN "current_spin" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "emoji_slot" ADD COLUMN "current_emojis" text DEFAULT '["🤑", "🤑", "🤑", "🤑", "🤑"]' NOT NULL;