import sharp from "sharp";

/**
 * Removes a green-screen background from a PNG image by setting green-dominant pixels to transparent.
 * Uses gradient alpha for near-green edge pixels to produce smooth anti-aliased edges.
 * White pixels are completely untouched — only green-dominant pixels are removed.
 * Takes a base64-encoded PNG and returns a base64-encoded PNG with transparency.
 */
export async function removeGreenBackground(base64: string): Promise<string> {
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

    // How much greener is this pixel than the other channels?
    const greenDominance = g - Math.max(r, b);

    // Strong green: G is much higher than R and B
    if (greenDominance > 80 && g >= 150) {
      pixels[i + 3] = 0; // fully transparent
    } else if (greenDominance > 40 && g >= 100) {
      // Near-green edge pixels: gradient alpha for anti-aliasing
      // The more green-dominant, the more transparent
      const t = (greenDominance - 40) / 40; // 0..1
      const alpha = Math.round((1 - t) * 255);
      pixels[i + 3] = Math.min(pixels[i + 3], alpha);
    }
  }

  const result = await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return result.toString("base64");
}
