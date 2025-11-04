import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { firebaseService } from "../services/firebaseService";
import { UserRole } from "../types";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await firebaseService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gmc-dark">
                GMC OPD Token
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {user.role === UserRole.Admin && (
                    <Link to="/admin" className="text-gray-600 hover:text-gmc">
                      Admin
                    </Link>
                  )}
                  {user.role === UserRole.Counter && (
                    <Link
                      to="/counter"
                      className="text-gray-600 hover:text-gmc"
                    >
                      Counter
                    </Link>
                  )}
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-gmc text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gmc-dark"
                >
                  Staff Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      <footer className="text-center p-4 text-sm text-gray-500 border-t mt-8">
        Goa Medical College & Hospital &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};
export default Layout;