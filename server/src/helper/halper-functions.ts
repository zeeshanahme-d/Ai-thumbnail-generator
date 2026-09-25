import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../constants/constants.js";

let dummyHash: Promise<string> | undefined;

async function hashPassword(plainPassword: string) {
  const hashedPassword = await bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS);
  return hashedPassword;
}

async function matchHashedPassword(
  plainPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Runs a compare that always fails, so a missing account takes as long as a wrong password.
async function simulatePasswordCheck(plainPassword: string) {
  dummyHash ??= bcrypt.hash("timing-placeholder", BCRYPT_SALT_ROUNDS);
  await bcrypt.compare(plainPassword, await dummyHash);
}

export { hashPassword, matchHashedPassword, simulatePasswordCheck };
