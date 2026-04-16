const PENDING_EMAIL_KEY = "auth_pending_email";
const PENDING_PURPOSE_KEY = "auth_pending_purpose";
const PENDING_ROLE_KEY = "auth_pending_role";
const PENDING_NAME_KEY = "auth_pending_name";

type PendingAuth = {
  email: string;
  purpose: "signup";
  role?: string;
  name?: string;
};

export const setPendingAuth = (pending: PendingAuth) => {
  sessionStorage.setItem(PENDING_EMAIL_KEY, pending.email);
  sessionStorage.setItem(PENDING_PURPOSE_KEY, pending.purpose);
  sessionStorage.setItem(PENDING_ROLE_KEY, pending.role || "");
  sessionStorage.setItem(PENDING_NAME_KEY, pending.name || "");
};

export const getPendingAuth = (): PendingAuth | null => {
  const email = sessionStorage.getItem(PENDING_EMAIL_KEY);
  const purpose = sessionStorage.getItem(PENDING_PURPOSE_KEY) as PendingAuth["purpose"] | null;

  if (!email || !purpose) {
    return null;
  }

  return {
    email,
    purpose,
    role: sessionStorage.getItem(PENDING_ROLE_KEY) || undefined,
    name: sessionStorage.getItem(PENDING_NAME_KEY) || undefined,
  };
};

export const clearPendingAuth = () => {
  sessionStorage.removeItem(PENDING_EMAIL_KEY);
  sessionStorage.removeItem(PENDING_PURPOSE_KEY);
  sessionStorage.removeItem(PENDING_ROLE_KEY);
  sessionStorage.removeItem(PENDING_NAME_KEY);
};
