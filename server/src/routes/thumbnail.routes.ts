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
  emptyRecycleBin,
  restoreAllThumbnails,
  improvePrompt,
  likeDislikeThumbnail,
  publishThumbnailToCommunity,
} from "../controllers/thumbnail.controller.js";
import {
  generateThumbnailSchema,
  improvePromptSchema,
  publishThumbnailSchema,
  getThumbnailSchema,
} from "../validations/thumbnail.validation.js";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";
import { generateLimiter, improvePromptLimiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();

router.get("/", validate(getThumbnailSchema, "query"), getMyThumbnails);
router.get("/community", validate(getThumbnailSchema, "query"), getCommunityThumbnails);
router.get("/recycle-bin", validate(getThumbnailSchema, "query"), getRecycleBinThumbnails);
// Registered before the /:id routes, which would otherwise take "recycle-bin" as an id.
router.delete("/recycle-bin", emptyRecycleBin);
router.patch("/recycle-bin/restore", restoreAllThumbnails);

// The limiter runs before multer, so rejected requests are never read into memory.
router.post("/", generateLimiter, uploadSingleImage("referenceImage"), validate(generateThumbnailSchema), generateGminiThumbnail);

router.post("/improve-prompt", improvePromptLimiter, validate(improvePromptSchema), improvePrompt);

router.patch("/:id/publish", validate(publishThumbnailSchema), publishThumbnailToCommunity);

router.post("/:id/like", likeDislikeThumbnail);

router.delete("/:id", softDeleteThumbnail);

router.patch("/:id/restore", restoreThumbnail);

router.delete("/:id/permanent", permanentDeleteThumbnail);

export default router;
