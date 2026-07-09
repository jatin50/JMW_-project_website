import { Router } from "express";
import { RegisterUser, LoginUser, LogoutUser, refreshAccessToken, ChangePassword, GetUser } from "../controllers/User.controller.js";
import { VerifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/logout").post(VerifyJwt, LogoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(VerifyJwt, ChangePassword)
router.route("/me").get(VerifyJwt, GetUser)

export default router;