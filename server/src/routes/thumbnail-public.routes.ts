import express from "express";
import { getCommunityThumbnails } from "../controllers/thumbnail.controller.js";
import { getThumbnailSchema } from "../validations/thumbnail.validation.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.get("/community", validate(getThumbnailSchema, "query"), getCommunityThumbnails);



export default router;
