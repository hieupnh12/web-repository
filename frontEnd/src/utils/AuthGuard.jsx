import { Navigate, Outlet } from "react-router-dom";
import Cookie from "js-cookie";

const AuthGuard = () => {
  const token = Cookie.get("token");

  if (!token) {
    return <Navigate to="/" replace />; // Chuyển hướng về trang đăng nhập
  }

  return <Outlet />;
};

export default AuthGuard;