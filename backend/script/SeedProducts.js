// Bulk-imports products from scripts/products.json, uploading each photo to
// ImageKit and inserting straight into MongoDB - the same effective path as
// the admin "Upload product" form, just automated for many products at once.
//
// SETUP:
// 1. Drop your product photos into backend/scripts/product-images/
// 2. Fill in backend/scripts/products.json (see products.example.json for the format)
// 3. From the backend/ folder, run:  node -r dotenv/config scripts/seedProducts.js
//
// Your original photos are never touched - this script copies each one to a
// temp file before uploading, because the existing ImageKit upload utility
// deletes whatever local file you point it at once the upload succeeds.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ConnectionDB from "../src/db/index.js";
import { Product } from "../src/models/product.models.js";
import { Category } from "../src/models/category.models.js";
import uploadToImageKit from "../src/utils/imagekit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "product-images");
const PRODUCTS_JSON = path.join(__dirname, "products.json");
const TEMP_DIR = path.join(__dirname, ".tmp-upload");

const categoryCache = new Map(); // name (lowercase) -> ObjectId, avoids repeat DB lookups

const getOrCreateCategoryId = async (name) => {
  const key = name.trim().toLowerCase();
  if (categoryCache.has(key)) return categoryCache.get(key);

  let category = await Category.findOne({ name: new RegExp(`^${name.trim()}$`, "i") });
  if (!category) {
    category = await Category.create({ name: name.trim() });
    console.log(`  + created new category "${name.trim()}"`);
  }
  categoryCache.set(key, category._id);
  return category._id;
};

const seed = async () => {
  if (!fs.existsSync(PRODUCTS_JSON)) {
    console.error(`Missing ${PRODUCTS_JSON}. Copy products.example.json to products.json and fill it in.`);
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, "utf-8"));
  if (!Array.isArray(products) || products.length === 0) {
    console.error("products.json must be a non-empty array.");
    process.exit(1);
  }

  fs.mkdirSync(TEMP_DIR, { recursive: true });
  await ConnectionDB();

  let succeeded = 0;
  const failed = [];

  for (const [index, entry] of products.entries()) {
    const label = entry.name || `#${index + 1}`;
    try {
      if (!entry.name || !entry.price || !entry.image || !entry.category || !entry.description || !entry.fabric || !entry.gsm || !Array.isArray(entry.variants) || entry.variants.length === 0) {
        throw new Error("missing one of: name, price, image, category, description, fabric, gsm, variants");
      }

      const sourcePath = path.join(IMAGES_DIR, entry.image);
      if (!fs.existsSync(sourcePath)) {
        throw new Error(`image not found at product-images/${entry.image}`);
      }

      // copy to a throwaway temp path - uploadToImageKit deletes whatever path it's given
      const tempPath = path.join(TEMP_DIR, `${Date.now()}-${entry.image}`);
      fs.copyFileSync(sourcePath, tempPath);

      const uploadResult = await uploadToImageKit(tempPath);
      if (!uploadResult.success) {
        throw new Error(`ImageKit upload failed - ${uploadResult.message}`);
      }

      const categoryId = await getOrCreateCategoryId(entry.category);

      await Product.create({
        name: entry.name,
        price: entry.price,
        description: entry.description,
        fabric: entry.fabric,
        gsm: entry.gsm,
        discount: entry.discount || 0,
        category: categoryId,
        variants: entry.variants.map((v) => ({
          color: v.color.trim(),
          size: v.size.trim(),
          stock: Number(v.stock),
        })),
        imageUrl: uploadResult.url,
        imageFileId: uploadResult.fileId,
      });

      succeeded++;
      console.log(`[${succeeded}/${products.length}] uploaded "${label}"`);
    } catch (err) {
      failed.push({ label, reason: err.message });
      console.error(`  x failed "${label}": ${err.message}`);
    }
  }

  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  console.log(`\nDone: ${succeeded} uploaded, ${failed.length} failed.`);
  if (failed.length > 0) {
    console.log("Failed entries:", failed);
  }
  process.exit(0);
};

seed();