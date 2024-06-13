ALTER TABLE "new_copy_trading_coins_of_owners" ADD COLUMN "total_amount_bought_in_sol" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "new_copy_trading_coins_of_owners" ADD COLUMN "total_amount_sold_in_sol" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "new_copy_trading_coins_of_owners" ADD COLUMN "total_amount_bought_in_usdc" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "new_copy_trading_coins_of_owners" ADD COLUMN "total_amount_sold_in_usdc" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "new_copy_trading_transaction" ADD COLUMN "amount_bought_in_sol" double precision;--> statement-breakpoint
ALTER TABLE "new_copy_trading_transaction" ADD COLUMN "amount_sold_in_sol" double precision;--> statement-breakpoint
ALTER TABLE "new_copy_trading_transaction" ADD COLUMN "amount_bought_in_usdc" double precision;--> statement-breakpoint
ALTER TABLE "new_copy_trading_transaction" ADD COLUMN "amount_sold_in_usdc" double precision;--> statement-breakpoint
ALTER TABLE "new_copy_trading_coins_of_owners" DROP COLUMN IF EXISTS "token_amount";--> statement-breakpoint
ALTER TABLE "new_copy_trading_coins_of_owners" DROP COLUMN IF EXISTS "current_price_of_position";--> statement-breakpoint
ALTER TABLE "new_copy_trading_transaction" DROP COLUMN IF EXISTS "price_bought";--> statement-breakpoint
ALTER TABLE "new_copy_trading_transaction" DROP COLUMN IF EXISTS "price_sold";