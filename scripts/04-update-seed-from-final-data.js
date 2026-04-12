#!/usr/bin/env node

/**
 * 04-update-seed-from-final-data.js
 *
 * Reads final-product-data.json and updates the Medusa seed script
 * (bwcrackers/src/scripts/seed.ts) to use the correctly mapped images.
 *
 * Usage:
 *   node scripts/04-update-seed-from-final-data.js
 */

const fs = require("fs");
const path = require("path");

const SCRIPTS_DIR = __dirname;
const FINAL_DATA = path.join(SCRIPTS_DIR, "final-product-data.json");
const SEED_FILE = path.join(
  SCRIPTS_DIR,
  "..",
  "bwcrackers",
  "src",
  "scripts",
  "seed.ts"
);

const data = JSON.parse(fs.readFileSync(FINAL_DATA, "utf-8"));

// Build the productsData array as TypeScript code
const lines = data.products.map((p) => {
  const title = p.title.replace(/'/g, "\\'").replace(/"/g, '\\"');
  return `    { code: "${p.code}", title: "${title}", mrp: ${p.mrp}, discountPrice: ${p.discount_price}, unit: "${p.unit}", category: "${p.category}", image: "${p.image_path}" }`;
});

const productsArrayCode = `  const productsData = [\n${lines.join(",\n")}\n  ];`;

// Read existing seed file
let seedContent = fs.readFileSync(SEED_FILE, "utf-8");

// Replace the productsData array
const startMarker = "  // Product data from Excel price list";
const endMarker = "  const handle = (title: string) =>";

const startIdx = seedContent.indexOf(startMarker);
const endIdx = seedContent.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  // Try alternative: find the productsData declaration
  const altStart = seedContent.indexOf("const productsData = [");
  const altEnd = seedContent.indexOf("];", altStart);
  if (altStart === -1 || altEnd === -1) {
    console.error(
      "ERROR: Could not find productsData array in seed.ts. Please update manually."
    );
    process.exit(1);
  }

  // Find the start of the line
  const lineStart = seedContent.lastIndexOf("\n", altStart) + 1;
  seedContent =
    seedContent.substring(0, lineStart) +
    `  // Product data from Excel price list - images matched by visual analysis\n` +
    productsArrayCode +
    "\n\n" +
    seedContent.substring(altEnd + 2);
} else {
  seedContent =
    seedContent.substring(0, startIdx) +
    `// Product data from Excel price list - images matched by visual analysis\n` +
    productsArrayCode +
    "\n\n  " +
    seedContent.substring(endIdx);
}

fs.writeFileSync(SEED_FILE, seedContent);

console.log(`Updated seed.ts with ${data.products.length} products`);
console.log(`Seed file: ${SEED_FILE}`);
console.log(
  `\nNext steps:\n  1. Review the seed file\n  2. Reset database and re-seed:\n     cd bwcrackers\n     dropdb medusa-bwcrackers && createdb medusa-bwcrackers\n     npx medusa db:migrate\n     npm run seed\n     npx medusa user -e admin@bwcrackers.com -p admin123`
);
