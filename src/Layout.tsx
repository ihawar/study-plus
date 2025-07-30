import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import { useState } from "react";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      <div>
        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
