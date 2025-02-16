
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !session)) {
      navigate("/login");
    }
  }, [user, session, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && session ? <>{children}</> : null;
};
