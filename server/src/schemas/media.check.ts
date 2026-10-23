// Self-check: only `url` of an avatar or thumbnail image reaches the client.
// Run: npx tsx src/schemas/media.check.ts (no database needed)
import assert from "node:assert/strict";
import type { Query } from "mongoose";
import userModel from "../models/user.model.js";
import thumbnailModel from "../models/thumbnail.model.js";
import logger from "../utils/logger.js";

// The projection Mongoose will send for a query (select: false paths included).
const projection = (query: Query<unknown, unknown>) => {
  (query as unknown as { _applyPaths(): void })._applyPaths();
  return (query as unknown as { _fields: Record<string, number> })._fields;
};
const PRIVATE = ["publicId", "originalName", "directory", "format", "bytes"];

for (const [field, query] of [
  ["avatar", userModel.find()],
  ["avatar", userModel.find().select("-password")],
  ["thumbnail", thumbnailModel.find().select("-packCreditsUsed -model")],
] as const) {
  const fields = projection(query);
  for (const key of PRIVATE) assert.equal(fields[`${field}.${key}`], 0, `${field}.${key} hidden`);
}

// Internal reads that ask for publicId still get it.
assert.notEqual(projection(userModel.find().select("+password +avatar.publicId"))["avatar.publicId"], 0);
assert.equal(projection(thumbnailModel.find().select("_id thumbnail.publicId"))["thumbnail.publicId"], 1);

// A document sent straight from memory (the generate response) shows the url only.
const doc = new thumbnailModel({ thumbnail: { url: "https://img", publicId: "p", bytes: 9 } });
assert.deepEqual(JSON.parse(JSON.stringify(doc)).thumbnail, { url: "https://img" });
assert.equal(doc.thumbnail?.publicId, "p", "server code can still read it");

logger.info("media checks passed");
