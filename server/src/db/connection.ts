import mongoose from "mongoose";

// Wraps any operator object in a query filter ({ $ne: ... }, { $gt: ... }) in $eq, so values
// taken from requests or cookies can never act as operators. Operators the code writes on
// purpose are wrapped in mongoose.trusted() to pass through.
mongoose.set("sanitizeFilter", true);

export default function connectMongoose() {
  return mongoose.connect(process.env.MONGO_DB_URL as string);
}
