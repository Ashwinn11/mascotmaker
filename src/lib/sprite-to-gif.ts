import sharp from "sharp";
import { GIFEncoder, quantize, applyPalette } from "gifenc";

const GIF_SIZE = 256;

export async function spriteSheetToGif(
  spriteBuffer: Buffer,
  frameDuration = 200
): Promise<Buffer> {
  const metadata = await sharp(spriteBuffer).metadata();
  const totalWidth = metadata.width!;
  const totalHeight = metadata.height!;

  const effectiveWidth = totalWidth - 2;
  const effectiveHeight = totalHeight - 2;
  const frameWidth = Math.floor(effectiveWidth / 3);
  const frameHeight = Math.floor(effectiveHeight / 3);

  const gif = GIFEncoder();

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const left = col * (frameWidth + 1);
      const top = row * (frameHeight + 1);

      const data = await sharp(spriteBuffer)
        .extract({ left, top, width: frameWidth, height: frameHeight })
        .resize(GIF_SIZE, GIF_SIZE)
        .ensureAlpha()
        .raw()
        .toBuffer();

      const palette = quantize(data, 256);
      const index = applyPalette(data, palette);

      gif.writeFrame(index, GIF_SIZE, GIF_SIZE, {
        palette,
        delay: frameDuration,
      });
    }
  }

  gif.finish();
  return Buffer.from(gif.bytes());
}
