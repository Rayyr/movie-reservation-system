import { roles } from "../constants/systemRoles";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigationType } from "react-router-dom";

//tp prevent logged-in users to visit such as pages which are wrapped with Puplic route
function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    //prevenr him,so keep him in his current location , so only allow it for not loggedin users
    return children;
  }

  const toastShown = useRef(false); // ✅ prevent multi toast msg appear

  const navigationType = useNavigationType();

  if (user && navigationType === "POP") { 
    if (!toastShown.current) {
      toast.error("Sign out first !", {
        style: {
          width: "500px",
        },
      });

      toastShown.current = true;
    }
  }

  // If logged in → redirect based on role
  if (user.role === roles.user)
    return <Navigate to="/user-dashboard" replace />;
  else if (user.role === roles.admin)
    return <Navigate to="/admin-dashboard" replace />;

  // fallback (just in case) : logged-in user but without role ==== redundant sice there is a defaulr role = USER
  return <Navigate to="/" replace />;
}

export default PublicRoute;
