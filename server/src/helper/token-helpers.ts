import jwt from "jsonwebtoken";

// Access token lives 15 minutes, refresh token 30 days.
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
export const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes in ms

// Read secrets lazily: dotenv.config() runs after the module graph is imported.
const getAccessSecret = (): string => process.env.SECRET as string;
const getRefreshSecret = (): string => process.env.REFRESH_SECRET as string || process.env.SECRET as string;

function generateAccessToken(payload: object) {
  return jwt.sign(payload, getAccessSecret(), { expiresIn: "15m" });
}

function generateRefreshToken(payload: object) {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: "30d" });
}

function verifyAccessToken(token: string) {
  return jwt.verify(token, getAccessSecret());
}

function verifyRefreshToken(token: string) {
  return jwt.verify(token, getRefreshSecret());
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
