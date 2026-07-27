import { Navigate } from "react-router-dom";
import { roles } from "../constants/systemRoles";

function ProtectedRoute({ children, allowedRoles }) {
  //not authanticated
  const user = JSON.parse(localStorage.getItem("user"));
  //console.log(user.data.username);
  if (!user?.token) {
    return <Navigate to={"/login"} replace={true} />;
  }

  //authanticated but not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === roles.user)
      return <Navigate to="/user-dashboard" replace />;//this pages acts as home page for non-authprized users
    else if (user.role === roles.admin)
      return <Navigate to="/admin-dashboard" replace />;//this pages acts as home page for non-authprized admins
  }

  //authanticated and authorized
  return children;
}

export default ProtectedRoute;
