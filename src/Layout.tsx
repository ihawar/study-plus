import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import Login from "./components/Login";
import supabase from "./utils/supabase";
import { type User } from "@supabase/supabase-js";
import { AlertProvider } from "./context/AlertContext";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Session error:", error);
      setUser(data.session?.user ?? null);
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
      <AlertProvider>
        <div>
          <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <main className="flex justify-center items-center w-full min-h-screen p-4">
          {!user ? <Login /> : <Outlet />}
        </main>
      </AlertProvider>
    </div>
  );
}
