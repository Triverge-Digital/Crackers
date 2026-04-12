#!/usr/bin/env node

/**
 * 05-upload-to-cloudinary.js
 *
 * Uploads all product images to Cloudinary and generates
 * a mapping file with Cloudinary URLs to use in the seed script.
 *
 * Usage:
 *   node scripts/05-upload-to-cloudinary.js
 *
 * Requires: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Config
cloudinary.config({
  cloud_name: "dgkqsmgmy",
  api_key: "931636722919259",
  api_secret: "FkA8bsv74M80l33ljQEu6JXqTig",
});

const IMAGES_DIR = path.resolve(
  __dirname,
  "..",
  "bwcrackers-storefront",
  "public",
  "images",
  "products"
);
const FINAL_DATA = path.join(__dirname, "final-product-data.json");
const OUTPUT = path.join(__dirname, "cloudinary-urls.json");

async function main() {
  const data = JSON.parse(fs.readFileSync(FINAL_DATA, "utf-8"));

  // Collect unique image files
  const uniqueImages = [
    ...new Set(data.products.map((p) => p.image_file)),
  ];

  console.log(`Uploading ${uniqueImages.length} unique images to Cloudinary...\n`);

  const urlMap = {};

  for (const imageFile of uniqueImages) {
    const filePath = path.join(IMAGES_DIR, imageFile);

    if (!fs.existsSync(filePath)) {
      console.warn(`  SKIP: ${imageFile} (file not found)`);
      continue;
    }

    const publicId = `bwcrackers/${path.basename(imageFile, ".jpeg")}`;

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        folder: "",
        overwrite: true,
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
        ],
      });

      urlMap[imageFile] = result.secure_url;
      console.log(`  OK: ${imageFile} => ${result.secure_url}`);
    } catch (err) {
      console.error(`  ERROR: ${imageFile} => ${err.message}`);
    }
  }

  // Update product data with Cloudinary URLs
  const updatedProducts = data.products.map((p) => ({
    ...p,
    cloudinary_url: urlMap[p.image_file] || p.image_path,
    image_path: urlMap[p.image_file] || p.image_path,
  }));

  const output = {
    uploaded_at: new Date().toISOString(),
    total_uploaded: Object.keys(urlMap).length,
    url_map: urlMap,
    products: updatedProducts,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

  console.log(`\n--- Done ---`);
  console.log(`Uploaded: ${Object.keys(urlMap).length}/${uniqueImages.length}`);
  console.log(`Output: ${OUTPUT}`);
}

main().catch(console.error);
