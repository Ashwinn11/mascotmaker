import sharp from "sharp";

/**
 * Removes background using a remote microservice on Google Cloud Run.
 * This avoids Vercel's 300MB function size limit and allows for higher quality AI models.
 */
export async function removeBackground(buffer: Buffer): Promise<Buffer> {
    const SERVICE_URL = process.env.BG_REMOVAL_SERVICE_URL;

    if (!SERVICE_URL) {
        console.warn("BG_REMOVAL_SERVICE_URL not set. Falling back to local background removal if possible.");
        // Fallback or error
        return buffer;
    }

    try {
        console.log("Calling Remote AI Background Removal (Cloud Run)...");
        const start = Date.now();

        // Standardize image before sending
        const requestBody = await sharp(buffer)
            .toFormat("png", { quality: 100 })
            .toBuffer();

        const response = await fetch(`${SERVICE_URL}/remove-background`, {
            method: "POST",
            headers: {
                "Content-Type": "image/png",
            },
            body: requestBody as any,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cloud Run service failed: ${errorText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log(`Cloud Run Background Removal finished in ${Date.now() - start}ms`);

        return Buffer.from(arrayBuffer);
    } catch (error) {
        console.error("Remote AI Background Removal failed:", error);
        return buffer;
    }
}
