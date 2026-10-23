import type { IUser, PlanId } from "../types";

// Mirrors CREDIT_COST.GENERATE_COST in server/src/constants/constants.ts.
export const GENERATION_CREDIT_COST = 5;

// Mirrors CREDIT_COST.SIGNUP_BONUS: what verified free accounts get, and refill to every 30 days.
export const FREE_MONTHLY_CREDITS = 10;

// Mirrors PAID_CREDITS_SPENDABLE in server/src/constants/constants.ts. Payments run in Paddle test
// mode, so plan and pack credits are shown but only the free monthly credits can be spent.
export const PAID_CREDITS_SPENDABLE = false;

// Mirrors credits_per_month on the Paddle prices.
export const PLAN_MONTHLY_CREDITS: Record<Exclude<PlanId, "free">, number> = { pro: 500, ultra: 2500 };

type CreditFields = Pick<IUser, "totalcredits" | "creditsUsed" | "packCredits">;

// Mirrors getAllowanceLeft / getRemainingCredits in server/src/utils/credits.ts.
/** What is left of the monthly allowance, which refills and doesn't roll over. */
export function getAllowanceLeft(user: CreditFields | null | undefined): number {
    if (!user) return 0;
    const total = user.totalcredits ?? 0;
    const spendable = PAID_CREDITS_SPENDABLE ? total : Math.min(total, FREE_MONTHLY_CREDITS);
    return Math.max(0, spendable - (user.creditsUsed ?? 0));
}

/** Everything the user can spend: the monthly allowance, plus pack credits while those are spendable. */
export function getRemainingCredits(user: CreditFields | null | undefined): number {
    return getAllowanceLeft(user) + (PAID_CREDITS_SPENDABLE ? Math.max(0, user?.packCredits ?? 0) : 0);
}
