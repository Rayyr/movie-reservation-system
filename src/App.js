import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Home from './pages/Home.jsx';


function App() {
  return (
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
  );
}

export default App;
