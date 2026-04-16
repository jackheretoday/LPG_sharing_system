import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getStoredUser } from "@/lib/trustAuth";

type RoleProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();

    if (!token || !user) {
      setStatus("unauthorized");
      navigate("/auth/login", { replace: true });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      setStatus("unauthorized");
      // Redirect to their own home if they are in the wrong place
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'provider') navigate('/provider/home', { replace: true });
      else navigate('/consumer/home', { replace: true });
      return;
    }

    setStatus("authorized");
  }, [navigate, allowedRoles]);

  if (status === "unauthorized") {
    return null;
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center">
        <p className="text-neutral-400">Verifying role access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
