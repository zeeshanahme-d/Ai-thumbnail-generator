import express from "express";
import validate from "../middlewares/validate.js";
import {
  generateGminiThumbnail,
  generateHFThumbnail,
  getMyThumbnails,
  softDeleteThumbnail,
} from "../controllers/thumbnail.controller.js";
import { generateThumbnailSchema } from "../validations/thumbnail.validation.js";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getMyThumbnails);
router.post("/", uploadSingleImage("referenceImage"), validate(generateThumbnailSchema), generateGminiThumbnail);
router.post("/hf", generateHFThumbnail);
router.delete("/:id", softDeleteThumbnail);

export default router;
