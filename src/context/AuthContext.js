import { createContext, useState, useEffect } from "react";
import { startTimer } from "../utils/tokenExpiry";
import { Navigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ Start timer when user logs in / refresh === frontend token expiry detecteion beside api requests that tthey will made later ..
  useEffect(() => {
    if (user?.token) {
      startTimer(user.token,logout);
    }
    if(user)
    localStorage.setItem("user",JSON.stringify(user));
  }, [user]);//so in every user update this will be triggered so refresh token 


  ///////////detect manual localStorage : modify them later in case the user info has been update so the storage must be synchronized
   // ✅ Detect manual localStorage changes (VERY IMPORTANT) such as deletion
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("user");

      if (!stored) {
        logout();
      } else {
        setUser(JSON.parse(stored));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    //cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ✅ Extra safety check (runs on every render):meaningless 
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored && user) {
      logout();
    }
  }, [user]);
///////////

  // ✅ LOGIN -frontend side
  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

   
  // ✅ LOGOUT -frontend
  const logout = () => {

     
    localStorage.removeItem("user");
    setUser(null);
   // window.location.replace("/login");//replace as replace prop we passed previosully
   //navigate("/login",{replace:true});
   return <Navigate to="/login" replace={true}></Navigate>//importnat to put replace prop 
  };

  return (
    <AuthContext.Provider value={{ login, logout, user ,setUser}}>
      {children}
    </AuthContext.Provider>
  );
};
