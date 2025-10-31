import { User, UserRole } from "../types";

const MOCK_USERS: Omit<User, "uid">[] = [
  { email: "counter@gmc.com", role: UserRole.Counter },
  { email: "admin@gmc.com", role: UserRole.Admin },
];
const MOCK_PASSWORD = "password123";
const AUTH_KEY = "gmc_auth_user";
const STORAGE_EVENT = "onStorageChange"; // Custom event for real-time updates

export const firebaseService = {
  login: (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userFound = MOCK_USERS.find((u) => u.email === email);
        if (userFound && pass === MOCK_PASSWORD) {
          const user: User = { ...userFound, uid: `mock-${email}` };
          localStorage.setItem(AUTH_KEY, JSON.stringify(user));
          window.dispatchEvent(new Event(STORAGE_EVENT));
          resolve(user);
        } else {
          reject(new Error("Invalid email or password."));
        }
      }, 500);
    });
  },

  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem(AUTH_KEY);
      window.dispatchEvent(new Event(STORAGE_EVENT));
      resolve();
    });
  },

  onAuthStateChanged: (callback: (user: User | null) => void) => {
    const updateUser = () => {
      const user = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      callback(user);
    };
    updateUser();
    window.addEventListener(STORAGE_EVENT, updateUser);
    return () => window.removeEventListener(STORAGE_EVENT, updateUser);
  },
};
