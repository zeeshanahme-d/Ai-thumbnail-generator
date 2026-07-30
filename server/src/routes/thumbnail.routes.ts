import express from "express";
import validate from "../middlewares/validate.js";
import {
  generateGminiThumbnail,
  getMyThumbnails,
  getCommunityThumbnails,
  getRecycleBinThumbnails,
  softDeleteThumbnail,
  restoreThumbnail,
  permanentDeleteThumbnail,
  likeDislikeThumbnail,
  publishThumbnailToCommunity,
} from "../controllers/thumbnail.controller.js";
import { generateThumbnailSchema, publishThumbnailSchema } from "../validations/thumbnail.validation.js";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getMyThumbnails);
router.get("/community", getCommunityThumbnails);
router.get("/recycle-bin", getRecycleBinThumbnails);

router.post(
  "/",
  uploadSingleImage("referenceImage"),
  validate(generateThumbnailSchema),
  generateGminiThumbnail
);

router.patch(
  "/:id/publish",
  validate(publishThumbnailSchema),
  publishThumbnailToCommunity
);

router.post("/:id/like", likeDislikeThumbnail);

router.delete("/:id", softDeleteThumbnail);

router.patch("/:id/restore", restoreThumbnail);

router.delete("/:id/permanent", permanentDeleteThumbnail);

export default router;
