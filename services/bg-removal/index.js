const express = require('express');
const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.raw({ type: 'image/*', limit: '50mb' }));

app.post('/remove-background', async (req, res) => {
    let inputPath = null;
    try {
        console.log('Received background removal request...');
        const buffer = req.body;
        
        if (!buffer || buffer.length === 0) {
            console.error('Error: Empty buffer received');
            return res.status(400).send('No image data provided');
        }

        console.log(`Buffer size: ${buffer.length} bytes`);

        // Write buffer to a temp file. 
        // @imgly/background-removal-node's internal decoder handles file paths more reliably than raw buffers.
        const tempDir = os.tmpdir();
        inputPath = path.join(tempDir, `input-${Date.now()}.png`);
        await fs.promises.writeFile(inputPath, buffer);

        const start = Date.now();
        console.log('Starting AI processing...');
        
        const result = await removeBackground(inputPath, {
            model: "large",
            publicPath: "https://storage.googleapis.com/mascot-models-5e9d3f5e/",
            output: {
                quality: 1.0,
                format: "image/png"
            }
        });

        const arrayBuffer = await result.arrayBuffer();
        console.log(`Background removal finished in ${Date.now() - start}ms`);
        
        res.set('Content-Type', 'image/png');
        res.send(Buffer.from(arrayBuffer));
    } catch (error) {
        console.error('Background removal failed:', error);
        res.status(500).send(error.message);
    } finally {
        if (inputPath && fs.existsSync(inputPath)) {
            try { await fs.promises.unlink(inputPath); } catch (e) {}
        }
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Background removal service listening on port ${PORT}`);
});
