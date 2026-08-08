import crypto from "crypto";
import type { Model } from "mongoose";

export function generateOtp(length: number = 6): string {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return crypto.randomInt(min, max + 1).toString();
}

export async function generateUniqueUsername(fullName: string, userModel: Model<any>): Promise<string> {
    const base = fullName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    const slug = base.length >= 3 ? base : `user_${base || crypto.randomInt(100, 999)}`;

    const taken = await userModel.exists({ username: slug });
    if (!taken) return slug;

    // Collision loop — append random 2-4 digit suffix.
    for (let attempt = 0; attempt < 10; attempt++) {
        const suffix = crypto.randomInt(10, 9999);
        const candidate = `${slug}_${suffix}`;
        const exists = await userModel.exists({ username: candidate });
        if (!exists) return candidate;
    }

    // Extremely unlikely fallback — fully random.
    return `user_${crypto.randomUUID().slice(0, 8)}`;
}