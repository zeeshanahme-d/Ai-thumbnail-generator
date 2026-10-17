import { z } from "zod";
import { BillingPeriod, UserPlan } from "../constants/enums.js";

export const checkoutSchema = z.object({
  plan: z.enum([UserPlan.Pro, UserPlan.Ultra]),
  billing: z.enum(BillingPeriod),
});
