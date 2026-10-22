import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { VISITOR_COOKIE_MAX_AGE_MS } from "../constants/constants.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const userViewerKey = (userId: string) => `user:${userId}`;

// Who is viewing: the signed-in user, or a guest known by a random visitor cookie set on first view.
export function getViewerKey(req: Request, res: Response): string {
  if (req.user?.userId) return userViewerKey(req.user.userId);

  let visitorId = req.cookies?.visitorId;
  // Only an id we issued is trusted; cookie-parser turns "j:{...}" cookies into objects.
  if (typeof visitorId !== "string" || !UUID_PATTERN.test(visitorId)) {
    visitorId = randomUUID();
    res.cookie("visitorId", visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: VISITOR_COOKIE_MAX_AGE_MS,
    });
  }

  return `guest:${visitorId}`;
}
