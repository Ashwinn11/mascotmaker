import sharp from "sharp";

const GRID = 3;
const FRAME_COUNT = GRID * GRID;

export async function spriteSheetToGif(
    spriteBuffer: Buffer,
    frameDuration = 200,
    shouldRemoveBackground = false
): Promise<{ spriteBuffer: Buffer; animationBuffer: Buffer }> {
    const metadata = await sharp(spriteBuffer).metadata();
    const totalWidth = metadata.width!;
    const totalHeight = metadata.height!;

    const frameWidth = Math.floor(totalWidth / GRID);
    const frameHeight = Math.floor(totalHeight / GRID);

    // Extract each frame
    const frames: Buffer[] = [];
    const composites: any[] = [];

    for (let row = 0; row < GRID; row++) {
        for (let col = 0; col < GRID; col++) {
            const left = col * frameWidth;
            const top = row * frameHeight;

            let frame = await sharp(spriteBuffer)
                .extract({ left, top, width: frameWidth, height: frameHeight })
                .toFormat("png")
                .toBuffer();

            if (shouldRemoveBackground) {
                const { removeBackground } = await import("./background-removal");
                frame = await removeBackground(frame);
            }

            // Save for Sprite Sheet re-composition
            composites.push({ input: frame, left, top });

            // Convert to raw pixels for GIF assembly
            const raw = await sharp(frame)
                .ensureAlpha()
                .raw()
                .toBuffer();

            frames.push(raw);
        }
    }

    // 1. Create the Transparent Sprite Sheet
    const processedSpriteSheet = await sharp({
        create: {
            width: totalWidth,
            height: totalHeight,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
        .composite(composites)
        .png()
        .toBuffer();

    // 2. Create the Animated GIF
    const allPixels = Buffer.concat(frames);
    const animationBuffer = await sharp(allPixels, {
        raw: {
            width: frameWidth,
            height: frameHeight * FRAME_COUNT,
            channels: 4,
            pageHeight: frameHeight,
        },
    })
        .gif({
            delay: frames.map(() => frameDuration),
            loop: 0,
        })
        .toBuffer();

    return { spriteBuffer: processedSpriteSheet, animationBuffer };
}
