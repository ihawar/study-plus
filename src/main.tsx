import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./routes/Dashboard";
import Timer from "./routes/Timer";
import Tasks from "./routes/Tasks";
import Notes from "./routes/Notes";
import Books from "./routes/Books";
import { LoadingProvider } from "./context/LoadingContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/timer", element: <Timer /> },
      { path: "/tasks", element: <Tasks /> },
      { path: "/notes", element: <Notes /> },
      { path: "/books", element: <Books /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  </StrictMode>
);
