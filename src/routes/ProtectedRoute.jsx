import { Navigate } from "react-router-dom";
import { roles } from "../constants/systemRoles";

function ProtectedRoute({ children, allowedRoles }) {
  //not authanticated
  const user = localStorage.getItem("user");
  if (!user?.token) {
    return <Navigate to={"/login"} replace={true} />;
  }

  //authanticated but not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === roles.user)
      return <Navigate to="/user-dashboard" replace />;
    else if (user.role === roles.admin)
      return <Navigate to="/admin-dashboard" replace />;
  }

  //authanticated and authorized
  return children;
}

export default ProtectedRoute;
