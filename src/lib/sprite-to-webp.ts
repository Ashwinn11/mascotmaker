import sharp from "sharp";

const GRID = 3;
const FRAME_COUNT = GRID * GRID;

export async function spriteSheetToWebp(
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

  // Extract each frame as raw RGBA pixels (preserve transparency)
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

      rawFrames.push(raw);
    }
  }

  // Stack all frames into one tall raw buffer and encode as animated WebP
  const allPixels = Buffer.concat(rawFrames);

  return sharp(allPixels, {
    raw: {
      width: frameWidth,
      height: frameHeight * FRAME_COUNT,
      channels: 4,
      pageHeight: frameHeight,
    },
  })
    .webp({
      delay: rawFrames.map(() => frameDuration),
      loop: 0,
    })
    .toBuffer();
}
