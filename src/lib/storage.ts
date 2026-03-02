import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function ensureDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export function saveImage(base64Data: string, ext = "png"): string {
  ensureDir();
  const filename = `${uuidv4()}.${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filepath, Buffer.from(base64Data, "base64"));
  return `/uploads/${filename}`;
}

export function saveBuffer(buffer: Buffer, ext = "gif"): string {
  ensureDir();
  const filename = `${uuidv4()}.${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  return `/uploads/${filename}`;
}

export function loadImageAsBase64(urlPath: string): string {
  const filepath = path.join(process.cwd(), "public", urlPath);
  return fs.readFileSync(filepath).toString("base64");
}
