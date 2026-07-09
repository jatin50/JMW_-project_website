import { Router } from "express";
import { placeOrder, getMyOrders, getOrderById, cancelOrder } from "../controllers/Order.controllers.js";
import { VerifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.use(VerifyJwt); // every order route requires login

router.route("/").get(getMyOrders).post(placeOrder);
router.route("/:orderId").get(getOrderById);
router.route("/:orderId/cancel").patch(cancelOrder);

export default router;