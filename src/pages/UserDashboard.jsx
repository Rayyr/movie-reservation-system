import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/userDashboard/userDashboard.module.css";
import AuroraBG from "../components/built-in/Aurora-bg";
 
function UserDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className={styles.main}>
      <AuroraBG
        colorStops={["#4299e1", "#000000", "#7B1025"]}
        blend={0.9}
        amplitude={2.2}
        speed={1.6}
      ></AuroraBG>
      <h1>weelcome user! {user.username}</h1>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          <Link to="/login" replace={false}>
            Login
          </Link>
          <Link to="/sign-up" replace={false}>
            Sign-up
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default UserDashboard;
