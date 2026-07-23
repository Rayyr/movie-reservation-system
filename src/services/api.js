import axios from 'axios';

 
//instance creator 
const api=axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});


// attach token automatically
api.interceptors.request.use((req)=>{
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});


export default api;