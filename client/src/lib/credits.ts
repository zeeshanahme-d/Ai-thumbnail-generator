import type { IUser } from "../types";

// Mirrors CREDIT_COST.GENERATE_COST in server/src/constants/constants.ts.
export const GENERATION_CREDIT_COST = 5;

// Mirrors CREDIT_COST.SIGNUP_BONUS: what verified free accounts get, and refill to every 30 days.
export const FREE_MONTHLY_CREDITS = 20;

type CreditFields = Pick<IUser, "totalcredits" | "creditsUsed" | "packCredits">;

// Mirrors getAllowanceLeft / getRemainingCredits in server/src/utils/credits.ts.
/** What is left of the monthly allowance, which refills and doesn't roll over. */
export function getAllowanceLeft(user: CreditFields | null | undefined): number {
    if (!user) return 0;
    return Math.max(0, (user.totalcredits ?? 0) - (user.creditsUsed ?? 0));
}

/** Everything the user can spend: the monthly allowance plus bought pack credits. */
export function getRemainingCredits(user: CreditFields | null | undefined): number {
    return getAllowanceLeft(user) + Math.max(0, user?.packCredits ?? 0);
}
