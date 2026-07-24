import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Home from './pages/Home.jsx';
import { ToastContainer ,Bounce} from 'react-toastify';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>

       {/* accesasable by puplic */}
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/signUp" element={<SignUp></SignUp>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>

      <Route path="/adminDashboard" element={<AdminDashboard></AdminDashboard>}></Route>
    
      <Route path="/userDashboard" element={<UserDashboard></UserDashboard>}></Route>

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
