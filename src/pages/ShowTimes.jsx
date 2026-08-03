import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import ShowTimeCard from "../components/user-defined/ShowTimeCard";
import notFoundMovieBg from "../assests/Movie/notFoundMovieBg.avif";


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
              setIsBlocking(false);
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
            },
          });
        }
      } finally {
        setIsBlocking(false);
        setIsLoading(false);
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
              setIsBlocking(false);
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
            },
          });
        }
      } finally {
        setIsBlocking(false);
        setIsLoading(false);
      }
    };

    fetchShowTimes();
  }, [movieID]);



  return (
    <Box   sx={{
    minHeight: "100vh",

    // 🎬 dynamic background
    backgroundImage: movie?.backdrop_path
      ? `url(${movie.backdrop_path})`
      :  `url(${notFoundMovieBg})`,
 
    backgroundSize:"cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    // ✨ overlay عشان القراءة
    position: "relative",
 
  }}>
    
      {showTimes.map((st) => (
    <ShowTimeCard key={st._id} st={st} movie={movie} />
      ))}
    </Box>
  );
}

export default ShowTimes;
