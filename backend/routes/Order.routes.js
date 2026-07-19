import { Router } from "express";
import { createRazorpayOrder, verifyPaymentAndPlaceOrder, placeCODOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } from "../controllers/Order.controllers.js";
import { VerifyJwt, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();
console.log("Order routes loaded");
router.use(VerifyJwt); // every order route requires login

router.route("/").get(getMyOrders);
router.route("/create-payment").post(createRazorpayOrder);
router.route("/verify-payment").post(verifyPaymentAndPlaceOrder);
router.route("/place-cod").post(placeCODOrder);
router.route("/admin/all").get(isAdmin, getAllOrders);
router.route("/admin/:orderId/status").patch(isAdmin, updateOrderStatus);
router.route("/:orderId").get(getOrderById);
router.route("/:orderId/cancel").patch(cancelOrder);

export default router;