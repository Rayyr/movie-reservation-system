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
import PuplicRoute from './routes/PuplicRoute.jsx';
import { AuthProvider } from './context/AuthContext.js';

function App() {
  return (
    <>
   <AuthProvider>
    <BrowserRouter>
    <Routes>

       {/* authentication routes , accesasable by puplic and not loggedin users */}
      <Route path="/" element={<PuplicRoute><Home></Home></PuplicRoute>}></Route>
      <Route path="/sign-up" element={<PuplicRoute><SignUp></SignUp></PuplicRoute>}></Route>
      <Route path="/login" element={<PuplicRoute><Login></Login></PuplicRoute>}></Route>
      <Route path="/forgot-password" element={<PuplicRoute><ForgotPassword></ForgotPassword></PuplicRoute>}></Route>
      <Route path="/reset-password/:token" element={<PuplicRoute><ResetPassword></ResetPassword></PuplicRoute>}></Route>


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
      </AuthProvider>
      </>
  );
}

export default App;
