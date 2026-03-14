export const STYLES = [
    { id: "chibi", label: "Chibi", desc: "Cute & Cartoon", icon: "artist-palette" as const, prompt: "vibrant cartoon/chibi style, playful colors" },
    { id: "pixar", label: "Pixar", desc: "3D Cinematic", icon: "sparkles" as const, prompt: "3D modeled cinematic style, soft studio lighting, high detail" },
    { id: "game", label: "Game", desc: "Isometric 3D", icon: "classical-building" as const, prompt: "isometric 3D game asset, high-quality game art, detailed isometric perspective" },
    { id: "retro", label: "Retro", desc: "80s Film", icon: "camera" as const, prompt: "80s photograph, Kodak film grain, retro vibes, slightly faded colors" },
    { id: "pop", label: "Pop Art", desc: "Bold Comic", icon: "magic-wand" as const, prompt: "Pop Art style, thick black outlines, vibrant primary colors, Ben-Day dots" },
    { id: "minimalist", label: "Minimalist", desc: "Flat & Clean", icon: "pencil" as const, prompt: "minimalist vector art, clean lines, professional flat design, simplistic shapes" },
    { id: "clay", label: "Clay", desc: "Claymation", icon: "relieved-face" as const, prompt: "made of clay, claymation style, tactile texture, fingerprints visible" },
];

export const SUBJECT_TYPES = [
    { value: "Character", label: "Character", desc: "Full body mascot, head to feet" },
    { value: "Sticker", label: "Sticker", desc: "Die-cut Pop Art sticker" },
    { value: "Logo", label: "Logo", desc: "Minimalist vector icon" },
] as const;

export type SubjectType = typeof SUBJECT_TYPES[number]["value"];

/**
 * Centralized prompt builder for generating consistently across the app.
 * @param isStylize True if we are morphing an existing image, false if generating from scratch.
 */
export function buildPrompt(
    subjectType: string,
    stylePrompt: string,
    userPrompt: string,
    isStylize: boolean = false,
    analysisContext?: string
): string {
    const baseStyle = stylePrompt || "vibrant cartoon style, playful colors";
    let prompt = "";

    // Conditionally add analysis info if we are stylizing an existing image
    const context = analysisContext ? `The subject is: ${analysisContext}. Use these details to preserve identity. ` : "";
    const transformPrefix = isStylize ? `Transform this image into a ` : `Create a `;

    if (subjectType === "Sticker") {
        prompt = `${transformPrefix}a 9-frame 3x3 ultra-high-quality sticker set (8k resolution, sharp focus): ${userPrompt}. ${context}${baseStyle}. 
        CRITICAL: Create 9 distinct variations of the same subject. focus purely on the ${userPrompt} itself.
        STYLE: Clean, wide white die-cut border around every sticker. Ultra-clear boundaries. Bold, thick black outlines. Professional studio lighting. 
        BACKGROUND: Isolated on a SOLID, uniform Dark Charcoal Grey (#404040) background. NO grid lines, NO shadows, NO gradients on the background.`;
    } else if (subjectType === "Character") {
        prompt = `${transformPrefix}an ultra-high-resolution (8k, sharp focus) ${baseStyle} Mascot of: ${userPrompt}. ${context}Professional studio lighting, cinematic detail. 
        MASCOT TRAITS: Give the subject an expressive face, cute personality, and professional mascot character features. 
        IMPORTANT: Isolated on a SOLID, uniform Dark Charcoal Grey (#404040) background with no shadows or texture. Show the COMPLETE full body from head to feet — do NOT crop or cut off any part. High-quality character design.`;
        if (isStylize) prompt += " Keep the mascot recognizable and high-fidelity.";
    } else if (subjectType === "Logo") {
        prompt = `${transformPrefix}professional branding logo in a ${baseStyle} style: ${userPrompt}. ${context}Clean vector lines, flat design, simplistic geometric shapes. Professional brand identity style. focus on symbolic representation of the ${userPrompt}.`;
    } else {
        // Fallback/Legacy
        prompt = `${transformPrefix}richly detailed ${baseStyle} scene: ${userPrompt}. ${context}Cinematic composition, beautiful lighting.`;
    }

    return prompt;
}
