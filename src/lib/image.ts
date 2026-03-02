import sharp from "sharp";

const WHITE_THRESHOLD = 250;
const GRADIENT_LOW = 245; // pixels between 245-255 get gradient alpha for smooth edges

/**
 * Removes white/near-white background from a PNG image by setting those pixels to transparent.
 * Uses gradient alpha for pixels near the threshold to produce smooth anti-aliased edges.
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
    const minChannel = Math.min(r, g, b);

    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      pixels[i + 3] = 0; // fully transparent
    } else if (minChannel >= GRADIENT_LOW) {
      // Gradient alpha: the closer to white, the more transparent
      const brightness = (r + g + b) / 3;
      const range = WHITE_THRESHOLD - GRADIENT_LOW; // 5
      const alpha = Math.round(((WHITE_THRESHOLD - brightness) / range) * 255);
      pixels[i + 3] = Math.max(0, Math.min(255, alpha));
    }
  }

  const result = await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return result.toString("base64");
}