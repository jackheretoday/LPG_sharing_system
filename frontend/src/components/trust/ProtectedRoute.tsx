import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, getToken } from "@/lib/trustAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();

    // Check if user is authenticated
    if (!token || !user) {
      setStatus("unauthorized");
      navigate("/auth/login", { replace: true });
      return;
    }

    // Check if user has required role
    if (requiredRole && user.role !== requiredRole) {
      setStatus("unauthorized");
      // Redirect to user's profile page instead of login
      navigate("/trust/me", { replace: true });
      return;
    }

    setStatus("authorized");
  }, [navigate, requiredRole]);

  if (status === "unauthorized") {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-neutral-400 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate("/trust/me")}
            className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-neutral-200 transition"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
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
