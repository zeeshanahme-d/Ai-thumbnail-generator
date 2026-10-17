// Self-check for the paid-plan refill dates and the price custom_data parser.
// Run: npx tsx src/utils/billing.check.ts
import assert from "node:assert/strict";
import { addMonths, nextPaidRefill } from "./credits.js";
import { readPlanGrant } from "./billing.js";

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

console.log("billing checks passed");
