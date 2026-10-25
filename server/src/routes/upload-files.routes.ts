import express from "express";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";
import { avatarUploadLimiter } from "../middlewares/rate-limit.middleware.js";
import { handleUploadAvatar } from "../controllers/upload-files.controller.js";

const router = express.Router();

router.post("/avatar", avatarUploadLimiter, uploadSingleImage("avatar"), handleUploadAvatar);

export default router;
