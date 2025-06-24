import Login from "../pages/login.js";
import SignUp from "../pages/sign-up.js";
import Home from "../pages/dashboard.js";
import Page404 from "../pages/no-data-found.js";
import BookDetails from "../pages/book-details.js";

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
    path: "/books",
    pages: () => <Home />,
  },
  {
    path: "/books/:id",
    pages: BookDetails,
  },
  {
    path: "*",
    pages: Page404,
  },
];

export default routes;
