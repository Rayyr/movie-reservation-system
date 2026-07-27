import { roles } from "../constants/systemRoles";
import { Navigate } from "react-router-dom";

//tp prevent logged-in users to visit such as pages which are wrapped with Puplic route
function PuplicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    //prevenr him,so keep him in his current location , so only allow for not loggedin users
    return children;
  } else {
        if (user.role === roles.user)
      return <Navigate to="/user-dashboard" replace />;
    else if (user.role === roles.admin)
      return <Navigate to="/admin-dashboard" replace />;
  
  }
}

export default PuplicRoute;
