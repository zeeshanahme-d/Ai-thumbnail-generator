import { z } from "zod";
import { BillingPeriod, UserPlan } from "../constants/enums.js";
import { CREDIT_PACK } from "../constants/constants.js";

export const checkoutSchema = z.object({
  plan: z.enum([UserPlan.Pro, UserPlan.Ultra]),
  billing: z.enum(BillingPeriod),
});

const creditsMessage = `Choose between ${CREDIT_PACK.MIN_CREDITS} and ${CREDIT_PACK.MAX_CREDITS} credits, in steps of ${CREDIT_PACK.CREDITS_PER_UNIT}.`;

export const creditPackCheckoutSchema = z.object({
  credits: z
    .number({ error: creditsMessage })
    .int(creditsMessage)
    .min(CREDIT_PACK.MIN_CREDITS, creditsMessage)
    .max(CREDIT_PACK.MAX_CREDITS, creditsMessage)
    .multipleOf(CREDIT_PACK.CREDITS_PER_UNIT, creditsMessage),
});
