import {
  Container,
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { useState, useEffect, useContext, useMemo } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import MovieCard from "../components/user-defined/MovieCard";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { Pagination } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Navigate, useNavigate } from "react-router-dom";
import movieAlt from "../assests/Movie/movieAlt.png";
import { motion } from "framer-motion";

export default function MovieList() {
  const { logout } = useContext(AuthContext);

  const [movies, setMovies] = useState([]);

  const moviesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const displayedMovies = useMemo(() => {
    const start = (currentPage - 1) * moviesPerPage;
    return movies.slice(start, start + moviesPerPage);
  }, [movies, currentPage]);

  //for overview state
  const [open, setOpen] = useState(false);
  const handleOpen = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMovie(null);
  };
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  /*       useEffect(() => {
    setCurrentPage(1); // go back to page 1 when filters change
  }, [filters]); */

  //reset to last page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocking] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setIsBlocking(true);

      try {
        const res = await api.get("/api/movies/getAll");
        setMovies(res.data.movies);
      } catch (error) {
        // api network error connection
        if (error.code === "ERR_NETWORK")
          toast.error("No network connection", {
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
        // api error so sth not from user
        else if (error.response.status === 500) {
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
      } finally {
        setIsLoading(false);
        setIsBlocking(false);
      }
    };
    fetchMovies();
  }, []);

  const navigate = useNavigate();

  const handleBuyTicket = (movie) => {
    //console.log(movie._id);
    //disaply showTimes for this movie
    navigate(`/show-times/${movie._id}`);
  };

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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="m" sx={{ mt: 4, flexGrow: 1 }}>
        <Grid
          container
          spacing={5}
          justifyContent="center"
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayedMovies.map((movie) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={movie._id}
              sx={{ display: "flex", justifyContent: "center" }}
              component={motion.div}
              variants={itemVariants}
            >
              {/* //movie card */}
              <MovieCard
                movie={movie}
                handleOpen={() => handleOpen(movie)}
                handleBuyTicket={handleBuyTicket}
              ></MovieCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3, py: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, newPage) => setCurrentPage(newPage)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "var(--blue)",
                color: "white",
              },
              "& .MuiPaginationItem-root.Mui-selected:hover": {
                backgroundColor: "var(--blue)",
              },
            }}
          />
        </Box>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "#020617",
            color: "#fff",

            borderRadius: 3,
            boxShadow: 24,
            p: 3,
          }}
        >
          <IconButton
            aria-label="Close movie overview"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1,
              color: "#fff",
              backgroundColor: "rgba(2, 6, 23, 0.55)",
              "&:hover": { backgroundColor: "rgba(2, 6, 23, 0.8)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedMovie && (
            <>
              {/* Poster */}
              <Box
                component="img"
                src={selectedMovie.poster_path ? `${process.env.REACT_APP_BASE_MOVIES_IMGS_URL}${selectedMovie.poster_path}` : movieAlt}
                
                alt={selectedMovie.title}
                sx={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                  borderRadius: 2,
                  mb: 2,
                }}
              />

              {/* Overview */}
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {selectedMovie.overview
                  ? selectedMovie.overview
                  : "Currentlly there is no overview for this movie"}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
