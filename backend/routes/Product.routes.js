import { Router } from "express";
import { UploadProduct } from "../controllers/Product.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.route("/upload-product").post(
  upload.single("imageUrl"),
  UploadProduct
);
export default router;