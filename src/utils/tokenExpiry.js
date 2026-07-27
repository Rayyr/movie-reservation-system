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

export const startTimer = (token, logout) => {
  //stop the timer(manage timer)
  clearTimeout(timerId);

  const timeLeft = getTokenExpiry(token) - Date.now();

  if (timeLeft <= 0) {
    logout();
    return;
  }

  //it will assign a timer for -timeleft- once reaches 0 -expireSession will be called
  timerId = setTimeout(() => {
    toast.error("Sorry , your session has been expired , log-in again", {
      style: { width: "500px" },
      onClose:()=>{logout();}
    });
    
  }, timeLeft);
};
