import { Router } from "express";
import { UploadProduct, getProducts } from "../controllers/Product.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { addToCart, deleteFromCart, getCart, decreaseQuantity } from "../controllers/Cart.controllers.js";
import { VerifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

// product routes
router.route("/upload-product").post(
  upload.single("imageUrl"),
  UploadProduct
);
router.route("/").get(getProducts)

// cart routes
router.route("/cart").get(VerifyJwt, getCart)
router.route("/cart/:productId").post(VerifyJwt, addToCart)
router.route("/cart/:productId").delete(VerifyJwt, deleteFromCart)
router.route("/cart/:productId/decrease").patch(VerifyJwt, decreaseQuantity)

export default router;