"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AdminUser } from "@/types/admin";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Check if user is an admin via API (server-side check)
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch("/api/auth/check-admin", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.isAdmin && data.adminUser) {
              setAdminUser(data.adminUser);
            } else {
              setAdminUser(null);
            }
          } else {
            setAdminUser(null);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Check if user is an admin via API
      const token = await userCredential.user.getIdToken();
      const response = await fetch("/api/auth/check-admin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.isAdmin || !data.adminUser) {
        await signOut(auth);
        throw new Error("You don't have admin access");
      }

      // Update last login (via API)
      try {
        await fetch(`/api/admin/users/${data.adminUser.id}/last-login`, {
          method: "POST",
        });
      } catch (error) {
        console.warn("Could not update last login:", error);
      }

      router.push("/admin");
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAdminUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        loading,
        login,
        logout,
        isAdmin: !!adminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
