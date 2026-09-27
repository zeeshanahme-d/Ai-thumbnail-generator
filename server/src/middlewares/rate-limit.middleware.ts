import rateLimit, { ipKeyGenerator, type AugmentedRequest } from "express-rate-limit";
import type { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { RequestErrorCode } from "../constants/enums.js";

// Counters live in memory, so they reset on restart and are per process.
// Running several server instances needs a shared store such as rate-limit-redis.

type LimitKey = "ip" | "email" | "user";

interface LimiterOptions {
  windowMinutes: number;
  limit: number;
  by: LimitKey;
  skipSuccessfulRequests?: boolean;
}

const keyFor = (by: LimitKey) => (req: Request): string => {
  if (by === "email") {
    const email = req.body?.email;
    if (typeof email === "string" && email.trim()) return `email:${email.trim().toLowerCase()}`;
  }
  if (by === "user" && req.user?.userId) return `user:${req.user.userId}`;
  // ipKeyGenerator groups IPv6 addresses by subnet so one client cannot rotate through them.
  return `ip:${ipKeyGenerator(req.ip ?? "")}`;
};

function createLimiter({ windowMinutes, limit, by, skipSuccessfulRequests = false }: LimiterOptions) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests,
    keyGenerator: keyFor(by),
    handler: (req: Request, res: Response) => {
      const resetTime = (req as AugmentedRequest).rateLimit?.resetTime;
      const minutes = resetTime
        ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 60000))
        : windowMinutes;
      return ApiResponse.error(
        res,
        429,
        `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        RequestErrorCode.RateLimited,
      );
    },
  });
}

/** Every sensitive /auth request from one IP: sign-in, sign-up, codes and resets. */
export const authIpLimiter = createLimiter({ windowMinutes: 15, limit: 50, by: "ip" });

/** Failed sign-ins per email, so one account cannot be guessed at from many IPs. */
export const loginEmailLimiter = createLimiter({ windowMinutes: 15, limit: 10, by: "email", skipSuccessfulRequests: true });

/** New accounts per IP, which also slows free-credit farming. */
export const signupIpLimiter = createLimiter({ windowMinutes: 60, limit: 5, by: "ip" });

/** Codes emailed to one address, shared by reset and verification, so no inbox can be flooded. */
export const emailSendLimiter = createLimiter({ windowMinutes: 15, limit: 3, by: "email" });

/** Password confirmations per signed-in user: changing the password and deleting the account. */
export const passwordCheckLimiter = createLimiter({ windowMinutes: 15, limit: 5, by: "user" });

/** Generations per signed-in user. Mounted before multer so rejected requests never write a file. */
export const generateLimiter = createLimiter({ windowMinutes: 1, limit: 5, by: "user" });

/** Thumbnail views per IP, so one client cannot push a thumbnail up the trending sort. */
export const viewLimiter = createLimiter({ windowMinutes: 1, limit: 30, by: "ip" });

/** Free prompt improvements per signed-in user, since they cost no credits. */
export const improvePromptLimiter = createLimiter({ windowMinutes: 10, limit: 10, by: "user" });
