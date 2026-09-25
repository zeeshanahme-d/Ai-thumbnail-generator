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
import { generateThumbnailSchema, publishThumbnailSchema, getThumbnailSchema } from "../validations/thumbnail.validation.js";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";
import { generateLimiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();

router.get("/", validate(getThumbnailSchema, "query"), getMyThumbnails);
router.get("/community", validate(getThumbnailSchema, "query"), getCommunityThumbnails);
router.get("/recycle-bin", validate(getThumbnailSchema, "query"), getRecycleBinThumbnails);

// The limiter runs before multer, so rejected requests never write an upload to disk.
router.post("/", generateLimiter, uploadSingleImage("referenceImage"), validate(generateThumbnailSchema), generateGminiThumbnail);

router.patch("/:id/publish", validate(publishThumbnailSchema), publishThumbnailToCommunity);

router.post("/:id/like", likeDislikeThumbnail);

router.delete("/:id", softDeleteThumbnail);

router.patch("/:id/restore", restoreThumbnail);

router.delete("/:id/permanent", permanentDeleteThumbnail);

export default router;
