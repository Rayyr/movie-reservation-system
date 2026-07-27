import { createContext, useState, useEffect } from "react";
import { startTimer } from "../utils/tokenExpiry";

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
  }, [user]);

  // ✅ LOGIN
  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.replace("/login");//replace as replace prop we passed previosully
  };

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
