import axios from "axios";
import { toast } from "react-toastify";

//instance creator
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

//Interceptors allow you to perform actions or modifications before a request is sent or after a response is received:

// attach token automatically : request interceptor
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
    return response.data;
  }, //success
  function (error) {
    //failure
    return Promise.reject(error);
  },
);

export default api;
