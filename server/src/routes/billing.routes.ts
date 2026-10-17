import express from "express";
import validate from "../middlewares/validate.js";
import { billingLimiter } from "../middlewares/rate-limit.middleware.js";
import { checkoutSchema, creditPackCheckoutSchema } from "../validations/billing.validation.js";
import {
  handleCreateCheckout,
  handleCreateCreditPackCheckout,
  handleCreatePortalSession,
} from "../controllers/billing.controller.js";

// Behind authenticationToken. The webhook is mounted separately in app.ts, before express.json.
const router = express.Router();

router.post("/checkout", billingLimiter, validate(checkoutSchema), handleCreateCheckout);
router.post("/credits", billingLimiter, validate(creditPackCheckoutSchema), handleCreateCreditPackCheckout);
router.post("/portal", billingLimiter, handleCreatePortalSession);

export default router;
