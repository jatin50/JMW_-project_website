import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";
import { Category } from "../src/models/category.models.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    throw new apierrors(400, "Category name is required");
  }

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    throw new apierrors(409, "Category already exists");
  }

  const category = await Category.create({ name: name.trim() });
  return res.status(201).json(
    new apiresponse(201, category, "Category created successfully")
  );
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  return res.status(200).json(
    new apiresponse(200, categories, "Categories fetched successfully")
  );
});

export { createCategory, getCategories };