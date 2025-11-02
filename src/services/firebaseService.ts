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

// Use environment variables for config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app, auth, db, analytics;

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const analytics = getAnalytics(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

async function mapFirebaseUser(firebaseUser: FirebaseUser): Promise<User> {
  try {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    if (!userDoc.exists()) {
      throw new Error("User not found in database");
    }
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

export const firebaseService = {
  // Authentication methods
  login: async (email: string, pass: string): Promise<User> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return await mapFirebaseUser(result.user);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }
  },

  // Real-time auth state
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const mappedUser = await mapFirebaseUser(user);
          callback(mappedUser);
        } else {
          callback(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        callback(null);
      }
    });
  },

  // Token management methods
  generateToken: async (
    casePaperId: string,
    department: string,
    category: TokenCategory
  ): Promise<Token> => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateStr = today.toISOString().slice(0, 10);

      // Check for existing token
      const existingQuery = query(
        collection(db, "tokens"),
        where("casePaperId", "==", casePaperId),
        where("department", "==", department),
        where("dateStr", "==", dateStr)
      );
      const existingDocs = await getDocs(existingQuery);
      if (!existingDocs.empty) {
        throw new Error("Token already exists for this case paper today");
      }

      // Get next token number
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

      const docRef = await addDoc(collection(db, "tokens"), {
        ...token,
        dateStr,
      });

      return { ...token, id: docRef.id };
    } catch (error: any) {
      console.error("Token generation error:", error);
      throw new Error(error.message || "Failed to generate token");
    }
  },

  getTokens: async (): Promise<Token[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tokensRef = collection(db, "tokens");
    const q = query(
      tokensRef,
      where("dateStr", "==", today.toISOString().slice(0, 10))
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Token[];
  },

  onTokensChanged: (callback: (tokens: Token[]) => void) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tokensRef = collection(db, "tokens");
    const q = query(
      tokensRef,
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

  updateTokenStatus: async (
    tokenId: string,
    status: TokenStatus
  ): Promise<void> => {
    const tokenDoc = doc(db, "tokens", tokenId);
    await updateDoc(tokenDoc, { status });
  },

  addWalkInToken: async (
    casePaperId: string,
    department: string,
    category: TokenCategory = TokenCategory.General
  ): Promise<Token> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tokensRef = collection(db, "tokens");
    const q = query(
      tokensRef,
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
    const docRef = await addDoc(tokensRef, {
      ...token,
      dateStr: today.toISOString().slice(0, 10),
    });
    token.id = docRef.id;
    return token;
  },

  testFirebaseConnection: async () => {
    try {
      // Test Firestore
      await getDocs(collection(db, "tokens"));

      // Test Auth
      const currentUser = auth.currentUser;
      console.log("Firebase connection test successful");
      return true;
    } catch (error) {
      console.error("Firebase connection test failed:", error);
      return false;
    }
  },
};
