import express, { type RequestHandler } from "express";
import mongoose from "mongoose";
import {
  getCommunityThumbnails,
  getThumbnailById,
  getThumbnailSharePage,
  recordThumbnailView,
} from "../controllers/thumbnail.controller.js";
import { getThumbnailSchema } from "../validations/thumbnail.validation.js";
import validate from "../middlewares/validate.js";
import { optionalAuthentication } from "../middlewares/auth.middleware.js";
import { viewLimiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();

// Paths that are not ids, like /recycle-bin, skip to the signed-in routes mounted after this router.
const idsOnly: RequestHandler = (req, _res, next) =>
  mongoose.isObjectIdOrHexString(req.params.id) ? next() : next("router");

router.get("/community", optionalAuthentication, validate(getThumbnailSchema, "query"), getCommunityThumbnails);
router.get("/:id", idsOnly, optionalAuthentication, getThumbnailById);
router.get("/:id/share", getThumbnailSharePage);
router.post("/:id/view", viewLimiter, optionalAuthentication, recordThumbnailView);

export default router;
