import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { toast } from "react-toastify";

//timerId: A unique numerical ID returned to track or cancel the timer.
let timerId;

const getTokenExpiry = (token) => {
  try {
    return jwtDecode(token).exp * 1000;
  } catch {
    return 0;
  }
};

const expireSession = () => {
  //i will not invoke api logout since its protected route so since the token is expired so it will not enter it so i will take logout logic and put it here
  clearTimeout(timerId);

  localStorage.removeItem("user");

  toast.error("Sorry , your session has been expired , log-in again", {
    style: {
      width: "500px",
    },
    onClose: () => {
      window.location.replace("/login");
    },
  });
};

export const startTimer = (token) => {
  //stop the timer(manage timer)
  clearTimeout(timerId);

  const timeLeft = getTokenExpiry(token) - Date.now();

  if (timeLeft <= 0) {
    expireSession();
    return;
  }

  //it will assign a timer for -timeleft- once reaches 0 -expireSession will be called
  timerId = setTimeout(expireSession, timeLeft);
};

/* export const handleLogout = async () => {
  clearTimeout(expiryTimer);

  try {
    await api.post("/api/auth/logout");
  } catch {
    // Logout locally even if the API/network fails.
  } finally {
    localStorage.removeItem("user");
    window.location.replace("/login");
  }
}; */
