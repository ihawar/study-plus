import { createContext, useContext } from "react";
import { type User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
};

export const AuthUserContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const ctx = useContext(AuthUserContext);
  if (!ctx) throw new Error("useUser must be used inside AlertProvider");
  return ctx;
}
