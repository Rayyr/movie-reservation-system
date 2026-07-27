import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { toast } from "react-toastify";

const getTokenExpiry = (token) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");

    const decoded = JSON.parse(atob(payload));

    return decoded.exp * 1000; // JWT exp is in seconds
  } catch (error) {
    return 0;
  }
};

export const startTimer = (token) => {
  let expiryTimer;
  clearTimeout(expiryTimer);

  const expiryTime = getTokenExpiry(token);
  const timeLeft = expiryTime - Date.now();

  if (timeLeft <= 0) {
    handleLogout();
    return;
  }

  expiryTimer = setTimeout(handleLogout, timeLeft);
};

const handleLogout = async () => {
  try {
    const res = await api.post("api/auth/logout");
    toast.success(res.data.message, {
      style: {
        width: "500px",
      },
      /*     onOpen: () => {
            setIsBlocking(true);
          },
          onClose: () => {
            setIsBlocking(false);
          }, */
    });
  } catch (error) {
    if (error.code === "ERR_NETWORK")
      toast.error("No network connection", {
        style: {
          width: "500px",
        },
        /*   onOpen: () => {
            setIsBlocking(true);
          },
          onClose: () => {
            setIsBlocking(false);
          }, */
      });
    else
      toast.error(error.response.data.message, {
        style: {
          width: "500px",
        },
        /*   onOpen: () => {
            setIsBlocking(true);
          },
          onClose: () => {
            setIsBlocking(false);
          }, */
      });
  }
};
