import mongoose from "mongoose";

function connectMongoose() {
  return mongoose.connect("mongodb://127.0.0.1:27017/ai_thumbnail_generator");
}

export default connectMongoose;
