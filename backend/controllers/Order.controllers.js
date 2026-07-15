import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";
import { Order } from "../src/models/order.models.js";
import { Cart } from "../src/models/cart.models.js";
import { Address } from "../src/models/adress.models.js";
import { Product } from "../src/models/product.models.js";
import razorpay from "../src/utils/razorpay.js";
import crypto from "crypto";

// shared: confirms every cart line still has enough stock in its specific variant
const assertCartStockAvailable = async (cart) => {
  const products = await Product.find({ _id: { $in: cart.products.map((item) => item.productId) } });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  for (const item of cart.products) {
    const product = productMap.get(item.productId.toString());
    if (!product) {
      throw new apierrors(404, "One of the products in your cart no longer exists");
    }
    const variant = product.variants.id(item.variantId);
    if (!variant) {
      throw new apierrors(404, `${product.name} (${item.color}/${item.size}) is no longer available`);
    }
    if (variant.stock < item.quantity) {
      throw new apierrors(400, `${product.name} (${item.color}/${item.size}) only has ${variant.stock} left`);
    }
  }
  return productMap;
};

const decrementCartStock = async (cart) => {
  await Promise.all(
    cart.products.map(async (item) => {
      const product = await Product.findById(item.productId);
      const variant = product.variants.id(item.variantId);
      variant.stock -= item.quantity;
      await product.save();
    })
  );
};

const restockOrderItems = async (order) => {
  await Promise.all(
    order.orderitems.map(async (item) => {
      const product = await Product.findById(item.porductId);
      if (!product) return;
      const variant = product.variants.id(item.variantId);
      if (variant) {
        variant.stock += item.quantity;
        await product.save();
      }
    })
  );
};

// step 1: create a Razorpay order for the current cart total
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { addressId } = req.body;
  if (!addressId) {
    throw new apierrors(400, "Address is required to place an order");
  }

  const address = await Address.findOne({ _id: addressId, userId: req.user._id });
  if (!address) {
    throw new apierrors(404, "Address not found");
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.products.length === 0) {
    throw new apierrors(400, "Cart is empty");
  }

  await assertCartStockAvailable(cart);

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(cart.TotalPrice * 100), // razorpay expects paise
    currency: "INR",
    receipt: `receipt_${req.user._id}`,
  });

  return res.status(200).json(
    new apiresponse(200, {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    }, "Razorpay order created")
  );
});

// step 2: verify the payment signature, then actually create the order and decrement stock
const verifyPaymentAndPlaceOrder = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, addressId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !addressId) {
    throw new apierrors(400, "Missing payment verification details");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new apierrors(400, "Payment verification failed");
  }

  const address = await Address.findOne({ _id: addressId, userId: req.user._id });
  if (!address) {
    throw new apierrors(404, "Address not found");
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.products.length === 0) {
    throw new apierrors(400, "Cart is empty");
  }

  // re-check stock right before committing - it may have changed since checkout started
  await assertCartStockAvailable(cart);
  await decrementCartStock(cart);

  const order = await Order.create({
    orderprice: cart.TotalPrice,
    orderitems: cart.products.map((item) => ({
      porductId: item.productId,
      variantId: item.variantId,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    })),
    userId: req.user._id,
    address: address._id,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    isPaid: true,
    paidAt: Date.now(),
  });

  cart.products = [];
  cart.TotalPrice = 0;
  await cart.save();

  return res.status(201).json(
    new apiresponse(201, order, "Payment verified, order placed successfully")
  );
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate("orderitems.porductId", "name price imageUrl")
    .populate("address")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new apiresponse(200, orders, "Orders fetched successfully")
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id })
    .populate("orderitems.porductId", "name price imageUrl")
    .populate("address");

  if (!order) {
    throw new apierrors(404, "Order not found");
  }

  return res.status(200).json(
    new apiresponse(200, order, "Order fetched successfully")
  );
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id });
  if (!order) {
    throw new apierrors(404, "Order not found");
  }
  if (order.status !== "PENDING") {
    throw new apierrors(400, `Order already ${order.status.toLowerCase()}, cannot cancel`);
  }

  await restockOrderItems(order);

  order.status = "CANCELLED";
  await order.save();

  return res.status(200).json(
    new apiresponse(200, order, "Order cancelled successfully")
  );
});

export { createRazorpayOrder, verifyPaymentAndPlaceOrder, getMyOrders, getOrderById, cancelOrder };