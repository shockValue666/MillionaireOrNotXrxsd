ALTER TABLE "emoji_slot" ALTER COLUMN "amount" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "emoji_slot" ALTER COLUMN "current_amount" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "emoji_slot" ADD COLUMN "entry_amount" double precision NOT NULL;