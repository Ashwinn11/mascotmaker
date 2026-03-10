import sharp from "sharp";

const GRID = 3;
const FRAME_COUNT = GRID * GRID;

export async function spriteSheetToGif(
    spriteBuffer: Buffer,
    frameDuration = 200,
    shouldRemoveBackground = false
): Promise<{ spriteBuffer: Buffer; animationBuffer: Buffer }> {
    let processedSpriteBuffer = spriteBuffer;

    if (shouldRemoveBackground) {
        const { removeBackground } = await import("./background-removal");
        processedSpriteBuffer = await removeBackground(spriteBuffer);
    }

    const metadata = await sharp(processedSpriteBuffer).metadata();
    const totalWidth = metadata.width!;
    const totalHeight = metadata.height!;

    const frameWidth = Math.floor(totalWidth / GRID);
    const frameHeight = Math.floor(totalHeight / GRID);

    // Extract and Auto-Center each frame
    const frames: Buffer[] = [];

    for (let row = 0; row < GRID; row++) {
        for (let col = 0; col < GRID; col++) {
            const left = col * frameWidth;
            const top = row * frameHeight;

            // 1. Extract the raw frame
            const frameBuffer = await sharp(processedSpriteBuffer)
                .extract({ left, top, width: frameWidth, height: frameHeight })
                .ensureAlpha()
                .toBuffer();

            // 2. Trim and Centering:
            // This fixes the "off-center" jitter by finding the character's 
            // actual boundaries and re-centering them in the frame.
            let finalFrameBuffer = frameBuffer;
            try {
                finalFrameBuffer = await sharp({
                    create: {
                        width: frameWidth,
                        height: frameHeight,
                        channels: 4,
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    }
                })
                    .composite([{
                        input: await sharp(frameBuffer).trim().toBuffer(),
                        gravity: 'center'
                    }])
                    .png()
                    .toBuffer();
            } catch (e) {
                // If the frame is empty/fully transparent, trim() might fail.
                // We just use the original frameBuffer in that case.
                console.log("Skipping trim for empty frame");
            }

            // 3. Convert to raw pixels for GIF assembly
            const raw = await sharp(finalFrameBuffer)
                .raw()
                .toBuffer();

            frames.push(raw);
        }
    }

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

    return { spriteBuffer: processedSpriteBuffer, animationBuffer };
}
