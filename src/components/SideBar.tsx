import { IoIosClose } from "react-icons/io";
import { BsLayoutSidebar } from "react-icons/bs";

import { NavLink } from "react-router-dom";

import { sidebarItems } from "../constants/sidebarItems";

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: Function;
};
export default function SideBar({ isOpen, setIsOpen }: SideBarProps) {
  return (
    <div
      className={`bg-gray-100  r-0 t-0 
     h-dvh  ${
       isOpen
         ? "w-[min(20rem,80vw)] backdrop-blur-sm bg-gray-100/80 z-50 fixed inset-0 lg:relative"
         : "max-w-[100px]"
     } 
     
     flex flex-col justify-between  py-10`}
    >
      {/* top part (logo and close button) */}
      <div
        className={`flex items-center ${
          isOpen ? "pl-8 pr-2" : "justify-center"
        }`}
      >
        {isOpen ? (
          <>
            <Logo />
            <IoIosClose
              onClick={() => {
                setIsOpen(false);
              }}
              className="size-12 text-gray-500 rounded-2xl duration-200 ease-in-out hover:bg-green-100 cursor-pointer"
            />
          </>
        ) : (
          <BsLayoutSidebar
            onClick={() => setIsOpen(true)}
            className="size-14 text-primary-400 rounded-2xl cursor-pointer hover:bg-green-100 p-2"
          />
        )}
      </div>
      {/* navbar */}
      <nav
        className={`w-full flex flex-col ${
          isOpen ? "px-4 gap-6" : "px-2 gap-12"
        } `}
      >
        {sidebarItems.map(({ text, nav_to, icon }) => (
          <SideBarElement
            key={nav_to}
            text={text}
            nav_to={nav_to}
            icon={icon}
            is_open={isOpen}
          />
        ))}
      </nav>

      {/* bottom part(use profile) */}
      <div className={`w-full ${isOpen ? "px-4" : "px-2"}`}>
        <SideBarProfile profile={"profile.svg"} is_open={isOpen} />
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <div className="text-primary-400 text-4xl font-bold flex gap-1.5 items-center w-full select-none">
      <img className="size-16" src="logo.svg" alt="study plus logo" />
      Study +
    </div>
  );
};

type SideBarElementProps = {
  text: string;
  icon: React.ReactNode;
  nav_to: string;
  is_open: boolean;
};

const SideBarElement = ({
  text,
  icon,
  nav_to,
  is_open,
}: SideBarElementProps) => {
  return (
    <NavLink
      className={`sidebar_element ${is_open ? "" : "px-2 py-2 justify-center"}`}
      to={nav_to}
    >
      {icon}
      {is_open ? text : ""}
    </NavLink>
  );
};

type SideBarProfileProps = {
  profile: string | null;
  is_open: boolean;
};

const SideBarProfile = ({ profile, is_open }: SideBarProfileProps) => {
  return (
    <div
      className={`flex gap-4 items-center w-full cursor-pointer rounded-3xl ${
        is_open ? "px-4 py-4" : "justify-center py-0"
      } hover:bg-gray-200 duration-100 ease-in-out`}
    >
      <div
        className={`bg-green-200 bg-[url(${profile})]  bg-cover ${
          is_open ? "size-16" : "size-12"
        } rounded-full `}
      ></div>

      {is_open ? (
        <div>
          <p className="text-gray-700 font-medium text-2xl">Aram </p>
          <p className="text-gray-600">Manage your profile.</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
