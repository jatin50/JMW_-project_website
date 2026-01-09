import { Router } from "express";
import { UploadProduct } from "../controllers/Product.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { RegisterUser } from "../controllers/User.controller.js";
import { LoginUser,LogoutUser } from "../controllers/User.controller.js";
import { VerifyJwt } from "../middleware/auth.middleware.js";
const router = Router();
router.route("/upload-product").post(
  upload.single("imageUrl"),
  UploadProduct
);
router.route("/register").post(
  upload.single("imageUrl"),
  RegisterUser
)
router.route("/login").post(LoginUser)
router.route("/logout").post(
  VerifyJwt,
  LogoutUser
)
export default router;