// Self-check for the credit balance and the price custom_data parser.
// Run: npx tsx src/utils/billing.check.ts
import assert from "node:assert/strict";
import { getRemainingCredits } from "./credits.js";
import { CREDIT_COST } from "../constants/constants.js";
import { readCreditPack, readPlanGrant } from "./billing.js";
import { creditPackCheckoutSchema } from "../validations/billing.validation.js";
import logger from "./logger.js";

assert.deepEqual(readPlanGrant({ plan: "pro", billing: "yearly", credits_per_month: 500 }), { plan: "pro", credits: 500 });
assert.deepEqual(readPlanGrant({ plan: "ultra", credits_per_month: 2500 }), { plan: "ultra", credits: 2500 });
assert.equal(readPlanGrant({ plan: "free", credits_per_month: 20 }), null);
assert.equal(readPlanGrant({ plan: "pro", credits_per_month: "500" }), null);
assert.equal(readPlanGrant(null), null);

// Credit packs: the price's custom_data decides what one unit grants.
assert.equal(readCreditPack({ type: "credit_pack", credits_per_unit: 5 }), 5);
assert.equal(readCreditPack({ type: "credit_pack", credits_per_unit: 0 }), null);
assert.equal(readCreditPack({ type: "credit_pack", credits_per_unit: "5" }), null);
assert.equal(readCreditPack({ plan: "pro", credits_per_month: 500 }), null);

// Only free credits spend: subscription and pack credits are never part of the balance.
const free = CREDIT_COST.SIGNUP_BONUS;
assert.equal(getRemainingCredits({ freeCredits: free, usedCredits: 0 }), free);
assert.equal(getRemainingCredits({ freeCredits: free, usedCredits: free - 5 }), 5);
const subscriber = { freeCredits: 50, usedCredits: 0, subscriptionCredits: 500, packCredits: 100 };
assert.equal(getRemainingCredits(subscriber), 50);
assert.equal(getRemainingCredits({ freeCredits: 5, usedCredits: 20 }), 0);
assert.equal(getRemainingCredits({ freeCredits: -10, usedCredits: 0 }), 0);
assert.equal(getRemainingCredits({ freeCredits: free, usedCredits: -5 }), free);
assert.equal(getRemainingCredits({}), 0);
assert.equal(getRemainingCredits(null), 0);

// Checkout accepts 25 to 2,500 credits in steps of 5, numbers only.
for (const credits of [25, 305, 2500]) assert.ok(creditPackCheckoutSchema.safeParse({ credits }).success, `${credits}`);
for (const credits of [0, 20, 26, 2505, 302.5, -25, "305", null]) assert.ok(!creditPackCheckoutSchema.safeParse({ credits }).success, `${credits}`);

logger.info("billing checks passed");
