import sharp from "sharp";

const GRID = 3;
const FRAME_COUNT = GRID * GRID;
const WHITE_THRESHOLD = 250;

export async function spriteSheetToGif(
  spriteBuffer: Buffer,
  frameDuration = 200
): Promise<Buffer> {
  const metadata = await sharp(spriteBuffer).metadata();
  const totalWidth = metadata.width!;
  const totalHeight = metadata.height!;

  // Account for 1px grid lines between cells
  const effectiveWidth = totalWidth - 2;
  const effectiveHeight = totalHeight - 2;
  const frameWidth = Math.floor(effectiveWidth / GRID);
  const frameHeight = Math.floor(effectiveHeight / GRID);

  // Extract each frame as raw RGBA and make white pixels transparent
  const rawFrames: Buffer[] = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const left = col * (frameWidth + 1);
      const top = row * (frameHeight + 1);

      const raw = await sharp(spriteBuffer)
        .extract({ left, top, width: frameWidth, height: frameHeight })
        .ensureAlpha()
        .raw()
        .toBuffer();

      // Remove white background — GIF supports 1-bit alpha only,
      // so binary transparent/opaque is the best we can do
      const pixels = new Uint8Array(raw.buffer, raw.byteOffset, raw.length);
      for (let i = 0; i < pixels.length; i += 4) {
        if (
          pixels[i] >= WHITE_THRESHOLD &&
          pixels[i + 1] >= WHITE_THRESHOLD &&
          pixels[i + 2] >= WHITE_THRESHOLD
        ) {
          pixels[i] = 0;
          pixels[i + 1] = 0;
          pixels[i + 2] = 0;
          pixels[i + 3] = 0;
        }
      }

      rawFrames.push(raw);
    }
  }

  // Stack all frames into one tall raw buffer and encode as animated GIF
  const allPixels = Buffer.concat(rawFrames);

  return sharp(allPixels, {
    raw: {
      width: frameWidth,
      height: frameHeight * FRAME_COUNT,
      channels: 4,
      pageHeight: frameHeight,
    },
  })
    .gif({
      delay: rawFrames.map(() => frameDuration),
      loop: 0,
    })
    .toBuffer();
}
