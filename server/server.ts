import dotenv from "dotenv";
import app from "./src/app.js";
import connectMongoose from "./src/db/connection.js";

dotenv.config();

const PORT = process.env.PORT;

connectMongoose()
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log("mongoose Err:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
