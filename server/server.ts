import "dotenv/config";
import app from "./src/app.js";
import connectMongoose from "./src/db/connection.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectMongoose();

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();