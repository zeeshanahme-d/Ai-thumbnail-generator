// Self-check for the paid-plan refill dates and the price custom_data parser.
// Run: npx tsx src/utils/billing.check.ts
import assert from "node:assert/strict";
import { addMonths, getAllowanceLeft, getRemainingCredits, nextPaidRefill, splitCharge } from "./credits.js";
import { CREDIT_COST, PAID_CREDITS_SPENDABLE } from "../constants/constants.js";
import { readCreditPack, readPlanGrant } from "./billing.js";
import { creditPackCheckoutSchema } from "../validations/billing.validation.js";
import logger from "./logger.js";

const d = (iso: string) => new Date(iso);

assert.deepEqual(addMonths(d("2026-01-31T10:00:00Z"), 1), d("2026-02-28T10:00:00Z"));
assert.deepEqual(addMonths(d("2028-01-31T10:00:00Z"), 1), d("2028-02-29T10:00:00Z"));
assert.deepEqual(addMonths(d("2026-10-17T10:00:00Z"), 12), d("2027-10-17T10:00:00Z"));

// Monthly plan: the next refill is the next payment, never earlier.
const monthStart = d("2026-10-17T10:00:00Z");
const monthEnd = d("2026-11-17T10:00:00Z");
assert.deepEqual(nextPaidRefill(monthStart, monthEnd, d("2026-10-17T10:01:00Z")), monthEnd);

// Yearly plan: one refill per month of the paid year, the last one capped at the period end.
const yearStart = d("2026-10-17T10:00:00Z");
const yearEnd = d("2027-10-17T10:00:00Z");
assert.deepEqual(nextPaidRefill(yearStart, yearEnd, d("2026-10-17T10:01:00Z")), d("2026-11-17T10:00:00Z"));
assert.deepEqual(nextPaidRefill(yearStart, yearEnd, d("2027-03-20T00:00:00Z")), d("2027-04-17T10:00:00Z"));
assert.deepEqual(nextPaidRefill(yearStart, yearEnd, d("2027-09-30T00:00:00Z")), yearEnd);

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

// A charge spends the expiring allowance first, then pack credits.
const free = CREDIT_COST.SIGNUP_BONUS;
assert.deepEqual(splitCharge({ totalcredits: free, creditsUsed: free - 10, packCredits: 50 }, 5), { fromAllowance: 5, fromPack: 0 });
assert.deepEqual(splitCharge({ totalcredits: free, creditsUsed: free - 2, packCredits: 50 }, 5), { fromAllowance: 2, fromPack: 3 });
assert.deepEqual(splitCharge({ totalcredits: free, creditsUsed: free, packCredits: 50 }, 5), { fromAllowance: 0, fromPack: 5 });
// Usage above the allowance (after a downgrade) never counts as negative allowance.
assert.deepEqual(splitCharge({ totalcredits: 500, creditsUsed: 700, packCredits: 10 }, 5), { fromAllowance: 0, fromPack: 5 });
if (PAID_CREDITS_SPENDABLE) {
  assert.equal(getRemainingCredits({ totalcredits: 20, creditsUsed: 15, packCredits: 305 }), 310);
} else {
  // Test mode: only the free credits spend, even with a paid plan's allowance or pack credits.
  assert.equal(getRemainingCredits({ totalcredits: free, creditsUsed: free - 5, packCredits: 305 }), 5);
  assert.equal(getAllowanceLeft({ totalcredits: 500, creditsUsed: 0, packCredits: 0 }), free);
  assert.equal(getRemainingCredits({ totalcredits: 2500, creditsUsed: free, packCredits: 100 }), 0);
}

// Checkout accepts 25 to 2,500 credits in steps of 5, numbers only.
for (const credits of [25, 305, 2500]) assert.ok(creditPackCheckoutSchema.safeParse({ credits }).success, `${credits}`);
for (const credits of [0, 20, 26, 2505, 302.5, -25, "305", null]) assert.ok(!creditPackCheckoutSchema.safeParse({ credits }).success, `${credits}`);

logger.info("billing checks passed");
