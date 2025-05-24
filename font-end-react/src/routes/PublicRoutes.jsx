import React from "react";
import LoadLazy from "../components/LoadLazy";
const PublicLayout = React.lazy(() => import("../layouts/user/PublicLayout"));
const Home = React.lazy(() => import("../pages/user/home"));
const Login = React.lazy(() => import("../pages/user/login"));
const NotFound = React.lazy(() => import("../pages/user/notFound"));

const PublicRoutes = [
  {
    path: "/",
    element: <LoadLazy children={<PublicLayout />} />,
    children: [
      {
        index: true,
        element: <LoadLazy children={<Home />} />,
      },
      {
        path: "login",
        element: <LoadLazy children={<Login />} />,
      },
      {
        path: "*",
        element: <LoadLazy children={<NotFound />} />,
      },
    ],
  },
];

export default PublicRoutes;
