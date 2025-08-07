import { createContext, useContext } from "react";
import { type User } from "@supabase/supabase-js";
import type { Profile } from "../types/db";
import { useAuthUser } from "../hooks/useAuthUser";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refetchProfile: () => Promise<void>;
};

export const AuthUserContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const ctx = useContext(AuthUserContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthUserContext");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthUser();

  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
}
