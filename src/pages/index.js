import Login from "../pages/login.js";
import SignUp from "../pages/sign-up.js";
import Home from "../pages/dashboard.js";
import Profile from "../pages/profile.js";
import Page404 from "../pages/no-data-found.js";

const routes = [
  {
    path: "/",
    pages: () => <Home />,
  },
  {
    path: "/login",
    pages: () => <Login />,
    isPublic: true,
  },
  {
    path: "/signup",
    pages: SignUp,
    isPublic: true,
  },

  {
    path: "/profile",
    pages: Profile,
  },
  {
    path: "*",
    pages: Page404,
  },
];

export default routes;
