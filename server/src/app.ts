import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authenticationToken from "./middlewares/auth.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import uploadsRouter from "./routes/uploads-files.routes.js";
import thumbnailRouter from "./routes/thumbnail.routes.js";
import thumbnailPublicRouter from "./routes/thumbnail-public.routes.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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

app.get("/", (req, res) => {
  res.send("Hello TypeScript");
});

export default app;
