import "dotenv/config";
import app from "./src/app.js";
import connectMongoose from "./src/db/connection.js";
import { startScheduledJobs } from "./src/utils/scheduled-jobs.js";
import logger from "./src/utils/logger.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
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