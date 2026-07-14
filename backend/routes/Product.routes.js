import { Router } from "express";
import { UploadProduct, getProducts, getProductById, UpdateProduct, DeleteProduct, restockVariant } from "../controllers/Product.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { addToCart, deleteFromCart, getCart, decreaseQuantity } from "../controllers/Cart.controllers.js";
import { VerifyJwt, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// product routes
router.route("/upload-product").post(
  VerifyJwt,
  isAdmin,
  upload.single("imageUrl"),
  UploadProduct
);
router.route("/").get(getProducts)

// cart routes (must be registered before the dynamic /:productId route below)
router.route("/cart").get(VerifyJwt, getCart)
router.route("/cart/:productId").post(VerifyJwt, addToCart)
router.route("/cart/:productId/:variantId").delete(VerifyJwt, deleteFromCart)
router.route("/cart/:productId/:variantId/decrease").patch(VerifyJwt, decreaseQuantity)

router.route("/:productId").get(getProductById)
router.route("/:productId").patch(VerifyJwt, isAdmin, upload.single("imageUrl"), UpdateProduct)
router.route("/:productId").delete(VerifyJwt, isAdmin, DeleteProduct)
router.route("/:productId/variants/:variantId/restock").patch(VerifyJwt, isAdmin, restockVariant)

export default router;