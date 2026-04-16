import type { StoredUser } from "@/lib/trustAuth";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

type AuthPayload = {
  success: boolean;
  message: string;
  user: StoredUser;
  verificationRequired?: boolean;
  nextRoute?: string;
  token?: string;
  note?: string;
  devOtp?: string | null;
  otpDelivery?: {
    sent: boolean;
    skipped: boolean;
    messageId?: string;
    preview?: { to: string; subject: string; text: string };
    expiresInMinutes?: number;
    smtpConfigured?: boolean;
    devOtp?: string | null;
  };
};

type VerifyPayload = {
  email: string;
  otp: string;
  purpose: "signup" | "login";
};

type StartPayload = {
  name?: string;
  email: string;
  password: string;
  role?: string;
};

type RequestOtpPayload = {
  email: string;
  purpose: "signup" | "login";
};

const request = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data as T;
};

export const authApi = {
  signup: (payload: StartPayload) => request<AuthPayload>("/api/auth/signup", payload),
  login: (payload: Omit<StartPayload, "name" | "role">) => request<AuthPayload>("/api/auth/login", payload),
  requestOtp: (payload: RequestOtpPayload) => request<AuthPayload>("/api/auth/request-otp", payload),
  verifyOtp: (payload: VerifyPayload) => request<AuthPayload>("/api/auth/verify-otp", payload),
};
