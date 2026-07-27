import express from "express";
import userModel from "../models/user.model.js";
import authenticationToken from "../middlewares/auth.middleware.js";
import { handleUpdateUserProfile } from "../controllers/user.controller.js";
import validate from "../middlewares/validate.js";
import { updateProfileSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }
});

router.patch(
  "/profile",
  authenticationToken,
  validate(updateProfileSchema),
  handleUpdateUserProfile,
);

export default router;

