import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import ShowTimeCard from "../components/user-defined/ShowTimeCard";
import notFoundMovieBg from "../assests/Movie/notFoundMovieBg.avif";
import { motion } from "framer-motion";
import {CircularProgress} from '@mui/material';

function ShowTimes() {
  //exatrct movie from url path
  const { movieID } = useParams();

  const [movie, setMovie] = useState(null);

  const [showTimes, setShowTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocking] = useState(false);

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
            } 
          });
        //api error || invalid movie id error
        else if (err.response.status===400 || err.response.status === 500) {
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
            } 
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

  const MotionBox = motion(Box);

  return (
    isLoading || isBlocked) ? (
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
        backgroundRepeat: "no-repeat",
        position: "relative",
        p: 3,
      }}
    >
      <h1>{movie?.title} showtimes</h1>
      {showTimes.length!==0? ( showTimes.map((st) => (
        <ShowTimeCard key={st._id} st={st} movie={movie} />
      ))): <h1>Sorry , currentlly there is no showtimes for this movie</h1>}
    </MotionBox>
      
  );
}

export default ShowTimes;
