import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

const routes = createBrowserRouter([...PrivateRoutes, ...PublicRoutes])

export default routes;