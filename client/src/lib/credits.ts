import type { IUser } from "../types";

// Mirrors CREDIT_COST.GENERATE_COST in server/src/constants/constants.ts.
export const GENERATION_CREDIT_COST = 5;

export function getRemainingCredits(user: IUser | null | undefined): number {
    if (!user) return 0;
    return Math.max(0, (user.totalcredits ?? 0) - (user.creditsUsed ?? 0));
}
