import { useContext, useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/UserDashboard/userDashboard.module.css";
import AuroraBG from "../components/built-in/Aurora-bg";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/built-in/DropDownMenu.jsx";

function UserDashboard() {
  const { user, logout } = useContext(AuthContext);

  ////////////

  //////////
  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className={styles.main}>
      {/* Background */}
      <AuroraBG
        colorStops={["#4299e1", "#000000", "#7B1025"]}
        blend={0.9}
        amplitude={2.2}
        speed={1.3}
      />

      {/* 🔥 Navbar */}
      <motion.div
        className={styles.navContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className={styles.navbar}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Left Links */}
          <motion.div className={styles.navLinks} variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Link to="/">Home</Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/movie-list">Movies</Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/theaters">Theatres</Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/releases">Releases</Link>
            </motion.div>
          </motion.div>

          {/* RIGHT SECTION */}
          <motion.div
            className={styles.rightSection}
            variants={containerVariants}
          >
            {/* Search */}
            <motion.span
              className={styles.searchIcon}
              variants={itemVariants}
              whileHover={{ scale: 1.2 }}
            >
              🔍
            </motion.span>

            {/* 🔥 RADIX DROPDOWN */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <motion.div
                  className={styles.avatar}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </motion.div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className={styles.dropdown} sideOffset={8}>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className={styles.dropdownItem} replace={false}>
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={logout}
                  className={styles.dropdownItem}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Welcome text */}
      <h1 className={styles.title}>Welcome {user?.username}</h1>
    </div>
  );
}

export default UserDashboard;
