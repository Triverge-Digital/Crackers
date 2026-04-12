#!/usr/bin/env node

/**
 * 06-update-seed-cloudinary.js
 *
 * Updates seed.ts to use Cloudinary URLs instead of local image paths.
 */

const fs = require("fs");
const path = require("path");

const CLOUDINARY_DATA = path.join(__dirname, "cloudinary-urls.json");
const SEED_FILE = path.join(
  __dirname,
  "..",
  "bwcrackers",
  "src",
  "scripts",
  "seed.ts"
);

const data = JSON.parse(fs.readFileSync(CLOUDINARY_DATA, "utf-8"));
let seed = fs.readFileSync(SEED_FILE, "utf-8");

// Replace each local path with its Cloudinary URL
for (const [localFile, cloudinaryUrl] of Object.entries(data.url_map)) {
  const localPath = `/images/products/${localFile}`;
  seed = seed.split(localPath).join(cloudinaryUrl);
}

fs.writeFileSync(SEED_FILE, seed);

// Count replacements
const matches = seed.match(/res\.cloudinary\.com/g);
console.log(`Updated seed.ts: ${matches ? matches.length : 0} Cloudinary URLs`);
