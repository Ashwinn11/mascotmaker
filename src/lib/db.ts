import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "mascot.db");

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
        created_at TEXT DEFAULT (datetime('now')),
        published INTEGER DEFAULT 1
      )
    `);
  }
  return db;
}

export interface GalleryItem {
  id: number;
  name: string;
  description: string | null;
  image_url: string;
  gif_url: string | null;
  created_at: string;
}

export function getGalleryItems(): GalleryItem[] {
  return getDb()
    .prepare("SELECT * FROM gallery WHERE published = 1 ORDER BY created_at DESC")
    .all() as GalleryItem[];
}

export function addToGallery(item: {
  name: string;
  description?: string;
  imageUrl: string;
  gifUrl?: string;
}): GalleryItem {
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO gallery (name, description, image_url, gif_url) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(item.name, item.description || null, item.imageUrl, item.gifUrl || null);
  return db.prepare("SELECT * FROM gallery WHERE id = ?").get(result.lastInsertRowid) as GalleryItem;
}
