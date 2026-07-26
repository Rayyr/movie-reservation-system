import axios from "axios";
import { toast } from "react-toastify";

//instance creator
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

//Interceptors allow you to perform actions or modifications before a request is sent or after a response is received:

//Every request through api now automatically sends the JWT.
// attach token automatically when you make api requests : request interceptor
api.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

//response interceptor
api.interceptors.response.use(
  function (response) {
    return response;
  }, //success
  function (error) {
    //When it expires, the backend returns 401, Axios removes the saved session, and the user returns to Login.
    //not authorized/user not found
       if (error.response?.status === 401) {
      localStorage.removeItem("user");

            // Redirect to Login only if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    //failure
    return Promise.reject(error);
  },
);

export default api;
