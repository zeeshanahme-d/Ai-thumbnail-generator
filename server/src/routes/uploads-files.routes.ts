import express from "express";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";
import { handleUploadImage } from "../controllers/uploads-files.controller.js";

const router = express.Router();

router.post("/image", uploadSingleImage("imageFile"), handleUploadImage);

export default router;
