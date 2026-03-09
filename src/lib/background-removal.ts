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
    const outputPath = path.join(tempDir, `output-${Date.now()}.png`);

    try {
        console.log("Standardizing image and writing to temp file...");
        // Ensure we have a clean PNG
        const standardizedBuffer = await sharp(buffer)
            .toFormat("png")
            .toBuffer();

        await fs.promises.writeFile(inputPath, standardizedBuffer);

        console.log("Starting AI Background Removal (Neural) via file...");
        const start = Date.now();

        // Passing the file path is the most robust way in Node.js
        const result = await removeBg(inputPath);

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
