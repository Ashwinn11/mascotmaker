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

  // Extract each frame as PNG buffer for vectorization
  const framePngs: Buffer[] = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const left = col * (frameWidth + 1);
      const top = row * (frameHeight + 1);

      const png = await sharp(spriteBuffer)
        .extract({ left, top, width: frameWidth, height: frameHeight })
        .ensureAlpha()
        .png()
        .toBuffer();

      framePngs.push(png);
    }
  }

  // Vectorize each frame
  const frames = await Promise.all(
    framePngs.map((png) =>
      vectorize(png, {
        colorMode: 0,        // ColorMode.Color
        colorPrecision: 8,
        filterSpeckle: 4,
        spliceThreshold: 45,
        cornerThreshold: 60,
        hierarchical: 0,     // Hierarchical.Stacked
        mode: 2,             // PathSimplifyMode.Spline
        layerDifference: 6,
        lengthThreshold: 4,
        maxIterations: 2,
        pathPrecision: 3,
      })
    )
  );

  // Build animated SVG with CSS keyframes
  const totalDuration = frameDuration * FRAME_COUNT;
  const stepPct = 100 / FRAME_COUNT;

  let keyframes = "@keyframes play{";
  for (let i = 0; i < FRAME_COUNT; i++) {
    const start = (stepPct * i).toFixed(2);
    const end = (stepPct * (i + 1)).toFixed(2);
    // Each frame is visible only during its slice of the animation
    keyframes += `${start}%,${i === FRAME_COUNT - 1 ? "100" : end}%{`;
    for (let j = 0; j < FRAME_COUNT; j++) {
      if (j > 0) keyframes += ";";
      keyframes += `--f${j}:${j === i ? "visible" : "hidden"}`;
    }
    keyframes += "}";
  }
  keyframes += "}";

  // Extract inner SVG content (paths) from each frame, stripping the outer <svg> wrapper
  const innerFrames = frames.map((svg, i) => {
    const innerMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    const inner = innerMatch ? innerMatch[1] : svg;
    return `<g style="visibility:var(--f${i},hidden)">${inner}</g>`;
  });

  // Get viewBox from first frame SVG
  const viewBoxMatch = frames[0].match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${frameWidth} ${frameHeight}`;

  const animated = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${frameWidth}" height="${frameHeight}">`,
    `<style>${keyframes}.anim{animation:play ${totalDuration}ms steps(1) infinite}</style>`,
    `<g class="anim">`,
    ...innerFrames,
    `</g>`,
    `</svg>`,
  ].join("");

  return { frames, animated };
}
