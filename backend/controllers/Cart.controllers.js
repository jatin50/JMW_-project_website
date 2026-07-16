import { Cart } from "../src/models/cart.models.js";
import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { Product } from "../src/models/product.models.js";
import { apiresponse } from "../src/utils/apiresponse.js";

// recompute the cart total using each line item's live product price/discount
// productId may be a raw ObjectId or an already-populated product object, depending on the caller
const recalculateTotal = async (cart) => {
  let total = 0;
  for (const item of cart.products) {
    const productId = item.productId?._id || item.productId;
    const product = await Product.findById(productId);
    if (!product) continue;
    const unitPrice = product.discount > 0
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : product.price;
    total += unitPrice * item.quantity;
  }
  cart.TotalPrice = total;
};

const addToCart = asyncHandler(async (req, res) => {
  const { variantId, quantity = 1 } = req.body;
  if (!variantId) {
    throw new apierrors(400, "variantId is required (pick a color/size)");
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new apierrors(404, "Product Not Found");
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw new apierrors(404, "Selected color/size is not available for this product");
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, products: [] });
  }

  const existingLine = cart.products.find(
    (p) => p.productId.toString() === product._id.toString() && p.variantId.toString() === variantId
  );

  const currentQtyInCart = existingLine ? existingLine.quantity : 0;
  if (currentQtyInCart + quantity > variant.stock) {
    throw new apierrors(400, `Only ${variant.stock} left in stock for this color/size`);
  }

  if (existingLine) {
    existingLine.quantity += quantity;
  } else {
    cart.products.push({
      productId: product._id,
      variantId: variant._id,
      color: variant.color,
      size: variant.size,
      quantity,
    });
  }

  await recalculateTotal(cart);
  await cart.save();
  await cart.populate("products.productId", "name price imageUrl discount");

  return res.status(200).json(
    new apiresponse(200, cart, "Product added to cart successfully")
  );
});

const deleteFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    throw new apierrors(404, "cart not found");
  }

  const { productId, variantId } = req.params;
  const lineIndex = cart.products.findIndex(
    (p) => p.productId.toString() === productId && p.variantId.toString() === variantId
  );
  if (lineIndex === -1) {
    throw new apierrors(404, "Item not found in cart");
  }

  cart.products.splice(lineIndex, 1);
  await recalculateTotal(cart);
  await cart.save();
  await cart.populate("products.productId", "name price imageUrl discount");

  return res.status(200).json(
    new apiresponse(200, cart, "Item removed from cart successfully")
  );
});

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate(
    "products.productId",
    "name price imageUrl discount"
  );
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, products: [] });
  }

  // if a product was deleted (e.g. by an admin) after being added to someone's cart,
  // populate() returns null for it - strip those stale lines out instead of crashing the client
  const validProducts = cart.products.filter((item) => item.productId !== null);
  if (validProducts.length !== cart.products.length) {
    cart.products = validProducts;
    await recalculateTotal(cart);
    await cart.save();
    await cart.populate("products.productId", "name price imageUrl discount");
  }

  return res.status(200).json(
    new apiresponse(200, cart, "cart fetched successfully")
  );
});

const decreaseQuantity = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  console.log(cart)
  if (!cart) {
    throw new apierrors(404, "cart not found");
  }

  const { productId, variantId } = req.params;
  const lineIndex = cart.products.findIndex(
    (p) => p.productId.toString() === productId && p.variantId.toString() === variantId
  );
  if (lineIndex === -1) {
    throw new apierrors(404, "Item not found in cart");
  }

  if (cart.products[lineIndex].quantity > 1) {
    cart.products[lineIndex].quantity -= 1;
  } else {
    cart.products.splice(lineIndex, 1);
  }

  await recalculateTotal(cart);
  await cart.save();
  await cart.populate("products.productId", "name price imageUrl discount");

  return res.status(200).json(
    new apiresponse(200, cart, "Quantity updated successfully")
  );
});

export { addToCart, deleteFromCart, getCart, decreaseQuantity };