import crypto from "crypto";

export const AUTHORIZED_EXAMINER_EMAIL = "io@maziz.me";

// Fallback secret for token signing
const AUTH_SECRET = process.env.EXAMINER_AUTH_SECRET || "bano-qabil-maziz-secret-key-2026";
export const EXAMINER_DEFAULT_PIN = process.env.EXAMINER_PASSCODE || "maziz2026";

interface ExaminerTokenPayload {
  email: string;
  iat: number;
  exp: number;
}

export function verifyExaminerCredentials(email: string, passcode: string): boolean {
  if (!email || !passcode) return false;
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPasscode = passcode.trim();

  const isEmailMatch = normalizedEmail === AUTHORIZED_EXAMINER_EMAIL.toLowerCase();
  const isPasscodeMatch = normalizedPasscode === EXAMINER_DEFAULT_PIN.trim();

  return isEmailMatch && isPasscodeMatch;
}

export function generateExaminerToken(email: string): string {
  const payload: ExaminerTokenPayload = {
    email: email.trim().toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadString)
    .digest("base64url");

  return `${payloadString}.${signature}`;
}

export function verifyExaminerToken(token: string | null | undefined): boolean {
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [payloadString, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(payloadString)
      .digest("base64url");

    if (signature !== expectedSig) {
      return false;
    }

    const json = Buffer.from(payloadString, "base64url").toString("utf-8");
    const payload: ExaminerTokenPayload = JSON.parse(json);

    if (payload.email !== AUTHORIZED_EXAMINER_EMAIL.toLowerCase()) {
      return false;
    }

    if (Date.now() > payload.exp) {
      return false; // Expired
    }

    return true;
  } catch {
    return false;
  }
}
