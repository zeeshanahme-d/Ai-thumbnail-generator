import "dotenv/config";
import app from "./src/app.js";
import connectMongoose from "./src/db/connection.js";
import { startScheduledJobs } from "./src/utils/scheduled-jobs.js";
import logger from "./src/utils/logger.js";

const PORT = Number(process.env.PORT) || 5000;

// Without these, tokens would be signed with an empty or shared key. Names only, never values.
const REQUIRED_ENV = ["SECRET", "REFRESH_SECRET", "MONGO_DB_URL"];

const startServer = async () => {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length) {
    logger.error("Missing required environment variables", { missing });
    process.exit(1);
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