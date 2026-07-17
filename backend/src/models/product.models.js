import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageFileId: {
      type: String,
      required: true,
    },
    fabric: {
      type: String,
      required: true,
    },
    gsm: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    variants: {
      type: [variantSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one color/size variant is required",
      },
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

// category filter (GET /products?category=...) and admin per-category listing
productSchema.index({ category: 1 });
// price sort / min-max filter (GET /products?sort=price&minPrice=&maxPrice=)
productSchema.index({ price: 1 });