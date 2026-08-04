import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Home from "./pages/Home.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import { AuthProvider } from "./context/AuthContext.js";
import { roles } from "./constants/systemRoles.js";
import { Toaster } from "react-hot-toast";
import Profile from './pages/Profile.jsx';
import MovieList from "./pages/MovieList.jsx";
import ShowTimes from "./pages/ShowTimes.jsx";
import SelectSeat from './pages/SelectSeat.jsx';
import { dummyRemountVar } from "./constants/systemVars.js";
import { useState } from "react";

function App() {
 
  //to force component remounting
  const [remountKey,setRemountKey]=useState(1);
 
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* authentication routes , accesasable by puplic and not loggedin users */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Home></Home>
                </PublicRoute>
              }
            ></Route>
            <Route
              path="/sign-up"
              element={
                <PublicRoute>
                  <SignUp></SignUp>
                </PublicRoute>
              }
            ></Route>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login></Login>
                </PublicRoute>
              }
            ></Route>
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword></ForgotPassword>
                </PublicRoute>
              }
            ></Route>
            <Route
              path="/reset-password/:token"
              element={
                <PublicRoute>
                  <ResetPassword></ResetPassword>
                </PublicRoute>
              }
            ></Route>

            {/* protected routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={roles.admin}>
                  <AdminDashboard></AdminDashboard>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={roles.user}>
                  <UserDashboard></UserDashboard>
                </ProtectedRoute>
              }
            ></Route>

            <Route path="/movie-list" element={<MovieList ></MovieList >}> </Route>
{/*             <Route path="/movie-list" element={<ProtectedRoute allowedRoles={[roles.user,roles.admin]}><MovieList ></MovieList ></ProtectedRoute>}> </Route>
 */}
            <Route path="/profile" element={<ProtectedRoute allowedRoles={[roles.user,roles.admin]}><Profile></Profile></ProtectedRoute>}> </Route>
         
            <Route path="/show-times/:movieID" element={ <ShowTimes></ShowTimes> }> </Route>

{/* since this page will contain booking confirmation so it must be protected
 */}            <Route path="/select-seat" element={<ProtectedRoute allowedRoles={[roles.user,roles.admin]}> <SelectSeat remountKey={remountKey} setRemountKey={setRemountKey} key={remountKey}></SelectSeat> </ProtectedRoute>}> </Route>

          </Routes>
        </BrowserRouter>
        <ToastContainer //for async toast msgs
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

        <Toaster //for sync msgs
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toasterId="default"
          duration="4000"
        />
      </AuthProvider>
    </>
  );
}

export default App;
