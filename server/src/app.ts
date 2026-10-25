import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authenticationToken from "./middlewares/auth.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import uploadsRouter from "./routes/upload-files.routes.js";
import thumbnailRouter from "./routes/thumbnail.routes.js";
import thumbnailPublicRouter from "./routes/thumbnail-public.routes.js";
import billingRouter from "./routes/billing.routes.js";
import { handlePaddleWebhook } from "./controllers/billing.controller.js";
import errorHandler from "./middlewares/error.middleware.js";
import { ApiResponse } from "./utils/apiResponse.js";
import { getClientOrigins } from "./utils/helpers.js";
import { RequestErrorCode } from "./constants/enums.js";

const app = express();

// Behind a reverse proxy (Render, Railway, Nginx), set TRUST_PROXY to the number of proxy
// hops, usually 1, so req.ip and the rate limits see the real client IP. Leave it unset when
// clients connect directly, or they could fake X-Forwarded-For to dodge the limits.
const trustProxy = process.env.TRUST_PROXY;
if (trustProxy) {
  app.set("trust proxy", /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);
}

app.use(helmet());

// Paddle signs the exact request bytes, so the webhook reads the raw body before express.json parses it.
app.post("/billing/webhook", express.text({ type: "application/json", limit: "1mb" }), handlePaddleWebhook);

app.use(express.json({
  limit: "2mb",
}));
const isAllowedOrigin = (origin: string) => getClientOrigins().includes(origin);

app.use(
  cors({
    origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin)),
    credentials: true,
  }),
);

// CORS only hides the response; a form posted from another site still runs. Browsers send
// Origin on such writes, so refuse any write that comes from a site not in CLIENT_URL.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.get("origin");
  if (origin && !SAFE_METHODS.has(req.method) && !isAllowedOrigin(origin)) {
    return ApiResponse.error(res, 403, "This origin is not allowed.", RequestErrorCode.OriginNotAllowed);
  }
  next();
});
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

