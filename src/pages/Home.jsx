import { useNavigate ,Link} from "react-router-dom";
import "../styles/Home/Home.css";
import TypewriterText from "../assests/Fonts/TypewriterText";

function Home() {
 
  return (
    <>
 

            {/* Navbar */}
      <nav className="navbar">
        <div className="nav-links">
       <Link to="/login" replace={false}>Login</Link>
       <Link to="/signUp" replace={false}>Sign-up</Link>
        </div>
      </nav>


      <div className="home">
        <section className="hero">
          <div className="overlay">
            <h1>Movie Reservation System</h1>
            <TypewriterText text="Reserve your seat and escape into unforgettable moments." />
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
