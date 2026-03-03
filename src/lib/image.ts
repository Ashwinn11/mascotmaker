import sharp from "sharp";

/**
 * Removes a green-screen background from a PNG image.
 * 1. Sets green-dominant pixels to transparent with smooth gradient alpha at edges.
 * 2. Despills edge pixels: mathematically un-blends the green background from RGB
 *    so semi-transparent pixels no longer carry a green tint.
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

    // Strong green: clearly background → fully transparent
    if (greenDominance > 70 && g >= 140) {
      pixels[i] = 0;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
      pixels[i + 3] = 0;
    } else if (greenDominance > 25 && g >= 80) {
      // Edge pixels blending with the green screen → gradient alpha + color despill
      const t = Math.min(1, (greenDominance - 25) / 45); // 0..1
      const alpha = Math.round((1 - t) * 255);
      const newAlpha = Math.min(pixels[i + 3], alpha);
      pixels[i + 3] = newAlpha;

      // Despill: un-blend the green screen from the observed color.
      // observed = foreground * a + greenBG * (1 - a)
      // ⇒ foreground = (observed - greenBG * (1 - a)) / a
      // Green screen ≈ (0, 255, 0)
      if (newAlpha > 0) {
        const a = newAlpha / 255;
        pixels[i]     = Math.round(Math.max(0, Math.min(255, r / a)));
        pixels[i + 1] = Math.round(Math.max(0, Math.min(255, (g - 255 * (1 - a)) / a)));
        pixels[i + 2] = Math.round(Math.max(0, Math.min(255, b / a)));
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
