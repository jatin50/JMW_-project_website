import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";
import uploadToImageKit, { deleteFromImageKit } from "../src/utils/imagekit.js";
import { Product } from "../src/models/product.models.js";

// variants arrives from multipart form-data as a JSON string, e.g.
// '[{"color":"black","size":"M","stock":10},{"color":"black","size":"L","stock":5}]'
const parseVariants = (raw) => {
  let variants;
  try {
    variants = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    throw new apierrors(400, "variants must be valid JSON");
  }
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new apierrors(400, "At least one color/size variant is required");
  }
  for (const v of variants) {
    if (!v.color?.trim() || !v.size?.trim() || v.stock === undefined || v.stock < 0) {
      throw new apierrors(400, "Each variant needs a color, size, and non-negative stock");
    }
  }
  return variants.map((v) => ({ color: v.color.trim(), size: v.size.trim(), stock: Number(v.stock) }));
};

const UploadProduct = asyncHandler(async (req, res) => {
  const { name, price, description, fabric, gsm, discount, category, variants } = req.body;

  if ([name, price, description, fabric, gsm, category, variants].some(
    (field) => field === undefined || field === null || field.toString().trim() === ""
  )) {
    throw new apierrors(402, "ALL FIELDS MUST BE FILLED");
  }

  const parsedVariants = parseVariants(variants);

  const ProductLocalPath = req.file?.path;
  if (!ProductLocalPath) {
    throw new apierrors(409, "product Image is required");
  }
  const ProductImage = await uploadToImageKit(ProductLocalPath);
  if (!ProductImage.success) {
    throw new apierrors(500, ProductImage.message || "Image upload failed");
  }

  const product = await Product.create({
    name,
    price,
    description,
    fabric,
    gsm,
    discount: discount || 0,
    category,
    variants: parsedVariants,
    imageUrl: ProductImage.url,
    imageFileId: ProductImage.fileId,
  });

  if (!product) {
    throw new apierrors(500, "Product is Not Uploaded Successfully Please Try Again");
  }

  return res.status(200).json(
    new apiresponse(200, product, "Product Uploaded Successfully")
  );
});

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  let filter = {};

  if (req.query.keyword) {
    filter.name = { $regex: req.query.keyword, $options: "i" };
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (req.query.sort === "priceLow") sortOption = { price: 1 };
  if (req.query.sort === "priceHigh") sortOption = { price: -1 };

  const totalProducts = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort(sortOption).skip(skip).limit(limit);

  res.status(200).json(
    new apiresponse(200, {
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      hasMore: page < Math.ceil(totalProducts / limit),
    })
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate("category", "name");
  if (!product) {
    throw new apierrors(404, "Product not found");
  }
  return res.status(200).json(
    new apiresponse(200, product, "Product fetched successfully")
  );
});

const UpdateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new apierrors(404, "Product not found");
  }

  const allowedFields = ["name", "price", "description", "fabric", "gsm", "discount", "category"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  if (req.body.variants !== undefined) {
    product.variants = parseVariants(req.body.variants);
  }

  if (req.file?.path) {
    const newImage = await uploadToImageKit(req.file.path);
    if (!newImage.success) {
      throw new apierrors(500, newImage.message || "Image upload failed");
    }
    await deleteFromImageKit(product.imageFileId);
    product.imageUrl = newImage.url;
    product.imageFileId = newImage.fileId;
  }

  await product.save();

  return res.status(200).json(
    new apiresponse(200, product, "Product updated successfully")
  );
});

// admin restock: set the absolute stock value for one specific color/size variant
const restockVariant = asyncHandler(async (req, res) => {
  const { stock } = req.body;
  if (stock === undefined || stock < 0) {
    throw new apierrors(400, "A non-negative stock value is required");
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new apierrors(404, "Product not found");
  }

  const variant = product.variants.id(req.params.variantId);
  if (!variant) {
    throw new apierrors(404, "Variant not found");
  }

  variant.stock = Number(stock);
  await product.save();

  return res.status(200).json(
    new apiresponse(200, product, "Stock updated successfully")
  );
});

const DeleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new apierrors(404, "Product not found");
  }

  await deleteFromImageKit(product.imageFileId);
  await product.deleteOne();

  return res.status(200).json(
    new apiresponse(200, {}, "Product deleted successfully")
  );
});

export { UploadProduct, getProducts, getProductById, UpdateProduct, DeleteProduct, restockVariant };