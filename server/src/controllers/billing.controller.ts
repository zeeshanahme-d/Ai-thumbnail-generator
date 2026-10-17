import { Request, Response } from "express";
import { EventName } from "@paddle/paddle-node-sdk";
import paddle from "../config/paddle.js";
import userModel from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import logger from "../utils/logger.js";
import { grantPaidPeriod, isLiveSubscription, syncSubscription } from "../utils/billing.js";
import { AuthErrorCode, BillingErrorCode } from "../constants/enums.js";

// PADDLE_PRICE_PRO_MONTHLY, PADDLE_PRICE_ULTRA_YEARLY, ...
const priceIdFor = (plan: string, billing: string) => process.env[`PADDLE_PRICE_${plan.toUpperCase()}_${billing.toUpperCase()}`];

/**
 * POST /billing/checkout
 * Creates the Paddle transaction the client opens Paddle Checkout with. The userId goes into
 * its custom_data here on the server, and Paddle copies it to the subscription and every renewal.
 */
async function handleCreateCheckout(req: Request, res: Response) {
  const { plan, billing } = req.validated!.body;

  const priceId = priceIdFor(plan, billing);
  if (!priceId) {
    logger.error("Paddle price is not configured", { env: `PADDLE_PRICE_${plan.toUpperCase()}_${billing.toUpperCase()}` });
    return ApiResponse.error(res, 503, "Payments are not available right now. Please try again later.");
  }

  const user = await userModel.findById(req.user!.userId);
  if (!user) {
    return ApiResponse.error(res, 404, "User account not found.");
  }

  // Credits only work on verified accounts, so nobody pays for a plan they cannot use yet.
  if (!user.isVerified) {
    return ApiResponse.error(res, 403, "Verify your email before choosing a plan.", AuthErrorCode.EmailNotVerified);
  }

  if (isLiveSubscription(user.subscriptionStatus)) {
    return ApiResponse.error(res, 409, "You already have a plan. Manage it from Settings.", BillingErrorCode.AlreadySubscribed);
  }

  // One Paddle customer per account, matched by email, so checkout opens with the email filled in.
  let customerId = user.paddleCustomerId;
  if (!customerId) {
    const [existing] = await paddle().customers.list({ email: [user.email] }).next();
    customerId = existing?.id ?? (await paddle().customers.create({ email: user.email, name: user.fullName })).id;
    await userModel.updateOne({ _id: user._id }, { $set: { paddleCustomerId: customerId } });
  }

  const transaction = await paddle().transactions.create({
    items: [{ priceId, quantity: 1 }],
    customerId,
    customData: { userId: String(user._id) },
  });

  logger.info("Checkout created", { userId: String(user._id), plan, billing, transactionId: transaction.id });
  return ApiResponse.success(res, 201, "Checkout ready.", { transactionId: transaction.id });
}

/**
 * POST /billing/portal
 * A short-lived link to Paddle's customer portal: cancel, payment method and invoices.
 */
async function handleCreatePortalSession(req: Request, res: Response) {
  const user = await userModel.findById(req.user!.userId).select("paddleCustomerId subscriptionId").lean();
  if (!user?.paddleCustomerId) {
    return ApiResponse.error(res, 404, "You don't have a billing account yet. Choose a plan first.");
  }

  const session = await paddle().customerPortalSessions.create(
    user.paddleCustomerId,
    user.subscriptionId ? [user.subscriptionId] : [],
  );

  return ApiResponse.success(res, 200, "Billing portal ready.", { url: session.urls.general.overview });
}

/**
 * POST /billing/webhook
 * Paddle's signed events. Mounted with a raw text body because the signature covers the exact bytes.
 */
async function handlePaddleWebhook(req: Request, res: Response) {
  const signature = req.get("paddle-signature");
  const rawBody = typeof req.body === "string" ? req.body : "";
  if (!signature || !rawBody) {
    return ApiResponse.error(res, 400, "Missing signature or body.");
  }

  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? "";
  // The destination's ID (ntfset_...) is easy to paste by mistake; every signature then fails.
  if (!secret.startsWith("pdl_ntfset_")) {
    logger.error("PADDLE_WEBHOOK_SECRET must be the destination's secret key (pdl_ntfset_...), not its ID");
  }

  try {
    const event = await paddle().webhooks.unmarshal(rawBody, secret, signature);
    logger.info("Paddle webhook received", { eventType: event.eventType, eventId: event.eventId });

    switch (event.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionCanceled:
      case EventName.SubscriptionPastDue:
      case EventName.SubscriptionPaused:
      case EventName.SubscriptionResumed:
      case EventName.SubscriptionTrialing:
        await syncSubscription(event.data);
        break;
      case EventName.TransactionCompleted:
        await grantPaidPeriod(event.data);
        break;
    }

    return ApiResponse.success(res, 200, "Received.");
  } catch (error) {
    // Any non-2xx makes Paddle retry, which also recovers from a rotated secret once it is deployed.
    logger.error("Paddle webhook failed", { requestId: req.get("x-vercel-id"), error });
    return ApiResponse.error(res, 500, "Webhook processing failed.");
  }
}

export { handleCreateCheckout, handleCreatePortalSession, handlePaddleWebhook };
