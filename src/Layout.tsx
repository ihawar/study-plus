import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import Login from "./components/Login";
import { AlertProvider } from "./context/AlertContext";
import { useAuth } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import Loading from "./components/Loading";
import { useLoading } from "./context/LoadingContext";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);
  const { isLoading } = useLoading();
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex">
      <AlertProvider>
        <ModalProvider>
          <div>
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>

          <main className="flex justify-center items-center w-full min-h-screen p-4">
            {isLoading && <Loading />}
            {isAuthenticated ? <Outlet /> : <Login />}
          </main>
        </ModalProvider>
      </AlertProvider>
    </div>
  );
}
