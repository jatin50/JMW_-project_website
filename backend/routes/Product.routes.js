import { Router } from "express";
import { UploadProduct } from "../controllers/Product.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { RegisterUser } from "../controllers/User.controller.js";
const router = Router();
router.route("/upload-product").post(
  upload.single("imageUrl"),
  UploadProduct
);
router.route("/register").post(
  upload.single("imageUrl"),
  RegisterUser
)
export default router;