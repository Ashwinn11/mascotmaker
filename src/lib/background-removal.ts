import { removeBackground as removeBg } from "@imgly/background-removal-node";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Removes background using a neural network-based approach (AI segmentation).
 * Uses a temporary file to ensure the internal loader recognizes the format correctly.
 */
export async function removeBackground(buffer: Buffer): Promise<Buffer> {
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input-${Date.now()}.png`);

    try {
        // Pre-process: Optimize contrast for Charcoal Grey (#404040) background.
        // This ensures white edges "pop" clearly for the AI.
        const standardizedBuffer = await sharp(buffer)
            .toFormat("png", { quality: 100 })
            .linear(1.1, -10) // Subtle boost to ensure white stays white and grey stays grey
            .toBuffer();

        await fs.promises.writeFile(inputPath, standardizedBuffer);

        console.log("Starting AI Background Removal (Neural) via file...");
        const start = Date.now();

        // Use the medium model (default) with maximum quality settings
        const result = await removeBg(inputPath, {
            model: "medium",
            output: {
                quality: 1.0,
                format: "image/png"
            }
        });

        const arrayBuffer = await result.arrayBuffer();
        console.log(`AI Background Removal finished in ${Date.now() - start}ms`);

        const finalBuffer = Buffer.from(arrayBuffer);

        // Clean up
        try { await fs.promises.unlink(inputPath); } catch (e) { }

        return finalBuffer;
    } catch (error) {
        console.error("AI Background Removal failed:", error);
        // Clean up on error
        try { if (fs.existsSync(inputPath)) await fs.promises.unlink(inputPath); } catch (e) { }
        return buffer;
    }
}
