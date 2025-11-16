import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../redux/features/auth/auth.api";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

export const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // If user is already logged in, redirect to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // If user is authenticated, don't render the children (login/register forms)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, render the children (login/register forms)
  return <>{children}</>;
};

