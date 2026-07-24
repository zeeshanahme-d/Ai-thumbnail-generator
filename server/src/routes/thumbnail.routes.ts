import express from "express";
import validate from "../middlewares/validate.js";
import authenticationToken from "../middlewares/auth.middleware.js";
import {
  generateGminiThumbnail,
  generateHFThumbnail,
} from "../controllers/thumbnail.controller.js";

const router = express.Router();

router.post("/", authenticationToken, generateGminiThumbnail);
router.post("/hf", authenticationToken, generateHFThumbnail);

export default router;
