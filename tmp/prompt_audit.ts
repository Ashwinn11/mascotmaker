import { STYLES, SUBJECT_TYPES, buildPrompt } from "../src/lib/prompts";

const userPrompt = "food pack";

console.log("# PROMPT AUDIT REPORT");
console.log(`User Input: "${userPrompt}"\n`);

SUBJECT_TYPES.forEach((subject) => {
    console.log(`## Subject: ${subject.label}`);
    STYLES.forEach((style) => {
        const prompt = buildPrompt(subject.value, style.prompt, userPrompt, false);
        console.log(`### Style: ${style.label}`);
        console.log("```");
        console.log(prompt);
        console.log("```\n");
    });
});
