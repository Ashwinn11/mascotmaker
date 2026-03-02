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

export function getGalleryItems(): GalleryItem[] {
  return getDb()
    .prepare("SELECT * FROM gallery WHERE published = 1 ORDER BY created_at DESC")
    .all() as GalleryItem[];
}

export function deleteGalleryItem(id: number): boolean {
  const result = getDb()
    .prepare("DELETE FROM gallery WHERE id = ?")
    .run(id);
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
