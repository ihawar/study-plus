import {
  MdOutlineSpaceDashboard,
  MdOutlineTimer,
  MdOutlineTask,
  MdOutlineNotes,
  MdOutlineLibraryBooks,
} from "react-icons/md";

export const sidebarItems = [
  {
    text: "Dashboard",
    nav_to: "/",
    icon: <MdOutlineSpaceDashboard className="text-3xl" />,
  },
  {
    text: "Timer",
    nav_to: "/timer",
    icon: <MdOutlineTimer className="text-3xl" />,
  },
  {
    text: "Tasks",
    nav_to: "/tasks",
    icon: <MdOutlineTask className="text-3xl" />,
  },
  {
    text: "Notes",
    nav_to: "/notes",
    icon: <MdOutlineNotes className="text-3xl" />,
  },
  {
    text: "Books",
    nav_to: "/books",
    icon: <MdOutlineLibraryBooks className="text-3xl" />,
  },
];
