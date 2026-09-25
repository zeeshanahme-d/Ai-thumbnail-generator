import express from "express";
import authenticationToken from "../middlewares/auth.middleware.js";
import { passwordCheckLimiter } from "../middlewares/rate-limit.middleware.js";
import {
  handleUpdateUserProfile,
  handleCheckUsername,
  handleGetPublicProfile,
  handleDeleteAccount,
} from "../controllers/user.controller.js";
import validate from "../middlewares/validate.js";
import { deleteAccountSchema, updateProfileSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.get("/check-username/:username", authenticationToken, handleCheckUsername);
router.get("/:username/profile", handleGetPublicProfile);

// Protected routes
router.patch("/profile", authenticationToken, validate(updateProfileSchema), handleUpdateUserProfile);
router.delete("/account", authenticationToken, passwordCheckLimiter, validate(deleteAccountSchema), handleDeleteAccount);

export default router;
