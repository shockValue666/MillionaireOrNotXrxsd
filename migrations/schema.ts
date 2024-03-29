import { pgTable, unique, pgEnum, uuid, timestamp, text, foreignKey, jsonb, boolean, bigint, integer } from "drizzle-orm/pg-core"
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
});

export const privateTab = pgTable("private_tab", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	publicKey: text("public_key").notNull(),
	privateKey: text("private_key").notNull(),
});

export const hookTransactions = pgTable("hook_transactions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	content: text("content").notNull(),
});

export const transactions = pgTable("transactions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	from: text("from").notNull(),
	to: text("to").notNull(),
	coin: text("coin").notNull(),
	amount: text("amount").notNull(),
	signature: text("signature"),
});

export const emojiSlot = pgTable("emoji_slot", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	amount: integer("amount").notNull(),
	spinz: integer("spinz").notNull(),
	profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	currentAmount: integer("current_amount").default(0).notNull(),
	currentSpin: integer("current_spin").default(0).notNull(),
	currentEmojis: text("current_emojis").default('["🤑", "🤑", "🤑", "🤑", "🤑"]').notNull(),
});