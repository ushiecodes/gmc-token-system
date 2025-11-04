import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";

interface AuthGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null; // Or a loading spinner
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!roles.includes(user.role)) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthGuard;
