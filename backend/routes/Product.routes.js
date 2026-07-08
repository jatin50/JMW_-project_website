import { Router } from "express";
import { UploadProduct, getProducts } from "../controllers/Product.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { RegisterUser, LoginUser, LogoutUser, refreshAccessToken, ChangePassword, GetUser } from "../controllers/User.controller.js";
import { VerifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

// product routes
router.route("/upload-product").post(
  upload.single("imageUrl"),
  UploadProduct
);
router.route("/").get(getProducts)

router.route("/register").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/logout").post(VerifyJwt, LogoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(VerifyJwt, ChangePassword)
router.route("/me").get(VerifyJwt, GetUser)

export default router;