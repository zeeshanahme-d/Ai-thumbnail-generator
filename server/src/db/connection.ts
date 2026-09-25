import mongoose from "mongoose";

export default function connectMongoose() {
  return mongoose.connect(process.env.MONGO_DB_URL as string);
}
