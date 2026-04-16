const TOKEN_KEY = "trust_token";
const USER_KEY = "trust_user";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified?: boolean;
  emailVerificationStatus?: string;
  emailVerifiedAt?: string | null;
  isSuspended?: boolean;
  suspendedReason?: string;
  suspendedAt?: string | null;
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: StoredUser) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearSession = () => {
  clearToken();
  clearStoredUser();
};
