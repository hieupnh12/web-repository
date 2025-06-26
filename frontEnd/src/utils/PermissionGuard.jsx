import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PermissionGuard = ({ children, requiredFunctionId }) => {
  const allowedFunctionIds = useSelector((state) => state.auth.functionIds);
  const info = sessionStorage.getItem("roleName");

  // const check = () => {
  //   if (info === "ADMIN") {
  //     return "manager";
  //   } else {
  //     return "staff";
  //   }
  // };


  const hasPermission = allowedFunctionIds.includes(requiredFunctionId);

  if (!hasPermission) {
    return <Navigate to={`${"/"+check() + "/"}dashboard`} replace />;
  }

  return children;
};

export default PermissionGuard;
