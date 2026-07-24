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
} from "../controllers/auth.controller.js";
import { loginSchema, signupSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/login", validate(loginSchema), handleLoginUser);
router.post("/signup", validate(signupSchema), handleSignupUser);
router.post("/refresh", handleRefreshToken);
// Public on purpose: it must be able to inspect an already-expired access token.
router.post("/verify", handleVerifyToken);
router.post("/logout", handleLogoutUser);
router.get("/me", authenticationToken, handleGetMe);

export default router;
