import { createHash, randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";

// Access token lives 15 minutes, refresh token 30 days.
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
export const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes in ms

/** `tv` is the user's tokenVersion when the token was issued; a mismatch means it was revoked. */
export interface AccessTokenPayload extends jwt.JwtPayload {
  userId: string;
  email: string;
  tv?: number;
}

export interface RefreshTokenPayload extends jwt.JwtPayload {
  userId: string;
  tv?: number;
}

// Read secrets lazily: dotenv.config() runs after the module graph is imported.
// server.ts refuses to start unless both are set and differ.
const getAccessSecret = (): string => process.env.SECRET as string;
const getRefreshSecret = (): string => process.env.REFRESH_SECRET as string;

type TokenType = "access" | "refresh";

function generateAccessToken(payload: object) {
  return jwt.sign({ ...payload, typ: "access" }, getAccessSecret(), { algorithm: "HS256", expiresIn: "15m" });
}

// The random jwtid keeps two tokens issued in the same second from being identical.
function generateRefreshToken(payload: object) {
  return jwt.sign({ ...payload, typ: "refresh" }, getRefreshSecret(), { algorithm: "HS256", expiresIn: "30d", jwtid: randomUUID() });
}

// Each token names its type, so a refresh token can never pass as an access token or the reverse.
function verifyToken<T>(token: string, secret: string, type: TokenType) {
  const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
  if (typeof payload === "string" || payload.typ !== type) {
    throw new jwt.JsonWebTokenError(`Wrong token type, expected ${type}`);
  }
  return payload as T;
}

// Refresh tokens are stored hashed, so a database leak does not expose usable tokens.
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function verifyAccessToken(token: string) {
  return verifyToken<AccessTokenPayload>(token, getAccessSecret(), "access");
}

function verifyRefreshToken(token: string) {
  return verifyToken<RefreshTokenPayload>(token, getRefreshSecret(), "refresh");
}

export {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyAccessToken,
  verifyRefreshToken,
};
