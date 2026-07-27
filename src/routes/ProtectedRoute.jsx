import { Navigate } from "react-router-dom";
import { roles } from "../constants/systemRoles";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
     const {user}=useContext(AuthContext);
     
  //not authanticated
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
