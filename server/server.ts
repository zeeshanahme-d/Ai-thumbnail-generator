import "dotenv/config";
import app from "./src/app.js";
import connectMongoose from "./src/db/connection.js";
import { startScheduledJobs } from "./src/utils/scheduled-jobs.js";
import logger from "./src/utils/logger.js";

const PORT = Number(process.env.PORT) || 8000;

// Without these, tokens would be signed with an empty or shared key. Names only, never values.
// In production CLIENT_URL is required too: without it CORS lets no browser in.
const REQUIRED_ENV = ["SECRET", "REFRESH_SECRET", "MONGO_DB_URL"];
if (process.env.NODE_ENV === "production") REQUIRED_ENV.push("CLIENT_URL");

const startServer = async () => {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length) {
    logger.error("Missing required environment variables", { missing });
    process.exit(1);
  }
  if (process.env.NODE_ENV === "production" && !process.env.TRUST_PROXY) {
    logger.warn("TRUST_PROXY is unset: behind a reverse proxy every visitor shares one rate-limit bucket");
  }
  if (process.env.SECRET === process.env.REFRESH_SECRET) {
    logger.error("REFRESH_SECRET must be different from SECRET");
    process.exit(1);
  }

  try {
    await connectMongoose();

    logger.info("MongoDB connected");

    startScheduledJobs();

    app.listen(PORT, () => {
      logger.info("Server running", { port: PORT });
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

startServer();