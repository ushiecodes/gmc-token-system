import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseService } from "../services/firebaseService";
import { UserRole } from "../types";
import Spinner from "../components/Spinner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await firebaseService.login(email, password);
      if (user.role === UserRole.Admin) navigate("/admin");
      else navigate("/counter");
    } catch (err: any) {
      setError(
        `Login failed. Please check your email and password. (Hint: Use "counter@gmc.com" or "admin@gmc.com" with password "password123")`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full p-8 space-y-8 bg-white shadow-xl rounded-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Staff & Admin Login
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gmc focus:border-gmc sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password-sr"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gmc focus:border-gmc sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gmc hover:bg-gmc-dark disabled:bg-gray-400"
            >
              {isLoading ? <Spinner size="sm" /> : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;