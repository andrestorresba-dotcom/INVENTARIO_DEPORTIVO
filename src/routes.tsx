import { createBrowserRouter } from "react-router";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import UserManagement from "./components/UserManagement";
import Processes from "./components/Processes";
import Reports from "./components/Reports";
import MainLayout from "./components/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "productos", Component: ProductManagement },
      { path: "usuarios", Component: UserManagement },
      { path: "procesos", Component: Processes },
      { path: "reportes", Component: Reports },
    ],
  },
]);