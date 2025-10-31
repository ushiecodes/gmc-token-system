import React from "react";
import { Link } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
              {/* Auth buttons will go here */}
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 border-t mt-8">
        Goa Medical College & Hospital &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
    };

export default Layout;