import express from "express";
import validate from "../middlewares/validate.js";
import authenticationToken from "../middlewares/auth.middleware.js";
import {
  authIpLimiter,
  emailSendLimiter,
  loginEmailLimiter,
  passwordCheckLimiter,
  signupIpLimiter,
} from "../middlewares/rate-limit.middleware.js";
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
  handleChangePassword,
  handleVerifyEmail,
  handleResendVerification,
} from "../controllers/auth.controller.js";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  changePasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

// Limiters run before validation so malformed requests count too.
router.post("/login", authIpLimiter, loginEmailLimiter, validate(loginSchema), handleLoginUser);
router.post("/signup", authIpLimiter, signupIpLimiter, validate(signupSchema), handleSignupUser);
router.post("/refresh", handleRefreshToken);
router.post("/verify", handleVerifyToken);
router.post("/logout", handleLogoutUser);
router.get("/me", authenticationToken, handleGetMe);
router.post("/forgot-password", authIpLimiter, emailSendLimiter, validate(forgotPasswordSchema), handleForgotPassword);
router.post("/verify-otp", authIpLimiter, validate(verifyOtpSchema), handleVerifyOtp);
router.post("/reset-password", authIpLimiter, validate(resetPasswordSchema), handleResetPassword);
router.post("/verify-email", authIpLimiter, validate(verifyEmailSchema), handleVerifyEmail);
router.post("/resend-verification", authIpLimiter, emailSendLimiter, validate(resendVerificationSchema), handleResendVerification);
router.post("/change-password", authenticationToken, passwordCheckLimiter, validate(changePasswordSchema), handleChangePassword);

export default router;
