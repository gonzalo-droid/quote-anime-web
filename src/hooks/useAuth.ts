"use client";

import { useEffect, useState, useCallback } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/services/firebase/config";

const ALLOWED_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export type AuthStatus = "loading" | "signed-out" | "authorized";

interface UseAuthReturn {
  status: AuthStatus;
  user: User | null;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setStatus("signed-out");
        return;
      }

      const email = firebaseUser.email?.toLowerCase() ?? "";
      if (!ALLOWED_EMAILS.includes(email)) {
        setError(`La cuenta ${firebaseUser.email} no tiene acceso a este panel.`);
        await firebaseSignOut(auth);
        return;
      }

      setError(null);
      setUser(firebaseUser);
      setStatus("authorized");
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(getFirebaseAuth());
  }, []);

  return { status, user, error, signInWithGoogle, signOut };
}
