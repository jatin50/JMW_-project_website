import { Router } from "express";
import { createCategory, getCategories } from "../controllers/Category.controllers.js";
import { VerifyJwt, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(getCategories);
router.route("/").post(VerifyJwt, isAdmin, createCategory);

export default router;