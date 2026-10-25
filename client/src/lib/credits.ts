import type { IUser } from "../types";

// Mirrors CREDIT_COST.GENERATE_COST in server/src/constants/constants.ts.
export const GENERATION_CREDIT_COST = 5;

// Mirrors CREDIT_COST.SIGNUP_BONUS: the free credits a verified account gets, and gets back every 30 days.
export const FREE_MONTHLY_CREDITS = 10;

type CreditFields = Pick<IUser, "freeCredits" | "usedCredits">;

const atLeastZero = (value: number | null | undefined) => Math.max(0, Number(value) || 0);

// Mirrors getRemainingCredits in server/src/utils/credits.ts, which has the final say.
export function getRemainingCredits(user: CreditFields | null | undefined): number {
    return Math.max(0, atLeastZero(user?.freeCredits) - atLeastZero(user?.usedCredits));
}
