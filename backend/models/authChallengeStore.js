const crypto = require("crypto");

const challenges = new Map();
const OTP_LENGTH = Number(process.env.EMAIL_OTP_LENGTH || 6);
const OTP_TTL_MINUTES = Number(process.env.EMAIL_OTP_TTL_MINUTES || 10);
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.EMAIL_OTP_RESEND_COOLDOWN_SECONDS || 60);
const OTP_MAX_ATTEMPTS = Number(process.env.EMAIL_OTP_MAX_ATTEMPTS || 5);

const getKey = (email, purpose) => `${String(email).toLowerCase()}:${purpose}`;

const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");

const createOtp = () => {
  const max = 10 ** OTP_LENGTH;
  return String(crypto.randomInt(0, max)).padStart(OTP_LENGTH, "0");
};

const createChallenge = ({ email, purpose, userId, role, meta = {} }) => {
  const key = getKey(email, purpose);
  const now = Date.now();
  const existing = challenges.get(key);

  if (existing && now - existing.createdAt < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
    const retryAfterMs = OTP_RESEND_COOLDOWN_SECONDS * 1000 - (now - existing.createdAt);
    const err = new Error(`Please wait ${Math.ceil(retryAfterMs / 1000)} seconds before requesting a new code`);
    err.statusCode = 429;
    throw err;
  }

  const otp = createOtp();
  const record = {
    email: String(email).toLowerCase(),
    purpose,
    userId: userId || null,
    role: role || null,
    otpHash: hashOtp(otp),
    createdAt: now,
    expiresAt: now + OTP_TTL_MINUTES * 60 * 1000,
    attempts: 0,
    meta,
  };

  challenges.set(key, record);
  return { otp, challenge: record };
};

const getChallenge = (email, purpose) => {
  const challenge = challenges.get(getKey(email, purpose));
  if (!challenge) {
    return null;
  }

  if (Date.now() > challenge.expiresAt) {
    challenges.delete(getKey(email, purpose));
    return null;
  }

  return challenge;
};

const verifyChallenge = ({ email, purpose, otp }) => {
  const key = getKey(email, purpose);
  const challenge = getChallenge(email, purpose);

  if (!challenge) {
    return { ok: false, reason: "OTP expired or not requested" };
  }

  if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
    challenges.delete(key);
    return { ok: false, reason: "Too many invalid attempts. Request a new code." };
  }

  challenge.attempts += 1;

  if (hashOtp(otp) !== challenge.otpHash) {
    return { ok: false, reason: "Invalid OTP" };
  }

  challenges.delete(key);
  return { ok: true, challenge };
};

const clearChallenge = (email, purpose) => {
  challenges.delete(getKey(email, purpose));
};

module.exports = {
  createChallenge,
  getChallenge,
  verifyChallenge,
  clearChallenge,
};
