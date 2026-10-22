import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

let client: Paddle | null = null;

// PADDLE_ENV=production switches to live; anything else stays on the sandbox.
const paddle = () => {
  if (!client) {
    const apiKey = process.env.PADDLE_API_KEY;
    if (!apiKey) throw new Error("PADDLE_API_KEY is missing");
    client = new Paddle(apiKey, {
      environment: process.env.PADDLE_ENV === "production" ? Environment.production : Environment.sandbox,
      logLevel: LogLevel.error,
    });
  }
  return client;
};

export default paddle;
