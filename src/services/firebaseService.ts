import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

import {
  User,
  UserRole,
  Token,
  TokenCategory,
  TokenStatus,
  TokenType,
} from "../types";

// ✅ Firebase config should be defined before initFirebase()
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Safe Firebase initialization
function initFirebase() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      "⚠️ Firebase config missing. Ensure .env has VITE_FIREBASE_* keys and you've restarted the dev server."
    );
  }

  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    let analytics: ReturnType<typeof getAnalytics> | undefined;
    if (typeof window !== "undefined") {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.warn("Firebase analytics not initialized:", err);
      }
    }

    return { app, auth, db, analytics };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

// ✅ Initialize after definition
const { app, auth, db, analytics } = initFirebase();

// ---------- Utility functions ----------

async function mapFirebaseUser(firebaseUser: FirebaseUser): Promise<User> {
  try {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    if (!userDoc.exists()) throw new Error("User not found in database");
    const userData = userDoc.data();
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      role: userData.role as UserRole,
    };
  } catch (error) {
    console.error("Error mapping user:", error);
    throw new Error("Failed to load user data");
  }
}

// ---------- Main firebaseService API ----------

export const firebaseService = {
  // Authentication
  async login(email: string, pass: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return await mapFirebaseUser(result.user);
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) return callback(null);
      try {
        const mappedUser = await mapFirebaseUser(user);
        callback(mappedUser);
      } catch (error) {
        console.error("Auth state change error:", error);
        callback(null);
      }
    });
  },

  // Token Management
  async generateToken(
    casePaperId: string,
    department: string,
    category: TokenCategory
  ): Promise<Token> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString().slice(0, 10);

    // Prevent duplicate tokens
    const existingQuery = query(
      collection(db, "tokens"),
      where("casePaperId", "==", casePaperId),
      where("department", "==", department),
      where("dateStr", "==", dateStr)
    );
    const existingDocs = await getDocs(existingQuery);
    if (!existingDocs.empty)
      throw new Error("Token already exists for this case paper today");

    // Compute next token number
    const tokensQuery = query(
      collection(db, "tokens"),
      where("tokenPrefix", "==", "G"),
      where("dateStr", "==", dateStr)
    );
    const snapshot = await getDocs(tokensQuery);
    const nextNum = snapshot.size + 1;

    const token: Omit<Token, "id"> = {
      tokenNumber: `G${nextNum}`,
      tokenPrefix: "G",
      numericPart: nextNum,
      casePaperId,
      department,
      generatedAt: Date.now(),
      category,
      status: TokenStatus.Waiting,
      type: TokenType.Digital,
    };

    const docRef = await addDoc(collection(db, "tokens"), { ...token, dateStr });
    return { ...token, id: docRef.id };
  },

  async getTokens(): Promise<Token[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(
      collection(db, "tokens"),
      where("dateStr", "==", today.toISOString().slice(0, 10))
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Token[];
  },

  onTokensChanged(callback: (tokens: Token[]) => void) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(
      collection(db, "tokens"),
      where("dateStr", "==", today.toISOString().slice(0, 10))
    );
    return onSnapshot(q, (snapshot) => {
      const tokens = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Token[];
      callback(tokens);
    });
  },

  async updateTokenStatus(tokenId: string, status: TokenStatus): Promise<void> {
    const tokenDoc = doc(db, "tokens", tokenId);
    await updateDoc(tokenDoc, { status });
  },

  async addWalkInToken(
    casePaperId: string,
    department: string,
    category: TokenCategory = TokenCategory.General
  ): Promise<Token> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(
      collection(db, "tokens"),
      where("tokenPrefix", "==", "W"),
      where("dateStr", "==", today.toISOString().slice(0, 10))
    );
    const snapshot = await getDocs(q);
    const walkInTokens = snapshot.docs.map((doc) => doc.data());
    const nextNum =
      walkInTokens.length > 0
        ? Math.max(...walkInTokens.map((t: any) => t.numericPart)) + 1
        : 1;

    const token: Token = {
      id: "",
      tokenNumber: `W${nextNum}`,
      tokenPrefix: "W",
      numericPart: nextNum,
      casePaperId,
      department,
      generatedAt: Date.now(),
      category,
      status: TokenStatus.Waiting,
      type: TokenType.WalkIn,
    };

    const docRef = await addDoc(collection(db, "tokens"), {
      ...token,
      dateStr: today.toISOString().slice(0, 10),
    });

    token.id = docRef.id;
    return token;
  },

  async testFirebaseConnection() {
    try {
      await getDocs(collection(db, "tokens"));
      console.log("✅ Firebase connection test successful");
      return true;
    } catch (error) {
      console.error("Firebase connection test failed:", error);
      return false;
    }
  },
};
