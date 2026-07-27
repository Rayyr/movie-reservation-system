import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Home from './pages/Home.jsx';
import { ToastContainer ,Bounce} from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>

       {/* authentication routes , accesasable by puplic */}
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/sign-up" element={<SignUp></SignUp>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
      <Route path="/reset-password/:token" element={<ResetPassword></ResetPassword>}></Route>


{/* protected routes */}
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard></AdminDashboard></ProtectedRoute>}></Route>
      <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard></UserDashboard></ProtectedRoute>}></Route>


     </Routes>
     </BrowserRouter>
      <ToastContainer
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
      </>
  );
}

export default App;
