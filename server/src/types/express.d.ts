import type { JwtPayload } from "jsonwebtoken";

interface ValidatedRequest {
  body?: any;
  query?: any;
  params?: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        userId?: string;
        email?: string;
      };

      validated?: ValidatedRequest;
    }
  }
}

export { };