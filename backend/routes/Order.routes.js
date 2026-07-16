import { Router } from "express";
import { createRazorpayOrder, verifyPaymentAndPlaceOrder, placeCODOrder, getMyOrders, getOrderById, cancelOrder } from "../controllers/Order.controllers.js";
import { VerifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.use(VerifyJwt); // every order route requires login

router.route("/").get(getMyOrders);
router.route("/create-payment").post(createRazorpayOrder);
router.route("/verify-payment").post(verifyPaymentAndPlaceOrder);
router.route("/place-cod").post(placeCODOrder);
router.route("/:orderId").get(getOrderById);
router.route("/:orderId/cancel").patch(cancelOrder);

export default router;