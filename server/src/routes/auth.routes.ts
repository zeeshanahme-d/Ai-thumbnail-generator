import express from "express";
import validate from "../middlewares/validate.js";
import authenticationToken from "../middlewares/auth.middleware.js";
import {
  handleLoginUser,
  handleSignupUser,
  handleRefreshToken,
  handleVerifyToken,
  handleGetMe,
  handleLogoutUser,
  handleForgotPassword,
  handleResetPassword,
  handleVerifyOtp,
} from "../controllers/auth.controller.js";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/login", validate(loginSchema), handleLoginUser);
router.post("/signup", validate(signupSchema), handleSignupUser);
router.post("/refresh", handleRefreshToken);
router.post("/verify", handleVerifyToken);
router.post("/logout", handleLogoutUser);
router.get("/me", authenticationToken, handleGetMe);
router.post("/forgot-password", validate(forgotPasswordSchema), handleForgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), handleVerifyOtp);
router.post("/reset-password", validate(resetPasswordSchema), handleResetPassword);

export default router;
