//NOTE: idk i just copied the web/migrations/schema.ts file it may work better with type safety
import { pgTable, unique, pgEnum, uuid, timestamp, text, foreignKey, jsonb, boolean, bigint, integer, doublePrecision } from "drizzle-orm/pg-core"
  import { desc, sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['expired', 'invalid', 'valid', 'default'])
export const keyType = pgEnum("key_type", ['stream_xchacha20', 'secretstream', 'secretbox', 'kdf', 'generichash', 'shorthash', 'auth', 'hmacsha256', 'hmacsha512', 'aead-det', 'aead-ietf'])
export const factorStatus = pgEnum("factor_status", ['verified', 'unverified'])
export const factorType = pgEnum("factor_type", ['webauthn', 'totp'])
export const aalLevel = pgEnum("aal_level", ['aal3', 'aal2', 'aal1'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['plain', 's256'])
export const pricingType = pgEnum("pricing_type", ['recurring', 'one_time'])
export const pricingPlanInterval = pgEnum("pricing_plan_interval", ['year', 'month', 'week', 'day'])
export const subscriptionStatus = pgEnum("subscription_status", ['unpaid', 'past_due', 'incomplete_expired', 'incomplete', 'canceled', 'active', 'trialing'])


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
	points: doublePrecision("points").default(0).notNull(),
	pnl: doublePrecision("pnl").default(0).notNull(),
},
(table) => {
	return {
		profilesUsernameUnique: unique("profiles_username_unique").on(table.username),
		profilesEmailUnique: unique("profiles_email_unique").on(table.email),
	}
});

export const notifications = pgTable("notifications", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	message: text("message").notNull(),
	read: text("read").default('false').notNull(),
});


export const achievements = pgTable("achievements", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	name: text("name").notNull(),
	description: text("description"),
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

export const customers = pgTable("customers", {
	id: uuid("id").primaryKey().notNull().references(() => users.id),
	stripeCustomerId: text("stripe_customer_id"),
});

export const prices = pgTable("prices", {
	id: text("id").primaryKey().notNull(),
	productId: text("product_id").references(() => products.id),
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
	userId: uuid("user_id").notNull().references(() => users.id),
	status: subscriptionStatus("status"),
	metadata: jsonb("metadata"),
	priceId: text("price_id").references(() => prices.id),
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

export const privateTab = pgTable("private_tab", {
	//table that will save private keys and their corresponding public keys and the user they belong to 
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	publicKey: text("public_key").notNull(),
	privateKey: text("private_key").notNull(),
})

export const hookTransactions = pgTable("hook_transactions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	content: text("content").notNull(),
})

export const emojiSlot = pgTable("emoji_slot", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: doublePrecision("amount").notNull(),
	spinz: integer("spinz").notNull(),
	currentAmount: doublePrecision("current_amount").default(0).notNull(),
	currentSpin: integer("current_spin").default(0).notNull(),

	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	currentEmojis: text("current_emojis").default('["🤑", "🤑", "🤑", "🤑", "🤑"]').notNull(),
	payPerSpin: doublePrecision("pay_per_spin").notNull(),
	entryAmount: doublePrecision("entry_amount").notNull(),

	pnl: doublePrecision("pnl").default(0).notNull(),

	points:doublePrecision("points").default(0).notNull(),
	//probably have to add the emoji total list adn the payeouts in order to make it more modular
})


export const feeReceivedTransaction = pgTable("fee_received_transaction", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: doublePrecision("amount").notNull(),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	fee: doublePrecision("fee").notNull(),
	transactionId: uuid("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" } ),
	signature: text("signature").notNull(),
})

export const doubleEmojiSlots = pgTable("double_emoji_slots", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: doublePrecision("amount").notNull(),
	spinz: integer("spinz").notNull(),
	currentAmount: doublePrecision("current_amount").default(0).notNull(),
	currentSpin: integer("current_spin").default(0).notNull(),

	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	currentEmojisNew: text("current_emojis_new").default('["🤑", "🤑", "🤑", "🤑", "🤑"]').notNull(),
	payPerSpin: doublePrecision("pay_per_spin").notNull(),
	entryAmount: doublePrecision("entry_amount").notNull(),


	pnl: doublePrecision("pnl").default(0).notNull(),
	points:doublePrecision("points").default(0).notNull()
})


export const tripleEmojiSlots = pgTable("triple_emoji_slots", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: doublePrecision("amount").notNull(),
	spinz: integer("spinz").notNull(),
	currentAmount: doublePrecision("current_amount").default(0).notNull(),
	currentSpin: integer("current_spin").default(0).notNull(),

	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	currentEmojisNewer: text("current_emojis_newer").default('["🤑", "🤑", "🤑", "🤑", "🤑"]').notNull(),
	payPerSpin: doublePrecision("pay_per_spin").notNull(),
	entryAmount: doublePrecision("entry_amount").notNull(),

	pnl: doublePrecision("pnl").default(0).notNull(),

	points:doublePrecision("points").default(0).notNull()
})


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
})




export const bets = pgTable("bets", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	betAmount: doublePrecision("bet_amount").notNull(),
	targetValue: doublePrecision("target_value").notNull(),
	achievedValue: doublePrecision("achieved_value").notNull(),
	// outcomeId: uuid("outcome_id").notNull().references(() => outcomes.id, { onDelete: "cascade" } ),
	status: text("status").notNull().default("pending"),
	description: text("description").notNull(),

})