import express from "express";
import { getCommunityThumbnails } from "../controllers/thumbnail.controller.js";

const router = express.Router();

router.get("/community", getCommunityThumbnails);



export default router;
