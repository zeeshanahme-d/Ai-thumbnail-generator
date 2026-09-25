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
import errorHandler from "./middlewares/error.middleware.js";
import mongoose from "mongoose";

const app = express();

app.use(helmet());
mongoose.set("sanitizeFilter", true);

app.use(express.json({
  limit: "2mb",
}));
app.use(
  cors({
    origin: [ "http://localhost:5173" , "http://localhost:5174" , ],
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

app.use("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global Express Error Handler
app.use(errorHandler);

export default app;

