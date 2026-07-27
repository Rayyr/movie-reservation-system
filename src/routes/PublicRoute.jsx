import { roles } from "../constants/systemRoles";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

//tp prevent logged-in users to visit such as pages which are wrapped with Puplic route
function PublicRoute({ children }) {

  const {user} = useContext(AuthContext);

  if (!user) {
    //prevenr him,so keep him in his current location , so only allow for not loggedin users
    return children;
  } else {   // If logged in → redirect based on role
        if (user.role === roles.user)
      return <Navigate to="/user-dashboard" replace />;
    else if (user.role === roles.admin)
      return <Navigate to="/admin-dashboard" replace />;
  
  }
}

export default PublicRoute;
