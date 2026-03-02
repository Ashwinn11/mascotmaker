import Database from "better-sqlite3";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "mascot.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        gif_url TEXT,
        user_id TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        published INTEGER DEFAULT 1
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        google_id TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        name TEXT,
        avatar_url TEXT,
        credits INTEGER DEFAULT 25,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        amount INTEGER NOT NULL,
        balance_after INTEGER NOT NULL,
        description TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        api_route TEXT NOT NULL,
        credits_charged INTEGER NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        ls_subscription_id TEXT UNIQUE NOT NULL,
        ls_customer_id TEXT,
        variant_id TEXT NOT NULL,
        plan_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        current_period_end TEXT,
        cancel_at TEXT,
        customer_portal_url TEXT,
        update_payment_url TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }
  return db;
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

export function getGalleryItems(userId: string): GalleryItem[] {
  return getDb()
    .prepare("SELECT * FROM gallery WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as GalleryItem[];
}

export function deleteGalleryItem(id: number, userId: string): boolean {
  const result = getDb()
    .prepare("DELETE FROM gallery WHERE id = ? AND user_id = ?")
    .run(id, userId);
  return result.changes > 0;
}

export function addToGallery(item: {
  name: string;
  description?: string;
  imageUrl: string;
  gifUrl?: string;
  userId?: string;
}): GalleryItem {
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO gallery (name, description, image_url, gif_url, user_id) VALUES (?, ?, ?, ?, ?)"
  );
  const result = stmt.run(
    item.name,
    item.description || null,
    item.imageUrl,
    item.gifUrl || null,
    item.userId || null
  );
  return db.prepare("SELECT * FROM gallery WHERE id = ?").get(result.lastInsertRowid) as GalleryItem;
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

export function findOrCreateUser(params: {
  googleId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}): User {
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM users WHERE google_id = ?")
    .get(params.googleId) as User | undefined;

  if (existing) {
    // Update name/avatar if changed
    db.prepare("UPDATE users SET name = ?, avatar_url = ? WHERE id = ?").run(
      params.name,
      params.avatarUrl,
      existing.id
    );
    return { ...existing, name: params.name, avatar_url: params.avatarUrl };
  }

  const id = uuidv4();
  db.prepare(
    "INSERT INTO users (id, google_id, email, name, avatar_url, credits) VALUES (?, ?, ?, ?, ?, 25)"
  ).run(id, params.googleId, params.email, params.name, params.avatarUrl);

  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User;
}

export function getUserById(id: string): User | null {
  return (getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as User) || null;
}

export function getUserCredits(userId: string): number {
  const user = getUserById(userId);
  return user?.credits ?? 0;
}

export function updateUserCredits(userId: string, newBalance: number): void {
  getDb().prepare("UPDATE users SET credits = ? WHERE id = ?").run(newBalance, userId);
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

export function addTransaction(params: {
  userId: string;
  type: "deduction" | "purchase" | "bonus";
  amount: number;
  balanceAfter: number;
  description: string;
}): void {
  getDb()
    .prepare(
      "INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?, ?, ?, ?, ?)"
    )
    .run(params.userId, params.type, params.amount, params.balanceAfter, params.description);
}

export function getTransactions(userId: string, limit = 50): Transaction[] {
  return getDb()
    .prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?")
    .all(userId, limit) as Transaction[];
}

// ─── Usage Logs ───

export function logUsage(params: {
  userId: string;
  apiRoute: string;
  creditsCharged: number;
}): void {
  getDb()
    .prepare(
      "INSERT INTO usage_logs (user_id, api_route, credits_charged) VALUES (?, ?, ?)"
    )
    .run(params.userId, params.apiRoute, params.creditsCharged);
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

export function createSubscription(params: {
  userId: string;
  lsSubscriptionId: string;
  lsCustomerId?: string;
  variantId: string;
  planName: string;
  status?: string;
  currentPeriodEnd?: string;
  customerPortalUrl?: string;
  updatePaymentUrl?: string;
}): void {
  getDb()
    .prepare(
      `INSERT INTO subscriptions (user_id, ls_subscription_id, ls_customer_id, variant_id, plan_name, status, current_period_end, customer_portal_url, update_payment_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(ls_subscription_id) DO UPDATE SET
         variant_id = excluded.variant_id,
         plan_name = excluded.plan_name,
         status = excluded.status,
         current_period_end = excluded.current_period_end,
         customer_portal_url = excluded.customer_portal_url,
         update_payment_url = excluded.update_payment_url,
         updated_at = datetime('now')`
    )
    .run(
      params.userId,
      params.lsSubscriptionId,
      params.lsCustomerId || null,
      params.variantId,
      params.planName,
      params.status || "active",
      params.currentPeriodEnd || null,
      params.customerPortalUrl || null,
      params.updatePaymentUrl || null
    );
}

export function updateSubscriptionByLsId(
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
): void {
  const setClauses: string[] = ["updated_at = datetime('now')"];
  const values: unknown[] = [];

  if (updates.variantId !== undefined) {
    setClauses.push("variant_id = ?");
    values.push(updates.variantId);
  }
  if (updates.planName !== undefined) {
    setClauses.push("plan_name = ?");
    values.push(updates.planName);
  }
  if (updates.status !== undefined) {
    setClauses.push("status = ?");
    values.push(updates.status);
  }
  if (updates.currentPeriodEnd !== undefined) {
    setClauses.push("current_period_end = ?");
    values.push(updates.currentPeriodEnd);
  }
  if (updates.cancelAt !== undefined) {
    setClauses.push("cancel_at = ?");
    values.push(updates.cancelAt);
  }
  if (updates.customerPortalUrl !== undefined) {
    setClauses.push("customer_portal_url = ?");
    values.push(updates.customerPortalUrl);
  }
  if (updates.updatePaymentUrl !== undefined) {
    setClauses.push("update_payment_url = ?");
    values.push(updates.updatePaymentUrl);
  }

  values.push(lsSubscriptionId);

  getDb()
    .prepare(
      `UPDATE subscriptions SET ${setClauses.join(", ")} WHERE ls_subscription_id = ?`
    )
    .run(...values);
}

export function getActiveSubscription(userId: string): Subscription | null {
  return (
    (getDb()
      .prepare(
        "SELECT * FROM subscriptions WHERE user_id = ? AND status IN ('active', 'cancelled', 'past_due', 'paused') ORDER BY created_at DESC LIMIT 1"
      )
      .get(userId) as Subscription) || null
  );
}

export function getSubscriptionByLsId(lsSubscriptionId: string): Subscription | null {
  return (
    (getDb()
      .prepare("SELECT * FROM subscriptions WHERE ls_subscription_id = ?")
      .get(lsSubscriptionId) as Subscription) || null
  );
}
