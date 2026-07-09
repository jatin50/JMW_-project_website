import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";
import { Order } from "../src/models/order.models.js";
import { Cart } from "../src/models/cart.models.js";
import { Address } from "../src/models/adress.models.js";
import { Product } from "../src/models/product.models.js";

const placeOrder = asyncHandler(async (req, res) => {
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

  // verify stock for every item before committing anything
  const products = await Product.find({ _id: { $in: cart.products.map((item) => item.productId) } });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  for (const item of cart.products) {
    const product = productMap.get(item.productId.toString());
    if (!product) {
      throw new apierrors(404, "One of the products in your cart no longer exists");
    }
    if (product.stock < item.quantity) {
      throw new apierrors(400, `${product.name} only has ${product.stock} left in stock`);
    }
  }

  // decrement stock for each product
  await Promise.all(
    cart.products.map((item) =>
      Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
    )
  );

  const order = await Order.create({
    orderprice: cart.TotalPrice,
    orderitems: cart.products.map((item) => ({ porductId: item.productId, quantity: item.quantity })),
    userId: req.user._id,
    address: address._id,
  });

  cart.products = [];
  cart.TotalPrice = 0;
  await cart.save();

  return res.status(201).json(
    new apiresponse(201, order, "Order placed successfully")
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

  // restock the cancelled items
  await Promise.all(
    order.orderitems.map((item) =>
      Product.findByIdAndUpdate(item.porductId, { $inc: { stock: item.quantity } })
    )
  );

  order.status = "CANCELLED";
  await order.save();

  return res.status(200).json(
    new apiresponse(200, order, "Order cancelled successfully")
  );
});

export { placeOrder, getMyOrders, getOrderById, cancelOrder };