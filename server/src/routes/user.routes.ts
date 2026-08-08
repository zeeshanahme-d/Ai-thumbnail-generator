import express from "express";
import authenticationToken from "../middlewares/auth.middleware.js";
import { handleUpdateUserProfile, handleCheckUsername, handleGetPublicProfile } from "../controllers/user.controller.js";
import validate from "../middlewares/validate.js";
import { updateProfileSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.get("/check-username/:username", handleCheckUsername);
router.get("/:username/profile", handleGetPublicProfile);

// Protected routes
router.patch("/profile", authenticationToken, validate(updateProfileSchema), handleUpdateUserProfile,);

export default router;

