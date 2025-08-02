import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import Login from "./components/Login";
import supabase from "./utils/supabase";
import { type User } from "@supabase/supabase-js";
import { AlertProvider } from "./context/AlertContext";
import { AuthUserContext } from "./context/AuthContext";
import Loading from "./components/Loading";
import { useLoading } from "./context/LoadingContext";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { isLoading, setLoading } = useLoading();

  const logout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Session error:", error);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex">
      <AuthUserContext.Provider
        value={{
          user,
          isLoading,
          isAuthenticated: !!user,
          logout,
        }}
      >
        <AlertProvider>
          <div>
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
          <main className="flex justify-center items-center w-full min-h-screen p-4">
            {isLoading && <Loading />}
            {!user ? <Login /> : <Outlet />}
          </main>
        </AlertProvider>
      </AuthUserContext.Provider>
    </div>
  );
}
