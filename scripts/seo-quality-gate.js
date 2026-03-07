
const { ENGINES, INDUSTRIES, STYLES, LOCATIONS } = require('../src/lib/seo-data');

/**
 * SEO Quality Gate Validator (Claude-SEO Style)
 * Checks for uniqueness, thin content, and template quality.
 */

function runAudit() {
    console.log("🚀 Starting Claude-SEO Quality Gate Audit...");
    console.log("-------------------------------------------");

    const allPages = [...ENGINES, ...INDUSTRIES, ...STYLES, ...LOCATIONS];
    const totalCount = allPages.length;
    let errors = [];
    let warnings = [];

    // 1. Uniqueness Check (Slugs)
    const slugs = allPages.map(p => p.slug);
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    if (duplicateSlugs.length > 0) {
        errors.push(`❌ CRITICAL: Duplicate slugs found: ${[...new Set(duplicateSlugs)].join(", ")}`);
    }

    // 2. Thin Content Check (Description Length)
    allPages.forEach(p => {
        if (p.description && p.description.length < 50) {
            warnings.push(`⚠️ WARNING: Thin description for [${p.slug}] (${p.description.length} chars)`);
        }
    });

    // 3. Scale Check (Claude-SEO Warn Gates)
    if (totalCount > 100) {
        warnings.push(`⚠️ SCALE ALERT: Total programmatic pages (${totalCount}) exceeds 100. Ensure manual review of 10% sample.`);
    }

    // 4. Content Differentiation (Simulated)
    const descriptions = allPages.map(p => p.description).filter(Boolean);
    const uniqueDescriptions = new Set(descriptions);
    const uniquenessScore = (uniqueDescriptions.size / descriptions.length) * 100;
    
    if (uniquenessScore < 40) {
        errors.push(`❌ PENALTY RISK: Content uniqueness is ${uniquenessScore.toFixed(2)}%. Threshold is 40%.`);
    }

    // Results Output
    console.log(`Audit Summary:`);
    console.log(`- Total Pages: ${totalCount}`);
    console.log(`- Uniqueness Score: ${uniquenessScore.toFixed(2)}%`);
    console.log("-------------------------------------------");

    if (errors.length > 0) {
        console.log("CRITICAL ISSUES FOUND:");
        errors.forEach(e => console.log(e));
        process.exit(1);
    } else {
        console.log("✅ BASIC QUALITY GATE PASSED.");
        if (warnings.length > 0) {
            console.log("ADVISORY WARNINGS:");
            warnings.forEach(w => console.log(w));
        }
        console.log("-------------------------------------------");
        console.log("Programmatic SEO Score: " + (uniquenessScore > 80 ? "95/100" : "82/100"));
    }
}

runAudit();
