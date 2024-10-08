import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  Stats,
  AllEvent,
  Profile,
  Admin,
  EditEvent,
  AddEvent,
} from "./pages";
import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { loader as dashboardloader } from "./pages/DashboardLayout";
import { loader as allShipLoader } from "./pages/AllEvent";
import { loader as editShipLoader } from "./pages/EditEvent";
import { action as editShipAction } from "./pages/EditEvent";
import { action as deleteShipAction } from "./pages/DeleteEvent";
import { loader as adminLoader } from "./pages/Admin";
import { action as profileAction } from "./pages/Profile";
import { loader as statsLoader } from "./pages/Stats";

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};
const isDarkThemeEnabled = checkDefaultTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "dashboard",
        element: <DashboardLayout isDarkThemeEnabled={isDarkThemeEnabled} />,
        loader: dashboardloader,
        children: [
          {
            index: true,
            element: <AllEvent />,
            loader: allShipLoader,
          },
          {
            path: "add-events",
            element: <AddEvent />,
          },
          {
            path: "stats",
            element: <Stats />,
            loader: statsLoader,
          },
          {
            path: "profile",
            element: <Profile />,
            action: profileAction,
          },
          {
            path: "admin",
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: "edit-event/:id",
            element: <EditEvent />,
            loader: editShipLoader,
            action: editShipAction,
          },
          {
            path: "delete-event/:id",
            action: deleteShipAction,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
