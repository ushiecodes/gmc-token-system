import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import { UserRole } from "./types";
import { Suspense } from "react";
import Spinner from "./components/Spinner";

// Page imports
import PatientPortal from "./pages/PatientPortal";
import Login from "./pages/Login";
import CounterConsole from "./pages/CounterConsole";
import AdminDashboard from "./pages/AdminDashboard";

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<PatientPortal />} />
        <Route path="/login" element={<Login />} />
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
    </Suspense>
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
