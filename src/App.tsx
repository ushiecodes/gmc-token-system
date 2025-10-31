import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import { UserRole } from "./types";

// Create placeholder pages for now
const Login: React.FC = () => <div>Login Page</div>; // Will be replaced
const CounterConsole: React.FC = () => <div>Counter Console</div>;
const AdminDashboard: React.FC = () => <div>Admin Dashboard</div>;

// Import the real pages
import LoginPage from "./pages/Login";
import PatientPortalPage from "./pages/PatientPortal";

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<PatientPortalPage />} />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={user.role === UserRole.Admin ? "/admin" : "/counter"}
            />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/counter"
        element={
          <AuthGuard roles={[UserRole.Counter]}>
            <CounterConsole />
          </AuthGuard>
        }
      />

      <Route
        path="/admin"
        element={
          <AuthGuard roles={[UserRole.Admin]}>
            <AdminDashboard />
          </AuthGuard>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
