import { neon } from "@neondatabase/serverless";
import { v4 as uuidv4 } from "uuid";

// ─── Connection ───

function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL or POSTGRES_URL env var is required");
  const query = neon(databaseUrl);
  return query(strings, ...values);
}

// ─── Schema Init ───

let initialized = false;

export async function initDb(): Promise<void> {
  if (initialized) return;

  await sql`
    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      gif_url TEXT,
      user_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      published INTEGER DEFAULT 1
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      avatar_url TEXT,
      credits INTEGER DEFAULT 25,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      balance_after INTEGER NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS usage_logs (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      api_route TEXT NOT NULL,
      credits_charged INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      ls_subscription_id TEXT UNIQUE NOT NULL,
      ls_customer_id TEXT,
      variant_id TEXT NOT NULL,
      plan_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      current_period_end TIMESTAMPTZ,
      cancel_at TIMESTAMPTZ,
      customer_portal_url TEXT,
      update_payment_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS webhook_events (
      id SERIAL PRIMARY KEY,
      event_id TEXT UNIQUE NOT NULL,
      event_name TEXT NOT NULL,
      processed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  initialized = true;
}

async function ensureDb(): Promise<void> {
  await initDb();
}

// ─── Webhook Idempotency ───

export async function isWebhookProcessed(eventId: string): Promise<boolean> {
  await ensureDb();
  const rows = await sql`
    SELECT 1 FROM webhook_events WHERE event_id = ${eventId} LIMIT 1
  `;
  return rows.length > 0;
}

export async function markWebhookProcessed(eventId: string, eventName: string): Promise<void> {
  await sql`
    INSERT INTO webhook_events (event_id, event_name)
    VALUES (${eventId}, ${eventName})
    ON CONFLICT (event_id) DO NOTHING
  `;
}

// ─── Gallery ───

export interface GalleryItem {
  id: number;
  name: string;
  description: string | null;
  image_url: string;
  gif_url: string | null;
  user_id: string | null;
  created_at: string;
}

export async function getGalleryItems(userId: string): Promise<GalleryItem[]> {
  await ensureDb();
  const rows = await sql`
    SELECT * FROM gallery WHERE user_id = ${userId} ORDER BY created_at DESC
  `;
  return rows as GalleryItem[];
}

export async function deleteGalleryItem(id: number, userId: string): Promise<boolean> {
  await ensureDb();
  const rows = await sql`
    DELETE FROM gallery WHERE id = ${id} AND user_id = ${userId} RETURNING id
  `;
  return rows.length > 0;
}

export async function addToGallery(item: {
  name: string;
  description?: string;
  imageUrl: string;
  gifUrl?: string;
  userId?: string;
}): Promise<GalleryItem> {
  await ensureDb();
  const rows = await sql`
    INSERT INTO gallery (name, description, image_url, gif_url, user_id)
    VALUES (${item.name}, ${item.description || null}, ${item.imageUrl}, ${item.gifUrl || null}, ${item.userId || null})
    RETURNING *
  `;
  return rows[0] as GalleryItem;
}

// ─── Users ───

export interface User {
  id: string;
  google_id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  credits: number;
  created_at: string;
}

export async function findOrCreateUser(params: {
  googleId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}): Promise<User> {
  await ensureDb();
  const existing = await sql`
    SELECT * FROM users WHERE google_id = ${params.googleId}
  `;

  if (existing.length > 0) {
    await sql`
      UPDATE users SET name = ${params.name}, avatar_url = ${params.avatarUrl}
      WHERE id = ${existing[0].id}
    `;
    return { ...existing[0], name: params.name, avatar_url: params.avatarUrl } as User;
  }

  const id = uuidv4();
  const rows = await sql`
    INSERT INTO users (id, google_id, email, name, avatar_url, credits)
    VALUES (${id}, ${params.googleId}, ${params.email}, ${params.name}, ${params.avatarUrl}, 25)
    RETURNING *
  `;
  return rows[0] as User;
}

export async function getUserById(id: string): Promise<User | null> {
  await ensureDb();
  const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
  return (rows[0] as User) || null;
}

export async function getUserCredits(userId: string): Promise<number> {
  const user = await getUserById(userId);
  return user?.credits ?? 0;
}

export async function updateUserCredits(userId: string, newBalance: number): Promise<void> {
  await ensureDb();
  await sql`UPDATE users SET credits = ${newBalance} WHERE id = ${userId}`;
}

/**
 * Atomically deduct credits. Returns the new balance, or null if insufficient.
 */
export async function atomicDeductCredits(userId: string, cost: number): Promise<number | null> {
  await ensureDb();
  const rows = await sql`
    UPDATE users SET credits = credits - ${cost}
    WHERE id = ${userId} AND credits >= ${cost}
    RETURNING credits
  `;
  if (rows.length === 0) return null;
  return rows[0].credits as number;
}

// ─── Transactions ───

export interface Transaction {
  id: number;
  user_id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string | null;
  created_at: string;
}

export async function addTransaction(params: {
  userId: string;
  type: "deduction" | "purchase" | "bonus";
  amount: number;
  balanceAfter: number;
  description: string;
}): Promise<void> {
  await ensureDb();
  await sql`
    INSERT INTO transactions (user_id, type, amount, balance_after, description)
    VALUES (${params.userId}, ${params.type}, ${params.amount}, ${params.balanceAfter}, ${params.description})
  `;
}

export async function getTransactions(userId: string, limit = 50): Promise<Transaction[]> {
  await ensureDb();
  const rows = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows as Transaction[];
}

// ─── Usage Logs ───

export async function logUsage(params: {
  userId: string;
  apiRoute: string;
  creditsCharged: number;
}): Promise<void> {
  await ensureDb();
  await sql`
    INSERT INTO usage_logs (user_id, api_route, credits_charged)
    VALUES (${params.userId}, ${params.apiRoute}, ${params.creditsCharged})
  `;
}

// ─── Subscriptions ───

export interface Subscription {
  id: number;
  user_id: string;
  ls_subscription_id: string;
  ls_customer_id: string | null;
  variant_id: string;
  plan_name: string;
  status: string;
  current_period_end: string | null;
  cancel_at: string | null;
  customer_portal_url: string | null;
  update_payment_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function createSubscription(params: {
  userId: string;
  lsSubscriptionId: string;
  lsCustomerId?: string;
  variantId: string;
  planName: string;
  status?: string;
  currentPeriodEnd?: string;
  customerPortalUrl?: string;
  updatePaymentUrl?: string;
}): Promise<void> {
  await ensureDb();
  await sql`
    INSERT INTO subscriptions (user_id, ls_subscription_id, ls_customer_id, variant_id, plan_name, status, current_period_end, customer_portal_url, update_payment_url)
    VALUES (${params.userId}, ${params.lsSubscriptionId}, ${params.lsCustomerId || null}, ${params.variantId}, ${params.planName}, ${params.status || "active"}, ${params.currentPeriodEnd || null}, ${params.customerPortalUrl || null}, ${params.updatePaymentUrl || null})
    ON CONFLICT (ls_subscription_id) DO UPDATE SET
      variant_id = EXCLUDED.variant_id,
      plan_name = EXCLUDED.plan_name,
      status = EXCLUDED.status,
      current_period_end = EXCLUDED.current_period_end,
      customer_portal_url = EXCLUDED.customer_portal_url,
      update_payment_url = EXCLUDED.update_payment_url,
      updated_at = NOW()
  `;
}

export async function updateSubscriptionByLsId(
  lsSubscriptionId: string,
  updates: Partial<{
    variantId: string;
    planName: string;
    status: string;
    currentPeriodEnd: string;
    cancelAt: string;
    customerPortalUrl: string;
    updatePaymentUrl: string;
  }>
): Promise<void> {
  await ensureDb();
  await sql`
    UPDATE subscriptions SET
      variant_id = COALESCE(${updates.variantId ?? null}, variant_id),
      plan_name = COALESCE(${updates.planName ?? null}, plan_name),
      status = COALESCE(${updates.status ?? null}, status),
      current_period_end = COALESCE(${updates.currentPeriodEnd ?? null}, current_period_end),
      cancel_at = COALESCE(${updates.cancelAt ?? null}, cancel_at),
      customer_portal_url = COALESCE(${updates.customerPortalUrl ?? null}, customer_portal_url),
      update_payment_url = COALESCE(${updates.updatePaymentUrl ?? null}, update_payment_url),
      updated_at = NOW()
    WHERE ls_subscription_id = ${lsSubscriptionId}
  `;
}

export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
  await ensureDb();
  const rows = await sql`
    SELECT * FROM subscriptions
    WHERE user_id = ${userId} AND status IN ('active', 'cancelled', 'past_due', 'paused')
    ORDER BY created_at DESC LIMIT 1
  `;
  return (rows[0] as Subscription) || null;
}

export async function getSubscriptionByLsId(lsSubscriptionId: string): Promise<Subscription | null> {
  await ensureDb();
  const rows = await sql`
    SELECT * FROM subscriptions WHERE ls_subscription_id = ${lsSubscriptionId}
  `;
  return (rows[0] as Subscription) || null;
}
