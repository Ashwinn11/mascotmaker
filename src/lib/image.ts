import sharp from "sharp";

const WHITE_THRESHOLD = 240;

/**
 * Removes white/near-white background from a PNG image by setting those pixels to transparent.
 * Takes a base64-encoded PNG and returns a base64-encoded PNG with transparency.
 */
export async function removeWhiteBackground(base64: string): Promise<string> {
  const input = Buffer.from(base64, "base64");
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      pixels[i + 3] = 0; // set alpha to 0
    }
  }

  const result = await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return result.toString("base64");
}

/**
 * Removes white background from a raw RGBA buffer in-place.
 * Returns the index of a transparent pixel in the palette (for GIF encoding).
 */
export function makeWhiteTransparentRGBA(data: Buffer | Uint8Array): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      // Set to a specific transparent color so quantize groups them together
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
}
