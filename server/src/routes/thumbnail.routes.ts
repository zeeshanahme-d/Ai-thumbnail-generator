import express from "express";
import validate from "../middlewares/validate.js";
import {
  generateGminiThumbnail,
  // generateHFThumbnail,
  getMyThumbnails,
  softDeleteThumbnail,
  restoreThumbnail,
  permanentDeleteThumbnail,
  likeThumbnail,
} from "../controllers/thumbnail.controller.js";
import { generateThumbnailSchema } from "../validations/thumbnail.validation.js";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getMyThumbnails);
router.post("/", uploadSingleImage("referenceImage"), validate(generateThumbnailSchema), generateGminiThumbnail);
// router.post("/hf", generateHFThumbnail);
router.delete("/:id", softDeleteThumbnail);
router.patch("/:id/restore", restoreThumbnail);
router.delete("/:id/permanent", permanentDeleteThumbnail);
router.post("/:id/like", likeThumbnail);
router.post("/:id/dislike", () => { });

export default router;
