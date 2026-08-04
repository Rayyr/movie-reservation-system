import { Navigate, useNavigate } from "react-router-dom";
import { roles } from "../constants/systemRoles";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { useRef } from "react";

function ProtectedRoute({ children, allowedRoles }) {
     const {user}=useContext(AuthContext);
     
       const toastShown = useRef(false); // ✅ prevent multi toast msg appear
     const navigate=useNavigate();
  //not authanticated
  if (!user?.token) {

      if(!toastShown.current){
      toast.error("Sign in first !", {
        style: {
          width: "500px",
        },
        
       
      });
    toastShown.current=true;
    }
 
    setTimeout(()=>{
navigate ("/login",{ replace:true} )
      
    },3000);//3 secs

  }

  if(user){
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
}

export default ProtectedRoute;
