import sharp from "sharp";
import { vectorize } from "@neplex/vectorizer";

const GRID = 3;
const FRAME_COUNT = GRID * GRID;

interface SvgResult {
  frames: string[];
  animated: string;
}

/**
 * Extracts 9 frames from a 3x3 sprite sheet and vectorizes each to SVG.
 * Returns individual frame SVGs and a single animated SVG with CSS keyframes.
 */
export async function spriteSheetToSvg(
  spriteBuffer: Buffer,
  frameDuration = 200
): Promise<SvgResult> {
  const metadata = await sharp(spriteBuffer).metadata();
  const totalWidth = metadata.width!;
  const totalHeight = metadata.height!;

  const effectiveWidth = totalWidth - 2;
  const effectiveHeight = totalHeight - 2;
  const frameWidth = Math.floor(effectiveWidth / GRID);
  const frameHeight = Math.floor(effectiveHeight / GRID);

  // Downscale frames to reduce vectorization complexity
  const targetSize = 256;

  const framePngs: Buffer[] = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const left = col * (frameWidth + 1);
      const top = row * (frameHeight + 1);

      const png = await sharp(spriteBuffer)
        .extract({ left, top, width: frameWidth, height: frameHeight })
        .ensureAlpha()
        .resize(targetSize, targetSize, { fit: "inside" })
        .png()
        .toBuffer();

      framePngs.push(png);
    }
  }

  // Vectorize each frame with aggressive simplification for small file size
  const frames = await Promise.all(
    framePngs.map((png) =>
      vectorize(png, {
        colorMode: 0,        // ColorMode.Color
        colorPrecision: 4,
        filterSpeckle: 8,
        spliceThreshold: 45,
        cornerThreshold: 120,
        hierarchical: 0,     // Hierarchical.Stacked
        mode: 2,             // PathSimplifyMode.Spline
        layerDifference: 16,
        lengthThreshold: 6,
        maxIterations: 2,
        pathPrecision: 1,
      })
    )
  );

  // Build animated SVG — each frame gets its own @keyframes that toggles visibility
  const totalDuration = frameDuration * FRAME_COUNT;
  const stepPct = 100 / FRAME_COUNT;

  // Each frame is visible only during its 1/9th slice, hidden otherwise
  let styles = "";
  for (let i = 0; i < FRAME_COUNT; i++) {
    const showStart = (stepPct * i).toFixed(2);
    const showEnd = (stepPct * (i + 1)).toFixed(2);
    styles += `.f${i}{visibility:hidden;animation:f${i} ${totalDuration}ms steps(1) infinite}`;
    styles += `@keyframes f${i}{${showStart}%{visibility:visible}${showEnd}%{visibility:hidden}}`;
  }

  // Extract inner SVG content (paths) from each frame, stripping the outer <svg> wrapper
  const innerFrames = frames.map((svg, i) => {
    const innerMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    const inner = innerMatch ? innerMatch[1] : svg;
    return `<g class="f${i}">${inner}</g>`;
  });

  // Get viewBox from first frame SVG
  const viewBoxMatch = frames[0].match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${frameWidth} ${frameHeight}`;

  const animated = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${frameWidth}" height="${frameHeight}">`,
    `<style>${styles}</style>`,
    ...innerFrames,
    `</svg>`,
  ].join("");

  return { frames, animated };
}
