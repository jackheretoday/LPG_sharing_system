import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/lib/trustAuth";

type AuthenticatedRouteProps = {
  children: React.ReactNode;
};

export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setStatus("unauthorized");
      navigate("/auth/login", { replace: true });
      return;
    }

    setStatus("authorized");
  }, [navigate]);

  if (status === "unauthorized") {
    return null;
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center">
        <p className="text-neutral-400">Verifying access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
