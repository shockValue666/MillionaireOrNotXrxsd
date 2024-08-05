import { pgTable, pgEnum, text, timestamp, integer, unique, uuid, doublePrecision, foreignKey, jsonb, boolean, bigint } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const pricingType = pgEnum("pricing_type", ['one_time', 'recurring'])
export const pricingPlanInterval = pgEnum("pricing_plan_interval", ['day', 'week', 'month', 'year'])
export const subscriptionStatus = pgEnum("subscription_status", ['trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const oneTimeTokenType = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])


export const poolKeys = pgTable("pool_keys", {
	id: text("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	baseMint: text("base_mint").notNull(),
	quoteMint: text("quote_mint").notNull(),
	lpMint: text("lp_mint").notNull(),
	baseDecimals: integer("base_decimals").notNull(),
	quoteDecimals: integer("quote_decimals").notNull(),
	lpDecimals: integer("lp_decimals").notNull(),
	version: integer("version").notNull(),
	programId: text("program_id").notNull(),
	authority: text("authority").notNull(),
	baseVault: text("base_vault").notNull(),
	quoteVault: text("quote_vault").notNull(),
	openOrders: text("open_orders").notNull(),
	targetOrder: text("target_order").notNull(),
	withdrawalQueue: text("withdrawal_queue").notNull(),
	lpVault: text("lp_vault").notNull(),
	marketVersion: integer("market_version").notNull(),
	marketProgramId: text("market_program_id").notNull(),
	marketId: text("market_id").notNull(),
	marketAuthority: text("market_authority").notNull(),
	marketBaseVault: text("market_base_vault").notNull(),
	marketQuoteVault: text("market_quote_vault").notNull(),
	marketBids: text("market_bids").notNull(),
	marketAsks: text("market_asks").notNull(),
	marketEventQueue: text("market_event_queue").notNull(),
});

export const profiles = pgTable("profiles", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	username: text("username").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	avatar: text("avatar"),
	address: text("address").notNull(),
	balance: text("balance"),
	realBalance: text("real_balance"),
	calculatedBalance: text("calculated_balance"),
	points: doublePrecision("points").notNull(),
	pnl: doublePrecision("pnl").notNull(),
	solBalance: doublePrecision("sol_balance"),
},
(table) => {
	return {
		profilesUsernameUnique: unique("profiles_username_unique").on(table.username),
		profilesEmailUnique: unique("profiles_email_unique").on(table.email),
	}
});

export const newShit = pgTable("new_shit", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: doublePrecision("amount"),
	spinz: integer("spinz"),
	currentAmount: doublePrecision("current_amount"),
	currentSpin: integer("current_spin").default(0),
});

export const notifications = pgTable("notifications", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	message: text("message").notNull(),
	read: text("read").default('false').notNull(),
});

export const trannies = pgTable("trannies", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	signature: text("signature"),
});

export const achievements = pgTable("achievements", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	name: text("name").notNull(),
	description: text("description"),
});

export const coins = pgTable("coins", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	name: text("name").notNull(),
	symbol: text("symbol").notNull(),
	price: text("price").notNull(),
},
(table) => {
	return {
		coinsSymbolUnique: unique("coins_symbol_unique").on(table.symbol),
	}
});

export const users = pgTable("users", {
	id: uuid("id").primaryKey().notNull(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	billingAddress: jsonb("billing_address"),
	paymentMethod: jsonb("payment_method"),
},
(table) => {
	return {
		usersIdFkey: foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "users_id_fkey"
		}),
	}
});

export const doubleEmojiSlots = pgTable("double_emoji_slots", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: doublePrecision("amount").notNull(),
	spinz: integer("spinz").notNull(),
	currentAmount: doublePrecision("current_amount").notNull(),
	currentSpin: integer("current_spin").default(0).notNull(),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	currentEmojisNew: text("current_emojis_new").default('["🤑", "🤑", "🤑", "🤑", "🤑"]').notNull(),
	payPerSpin: doublePrecision("pay_per_spin").notNull(),
	entryAmount: doublePrecision("entry_amount").notNull(),
	pnl: doublePrecision("pnl").notNull(),
	points: doublePrecision("points").notNull(),
});

export const customers = pgTable("customers", {
	id: uuid("id").primaryKey().notNull().references(() => users.id).references(() => users.id),
	stripeCustomerId: text("stripe_customer_id"),
});

export const prices = pgTable("prices", {
	id: text("id").primaryKey().notNull(),
	productId: text("product_id").references(() => products.id).references(() => products.id),
	active: boolean("active"),
	description: text("description"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	unitAmount: bigint("unit_amount", { mode: "number" }),
	currency: text("currency"),
	type: pricingType("type"),
	interval: pricingPlanInterval("interval"),
	intervalCount: integer("interval_count"),
	trialPeriodDays: integer("trial_period_days"),
	metadata: jsonb("metadata"),
});

export const products = pgTable("products", {
	id: text("id").primaryKey().notNull(),
	active: boolean("active"),
	name: text("name"),
	description: text("description"),
	image: text("image"),
	metadata: jsonb("metadata"),
});

export const subscriptions = pgTable("subscriptions", {
	id: text("id").primaryKey().notNull(),
	userId: uuid("user_id").notNull().references(() => users.id).references(() => users.id),
	status: subscriptionStatus("status"),
	metadata: jsonb("metadata"),
	priceId: text("price_id").references(() => prices.id).references(() => prices.id),
	quantity: integer("quantity"),
	cancelAtPeriodEnd: boolean("cancel_at_period_end"),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).default(sql`now`).notNull(),
	currentPeriodStart: timestamp("current_period_start", { withTimezone: true, mode: 'string' }).default(sql`now`).notNull(),
	currentPeriodEnd: timestamp("current_period_end", { withTimezone: true, mode: 'string' }).default(sql`now`).notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }).default(sql`now`),
	cancelAt: timestamp("cancel_at", { withTimezone: true, mode: 'string' }).default(sql`now`),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }).default(sql`now`),
	trialStart: timestamp("trial_start", { withTimezone: true, mode: 'string' }).default(sql`now`),
	trialEnd: timestamp("trial_end", { withTimezone: true, mode: 'string' }).default(sql`now`),
});

export const gamble = pgTable("gamble", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	amount: text("amount").notNull(),
	choice: text("choice").notNull(),
	winner: text("winner").notNull(),
	status: boolean("status").notNull(),
	localBalance: doublePrecision("local_balance").notNull(),
});

export const swapper = pgTable("swapper", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	balance: doublePrecision("balance"),
	address: text("address"),
});

export const privateTab = pgTable("private_tab", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	publicKey: text("public_key").notNull(),
	privateKey: text("private_key").notNull(),
	balance: doublePrecision("balance").notNull(),
});

export const tripleEmojiSlots = pgTable("triple_emoji_slots", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: doublePrecision("amount").notNull(),
	spinz: integer("spinz").notNull(),
	currentAmount: doublePrecision("current_amount").notNull(),
	currentSpin: integer("current_spin").default(0).notNull(),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	currentEmojisNewer: text("current_emojis_newer").default('["🤑", "🤑", "🤑", "🤑", "🤑"]').notNull(),
	payPerSpin: doublePrecision("pay_per_spin").notNull(),
	entryAmount: doublePrecision("entry_amount").notNull(),
	pnl: doublePrecision("pnl").notNull(),
	points: doublePrecision("points").notNull(),
});

export const hookTransactions = pgTable("hook_transactions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	content: text("content").notNull(),
});

export const copyTradingTransactions = pgTable("copyTradingTransactions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	fromToken: text("from_token"),
	toToken: text("to_token"),
	toAmount: doublePrecision("to_amount"),
	fromAmount: doublePrecision("from_amount"),
});

export const cumBets = pgTable("cum_bets", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	betAmount: doublePrecision("bet_amount").notNull(),
	targetValue: doublePrecision("target_value").notNull(),
	achievedValue: doublePrecision("achieved_value").notNull(),
	status: text("status").default('pending').notNull(),
	description: text("description").notNull(),
	cumBetBalance: doublePrecision("cum_bet_balance"),
});

export const transactions = pgTable("transactions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	from: text("from").notNull(),
	to: text("to").notNull(),
	coin: text("coin").notNull(),
	amount: text("amount").notNull(),
	signature: text("signature"),
	status: text("status").notNull(),
});

export const emojiSlot = pgTable("emoji_slot", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: doublePrecision("amount").notNull(),
	spinz: integer("spinz").notNull(),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	currentAmount: doublePrecision("current_amount").notNull(),
	currentSpin: integer("current_spin").default(0).notNull(),
	currentEmojis: text("current_emojis").default('["🤑", "🤑", "🤑", "🤑", "🤑"]').notNull(),
	payPerSpin: doublePrecision("pay_per_spin").notNull(),
	entryAmount: doublePrecision("entry_amount").notNull(),
	pnl: doublePrecision("pnl").notNull(),
	points: doublePrecision("points").notNull(),
});

export const newCopyTradingAddresses = pgTable("new_copy_trading_addresses", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	swapperAddress: text("swapper_address").notNull(),
	description: text("description").notNull(),
	pnl: doublePrecision("pnl"),
});

export const ads = pgTable("ads", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	amount: doublePrecision("amount").notNull(),
	views: integer("views").notNull(),
	clicks: integer("clicks").notNull(),
	website: text("website").notNull(),
	image: text("image").notNull(),
	description: text("description").notNull(),
	payPerView: doublePrecision("pay_per_view").notNull(),
	payPerClick: doublePrecision("pay_per_click").notNull(),
	title: text("title").notNull(),
});

export const newCopyTradingCoinsOfOwners = pgTable("new_copy_trading_coins_of_owners", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	tokenSymbol: text("token_symbol").notNull(),
	tokenMint: text("token_mint").notNull(),
	owner: uuid("owner").notNull().references(() => newCopyTradingAddresses.id, { onDelete: "cascade" } ),
	totalAmountBoughtInSol: doublePrecision("total_amount_bought_in_sol").notNull(),
	totalAmountSoldInSol: doublePrecision("total_amount_sold_in_sol").notNull(),
	totalAmountBoughtInUsdc: doublePrecision("total_amount_bought_in_usdc").notNull(),
	totalAmountSoldInUsdc: doublePrecision("total_amount_sold_in_usdc").notNull(),
	tokenAmount: doublePrecision("token_amount").notNull(),
});

export const newCopyTradingTransaction = pgTable("new_copy_trading_transaction", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	swapperAddress: text("swapper_address").notNull(),
	tokenInSymbol: text("token_in_symbol").notNull(),
	tokenInAmount: text("token_in_amount").notNull(),
	tokenInMint: text("token_in_mint").notNull(),
	tokenOutSymbol: text("token_out_symbol").notNull(),
	tokenOutAmount: text("token_out_amount").notNull(),
	tokenOutMint: text("token_out_mint").notNull(),
	pricePerToken: doublePrecision("price_per_token").notNull(),
	swapDescription: text("swap_description").notNull(),
	txId: text("tx_id"),
	type: text("type").default('none'),
	swapperAddressId: uuid("swapper_address_id").references(() => newCopyTradingAddresses.id, { onDelete: "cascade" } ),
	currentSolPrice: doublePrecision("current_sol_price"),
	tokenId: uuid("token_id").references(() => newCopyTradingCoinsOfOwners.id, { onDelete: "cascade" } ),
	typeOfSwap: text("type_of_swap").default('none'),
	amountBoughtInSol: doublePrecision("amount_bought_in_sol"),
	amountSoldInSol: doublePrecision("amount_sold_in_sol"),
	amountBoughtInUsdc: doublePrecision("amount_bought_in_usdc"),
	amountSoldInUsdc: doublePrecision("amount_sold_in_usdc"),
});

export const bets = pgTable("bets", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	betAmount: doublePrecision("bet_amount").notNull(),
	targetValue: doublePrecision("target_value").notNull(),
	achievedValue: doublePrecision("achieved_value").notNull(),
	status: text("status").default('pending').notNull(),
	description: text("description").notNull(),
});

export const serverTransactions = pgTable("server_transactions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	sentToSwapper: boolean("sent_to_swapper").default(false),
	amountSentToSwapperInSol: doublePrecision("amount_sent_to_swapper_in_sol"),
	sendSolToSwapperSignature: text("send_sol_to_swapper_signature"),
	swappedToUsdcInSwapper: boolean("swapped_to_usdc_in_swapper").default(false),
	usdcAmount: doublePrecision("usdc_amount"),
	swapSolToUsdcSignature: text("swap_sol_to_usdc_signature"),
	userId: uuid("user_id").defaultRandom().references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	type: text("type"),
	sendToUserWalletSignature: text("send_to_user_wallet_signature"),
});

export const feeReceivedTransaction = pgTable("fee_received_transaction", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: doublePrecision("amount").notNull(),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	fee: doublePrecision("fee").notNull(),
	transactionId: uuid("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" } ),
	signature: text("signature").notNull(),
});

export const usersForDashboard = pgTable("users_for_dashboard", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	name: text("name").notNull(),
});

export const dexScreenerPair = pgTable("dex_screener_pair", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	baseTokenAddress: text("base_token_address"),
	baseTokenSymbol: text("base_token_symbol"),
	baseTokenName: text("base_token_name"),
	fdv: doublePrecision("fdv"),
	imageUrl: text("image_url"),
	twitter: text("twitter"),
	telegram: text("telegram"),
	website: text("website"),
	baseLiquidity: doublePrecision("base_liquidity"),
	quoteLiquidity: doublePrecision("quote_liquidity"),
	usdLiquidity: doublePrecision("usd_liquidity"),
	pairAddress: text("pair_address"),
	pairCreatedAt: timestamp("pair_created_at", { withTimezone: true, mode: 'string' }),
	priceChangeH1: doublePrecision("price_change_h1"),
	priceChangeH6: doublePrecision("price_change_h6"),
	priceChangeH24: doublePrecision("price_change_h24"),
	priceChange5m: doublePrecision("price_change_5m"),
	priceNative: doublePrecision("price_native"),
	priceUsd: doublePrecision("price_usd"),
	quoteTokenAddress: text("quote_token_address"),
	quoteTokenSymbol: text("quote_token_symbol"),
	quoteTokenName: text("quote_token_name"),
	txnsH1: text("txns_h1"),
	txnsH6: text("txns_h6"),
	txnsH24: text("txns_h24"),
	txns5m: text("txns_5m"),
	volumeH1: doublePrecision("volume_h1"),
	volumeH6: doublePrecision("volume_h6"),
	volumeH24: doublePrecision("volume_h24"),
	volume5m: doublePrecision("volume_5m"),
});