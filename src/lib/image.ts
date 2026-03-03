import sharp from "sharp";

/**
 * Removes a bright green (#00FF00) background from a PNG image by setting those pixels to transparent.
 * Uses gradient alpha for near-green edge pixels to produce smooth anti-aliased edges.
 * White pixels are completely untouched — only green is removed.
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

    // Pure green: high G, low R and B
    if (g >= 240 && r <= 30 && b <= 30) {
      pixels[i + 3] = 0; // fully transparent
    } else if (g >= 200 && r <= 80 && b <= 80) {
      // Near-green edge pixels: gradient alpha for anti-aliasing
      const greenness = g - Math.max(r, b);
      if (greenness > 120) {
        // The more green-dominant, the more transparent
        const alpha = Math.round(((200 - greenness) / 80) * 255);
        pixels[i + 3] = Math.max(0, Math.min(255, alpha));
      }
    }
  }

  const result = await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return result.toString("base64");
}
