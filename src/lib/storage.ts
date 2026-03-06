import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!; // e.g. https://assets.yourdomain.com

export async function saveImage(base64Data: string, ext = "png"): Promise<string> {
  const key = `uploads/${uuidv4()}.${ext}`;
  const buffer = Buffer.from(base64Data, "base64");

  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/png",
    })
  );

  return `${PUBLIC_URL}/${key}`;
}

export async function saveBuffer(buffer: Buffer, ext = "gif"): Promise<string> {
  const key = `uploads/${uuidv4()}.${ext}`;

  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/png",
    })
  );

  return `${PUBLIC_URL}/${key}`;
}

export async function deleteFile(url: string): Promise<void> {
  let key = url;
  if (url.startsWith(PUBLIC_URL)) {
    key = url.slice(PUBLIC_URL.length + 1);
  } else if (url.startsWith("/uploads/")) {
    key = url.slice(1);
  } else if (url.startsWith("uploads/")) {
    key = url;
  }

  await R2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}
