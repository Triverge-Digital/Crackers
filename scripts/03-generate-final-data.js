#!/usr/bin/env node

/**
 * 03-generate-final-data.js
 *
 * Reads the matching JSON (02-match-images-to-products.json),
 * copies & renames images to clean filenames,
 * and outputs a final onboarding JSON (final-product-data.json)
 * ready to be used by the Medusa seed script or Supabase import.
 *
 * Usage:
 *   node scripts/03-generate-final-data.js
 *
 * Prerequisites:
 *   - 02-match-images-to-products.json exists in scripts/
 *   - Source images exist in ../Ecommerce Fire Crackers Website/images/
 */

const fs = require("fs");
const path = require("path");

const SCRIPTS_DIR = __dirname;
const ROOT_DIR = path.resolve(SCRIPTS_DIR, "..");
const SOURCE_IMAGES_DIR = path.resolve(
  ROOT_DIR,
  "..",
  "Ecommerce Fire Crackers Website",
  "images"
);
const OUTPUT_IMAGES_DIR = path.resolve(
  ROOT_DIR,
  "bwcrackers-storefront",
  "public",
  "images",
  "products"
);
const MATCH_FILE = path.join(SCRIPTS_DIR, "02-match-images-to-products.json");
const OUTPUT_FILE = path.join(SCRIPTS_DIR, "final-product-data.json");

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_IMAGES_DIR)) {
  fs.mkdirSync(OUTPUT_IMAGES_DIR, { recursive: true });
}

// Read matching data
const matchData = JSON.parse(fs.readFileSync(MATCH_FILE, "utf-8"));

// Helper: generate a clean filename from product name
function cleanFilename(code, product) {
  const clean = product
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `bw-${code}-${clean}.jpeg`;
}

// Helper: generate a URL-friendly handle
function toHandle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Fallback image for products without a specific photo
const FALLBACK_IMAGE = "WhatsApp Image 2026-04-01 at 02.00.47.jpeg"; // B&W Crackers banner
const FALLBACK_CLEAN = "bw-brand-banner.jpeg";

// Copy fallback image
const fallbackSrc = path.join(SOURCE_IMAGES_DIR, FALLBACK_IMAGE);
const fallbackDst = path.join(OUTPUT_IMAGES_DIR, FALLBACK_CLEAN);
if (fs.existsSync(fallbackSrc)) {
  fs.copyFileSync(fallbackSrc, fallbackDst);
  console.log(`  Copied fallback: ${FALLBACK_CLEAN}`);
}

// Process matched products
const products = [];
const imagesCopied = new Set();

console.log("\n--- Processing matched products ---\n");

for (const match of matchData.matched) {
  const cleanName = cleanFilename(match.code, match.product);
  const srcPath = path.join(SOURCE_IMAGES_DIR, match.image_file);
  const dstPath = path.join(OUTPUT_IMAGES_DIR, cleanName);

  // Copy and rename image
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
    imagesCopied.add(cleanName);
    console.log(
      `  [${match.code}] ${match.product} => ${cleanName} (${match.confidence})`
    );
  } else {
    console.warn(`  WARNING: Source image not found: ${match.image_file}`);
  }

  products.push({
    code: match.code,
    title: match.product,
    category: match.category,
    mrp: match.mrp,
    discount_price: match.discount_price,
    unit: match.unit,
    handle: toHandle(match.product),
    image_path: `/images/products/${cleanName}`,
    image_file: cleanName,
    source_image: match.image_file,
    confidence: match.confidence,
  });
}

// Process unmatched products (use fallback image)
console.log("\n--- Processing unmatched products (using fallback image) ---\n");

for (const unmatched of matchData.unmatched_products) {
  // Find best fallback: use the Lakshmi crackers bulk image for sound crackers,
  // or the brand banner for others
  let fallbackFile = FALLBACK_CLEAN;

  // Use Lakshmi bulk image for sound/deluxe crackers
  if (
    unmatched.product.includes("Lakshmi") ||
    unmatched.product.includes("Deluxe") ||
    unmatched.product.includes("Chorsa") ||
    unmatched.product.includes("Giant")
  ) {
    const lakshmiClean = "bw-3-4-lakshmi.jpeg";
    if (imagesCopied.has(lakshmiClean)) {
      fallbackFile = lakshmiClean;
    }
  }

  console.log(
    `  [${unmatched.code}] ${unmatched.product} => ${fallbackFile} (fallback)`
  );

  // Parse the product info from the excel data embedded in matching JSON
  const categoryMap = {
    "3 1/2\" Lakshmi": {
      cat: "Single Sound Crackers",
      mrp: 80,
      dp: 16,
      unit: "1 PKT",
    },
    '4" Deluxe Lakshmi': {
      cat: "Single Sound Crackers",
      mrp: 150,
      dp: 30,
      unit: "1 PKT",
    },
    '4" Gold Lakshmi': {
      cat: "Single Sound Crackers",
      mrp: 175,
      dp: 35,
      unit: "1 PKT",
    },
    '5" Mega Lakshmi': {
      cat: "Single Sound Crackers",
      mrp: 190,
      dp: 38,
      unit: "1 PKT",
    },
    "28 Chorsa": {
      cat: "Single Sound Crackers",
      mrp: 70,
      dp: 14,
      unit: "1 PKT",
    },
    "28 Giant": {
      cat: "Single Sound Crackers",
      mrp: 120,
      dp: 24,
      unit: "1 PKT",
    },
    "56 Giant": {
      cat: "Single Sound Crackers",
      mrp: 200,
      dp: 40,
      unit: "1 PKT",
    },
    "50 Deluxe": {
      cat: "Deluxe Crackers",
      mrp: 500,
      dp: 100,
      unit: "1 PKT",
    },
    "100 Deluxe": {
      cat: "Deluxe Crackers",
      mrp: 1100,
      dp: 220,
      unit: "1 PKT",
    },
  };

  const info = categoryMap[unmatched.product];
  if (info) {
    products.push({
      code: unmatched.code,
      title: unmatched.product,
      category: info.cat,
      mrp: info.mrp,
      discount_price: info.dp,
      unit: info.unit,
      handle: toHandle(unmatched.product),
      image_path: `/images/products/${fallbackFile}`,
      image_file: fallbackFile,
      source_image: "fallback",
      confidence: "fallback",
    });
  }
}

// Sort by code
products.sort((a, b) => parseInt(a.code) - parseInt(b.code));

// Build final output
const finalData = {
  generated_at: new Date().toISOString(),
  total_products: products.length,
  categories: [...new Set(products.map((p) => p.category))],
  summary: {
    high_confidence: products.filter((p) => p.confidence === "high").length,
    medium_confidence: products.filter((p) => p.confidence === "medium").length,
    low_confidence: products.filter((p) => p.confidence === "low").length,
    fallback_image: products.filter((p) => p.confidence === "fallback").length,
  },
  products,
};

// Write output
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
console.log(`\n--- Done ---`);
console.log(`Total products: ${finalData.total_products}`);
console.log(`Categories: ${finalData.categories.join(", ")}`);
console.log(`Confidence breakdown:`, finalData.summary);
console.log(`\nOutput: ${OUTPUT_FILE}`);
console.log(`Images: ${OUTPUT_IMAGES_DIR}`);
