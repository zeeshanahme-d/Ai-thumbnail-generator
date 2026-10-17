import express, { NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authenticationToken from "./middlewares/auth.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import uploadsRouter from "./routes/uploads-files.routes.js";
import thumbnailRouter from "./routes/thumbnail.routes.js";
import thumbnailPublicRouter from "./routes/thumbnail-public.routes.js";
import billingRouter from "./routes/billing.routes.js";
import { handlePaddleWebhook } from "./controllers/billing.controller.js";
import errorHandler from "./middlewares/error.middleware.js";
import mongoose from "mongoose";

const app = express();

// Behind a reverse proxy (Render, Railway, Nginx), set TRUST_PROXY to the number of proxy
// hops, usually 1, so req.ip and the rate limits see the real client IP. Leave it unset when
// clients connect directly, or they could fake X-Forwarded-For to dodge the limits.
const trustProxy = process.env.TRUST_PROXY;
if (trustProxy) {
  app.set("trust proxy", /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);
}

app.use(helmet());
mongoose.set("sanitizeFilter", true);

// Paddle signs the exact request bytes, so the webhook reads the raw body before express.json parses it.
app.post("/billing/webhook", express.text({ type: "application/json", limit: "1mb" }), handlePaddleWebhook);

app.use(express.json({
  limit: "2mb",
}));
app.use(
  cors({
    origin: [ "http://localhost:5173" , "http://localhost:5174" ,'https://th49h67r-5174.inc1.devtunnels.ms' ],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/upload", authenticationToken, uploadsRouter);
app.use("/thumbnail", thumbnailPublicRouter);
app.use("/thumbnail", authenticationToken, thumbnailRouter);
app.use("/billing", authenticationToken, billingRouter);

app.use("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global Express Error Handler
app.use(errorHandler);

export default app;

