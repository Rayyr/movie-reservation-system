import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import ShowTimeCard from "../components/user-defined/ShowTimeCard";
import notFoundMovieBg from "../assests/Movie/notFoundMovieBg.avif";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import RateModal from "../components/user-defined/RateModal";
import { AuthContext } from "../context/AuthContext";
import { GoChevronLeft } from "react-icons/go";
function ShowTimes() {
  const { logout, user } = useContext(AuthContext);

  //exatrct movie from url path
  const { movieID } = useParams();

  const [movie, setMovie] = useState(null);

  const [showTimes, setShowTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocking] = useState(false);

  const [isUserRate, setIsUserRate] = useState(false);

  const [open, setOpen] = useState(false);

  const handleOpen = (movie) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  //fetch if user rate this movie or no
  useEffect(() => {
    const fetchIfRate = async () => {
      try {
        //if no logged in user then you cant rate
        if(user){
            
        const res = await api.get(`/api/ratings/IfUserRate/${movieID}` );
        if (res.data === true) setIsUserRate(true); //user already previouslly rate for this movie
        if (res.data === false) setIsUserRate(false); //user not ..
        }
      } catch (error) {
        // api error
        if (error.response.status === 500) {
          toast.error(error.response.data.message, {
            style: {
              width: "500px",
            },
            onOpen: () => {
              setIsBlocking(true);
            },
            onClose: () => {
              setIsBlocking(false);
              logout();
            },
          });
        }
      }
    };
    fetchIfRate();
  }, [movieID,user,handleClose]);//handleClose when the modal is closed so the user submit rating or not since the api which check if he rate or not not as same as the one which it will submit rating 

  //fetch movie obj
  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      setIsBlocking(true);
      try {
        const res = await api.get(`/api/movies/getOne/${movieID}`);

        setMovie(res.data);

        setIsLoading(false);
        setIsBlocking(false);
      } catch (err) {
        // api network error connection
        if (err.code === "ERR_NETWORK")
          toast.error("No network connection", {
            style: {
              width: "500px",
            },
            onOpen: () => {
              setIsBlocking(true);
            },
            onClose: () => {
              logout();
            },
          });
        //api error || invalid movie id error
        else if (err.response.status === 400 || err.response.status === 500) {
          toast.error(err.response.data.message, {
            style: {
              width: "500px",
            },
            onOpen: () => {
              setIsBlocking(true);
            },
            onClose: () => {
              setIsBlocking(false);
            },
          });
        }
      }
    };
    fetchMovie();
  }, [movieID]);

  useEffect(() => {
    const fetchShowTimes = async () => {
      setIsBlocking(true);
      setIsLoading(true);

      // console.log(movieID);
      try {
        //fetch showtimes related to that movie
        const res = await api.get(
          `/api/showTimes/getMovieShowTimes/${movieID}`,
        );
        setShowTimes(res.data.showtimes);
        setIsBlocking(false);
        setIsLoading(false);
      } catch (err) {
        // api network error connection
        if (err.code === "ERR_NETWORK")
          toast.error("No network connection", {
            style: {
              width: "500px",
            },
            onOpen: () => {
              setIsBlocking(true);
            },
            onClose: () => {
              logout();
            },
          });
        //api error
        else if (err.response.status === 500) {
          toast.error(err.response.data.message, {
            style: {
              width: "500px",
            },
            onOpen: () => {
              setIsBlocking(true);
            },
            onClose: () => {
              setIsBlocking(false);
              logout();
            },
          });
        }
      }
    };

    fetchShowTimes();
  }, [movieID]);

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

  const MotionBox = motion(Box);

  const navigate=useNavigate();

  return isLoading || isBlocked ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // or "100vh" for full screen
      }}
    >
      <CircularProgress sx={{ color: "var(--blue)" }} size={40} />
    </Box>
  ) : (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        minHeight: "100vh",
        backgroundImage: movie?.backdrop_path
          ? `url(${process.env.REACT_APP_BASE_MOVIES_IMGS_URL}${movie.backdrop_path})`
          : `url(${notFoundMovieBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* 🔥 Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,

          backdropFilter: "blur(2px)",
          zIndex: 0,
        }}
      />

         


      {/* 🎯 Content */}
      <Box sx={{ position: "relative", zIndex: 1 }}>

         {/* Back  */}
            <motion.div
              variants={itemVariants}
              style={{
                textAlign: "left",
                alignItems: "center",
                justifyContent: "start",
                 
              }}
            >
              <Box
                onClick={() => navigate("/movie-list")}
                sx={{
                  display: "inline-flex",
      
                  gap: "6px",
                  cursor: "pointer",
                  textAlign: "center",
                  mt: 3,
                  marginLeft: 3,
                  color: "var(--red)",
                  pointerEvents: isLoading || isBlocked ? "none" : "auto", // ✅ (actually as a disable prop it is not disabled but as style ) disables click
                }}
              >
                <GoChevronLeft size={18} style={{ display: "block" }} />
                <Typography variant="body1" sx={{ lineHeight: 1, fontWeight: 500 }}>
                  Back
                </Typography>
              </Box>
            </motion.div>


        {/* 🎬 Title */}
        <motion.div variants={itemVariants}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: "white",
            }}
          >
            {movie?.title}
          </Typography>
          {/*           display the btn if user not rate this movie otherwise hide it
           */}
          {isUserRate === false && user ? (
            <Button
              sx={{
                background: "var(--red)",
                borderRadius: "999px",
                textTransform: "none",
                px: 2,
                py: 0.25,
                minHeight: 32,
                fontSize: "0.8rem",
                "&:hover": { background: "#e11d48" },
                mt: 3.5,
                color: "#fff",
              }}
              disabled={isBlocked || isLoading}
              onClick={(e) => {
                e.preventDefault();
                handleOpen();
              }}
            >
              Rate now
            </Button>
          ) : null}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="subtitle1"
            sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}
          >
            Available Showtimes
          </Typography>
        </motion.div>

        {/* 🎟️ Showtimes */}
        {showTimes.length !== 0 ? (
          <Grid container spacing={3}>
            {showTimes.map((st) => (
              <Grid item xs={12} sm={6} md={4} key={st._id}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={6}
                    sx={{
                      p: 3,
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(10px)",
                      color: "#fff",
                      transition: "0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-5px) scale(1.02)",
                        background: "rgba(255,255,255,0.15)",
                      },
                    }}
                  >
                    <ShowTimeCard st={st} movie={movie} />
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              mt: 5,
              textAlign: "center",
              color: "white",
              opacity: 0.8,
            }}
          >
            <motion.div variants={itemVariants}>
              <Typography variant="h5">🎬 No showtimes available</Typography>
            </motion.div>
          </Box>
        )}
      </Box>

      <RateModal movieID={movieID} open={open} handleClose={handleClose} />
    </MotionBox>
  );
}

export default ShowTimes;
