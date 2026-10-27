import { Container, Box, Typography, Modal, Backdrop } from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import movieAlt from "../assests/Movie/movieAlt.png";
import { motion } from "framer-motion";
import { GoChevronLeft } from "react-icons/go";
import MovieCardAdmin from "../components/user-defined/MovieCardAdmin";
import { Plus, X } from "lucide-react";
import addMovieStyles from "../styles/AddMovie/AddMovie.module.css";

const emptyMovieForm = {
  title: "",
  genre: "",
  releaseDate: "",
  duration_min: "",
  overview: "",
  language: "english",
  poster_path: "",
  backdrop_path: "",
};

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

  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [newMovie, setNewMovie] = useState(emptyMovieForm);
  const [isCreatingMovie, setIsCreatingMovie] = useState(false);
  const [deletingMovieId, setDeletingMovieId] = useState(null);

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

  const handleNewMovieChange = (event) => {
    const { name, value } = event.target;
    setNewMovie((currentMovie) => ({ ...currentMovie, [name]: value }));
  };

  const handleCreateMovie = async (event) => {
    event.preventDefault();
    setIsCreatingMovie(true);

    try {
      const response = await api.post("/api/movies/create", {
        ...newMovie,
        duration_min: Number(newMovie.duration_min),
        releaseDate: new Date(newMovie.releaseDate).toISOString(),
      });
      setMovies((currentMovies) => [...currentMovies, response.data]);
      setCurrentPage(Math.ceil((movies.length + 1) / moviesPerPage));
      setNewMovie(emptyMovieForm);
      setIsAddMovieOpen(false);
      toast.success("Movie added successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add this movie.");
    } finally {
      setIsCreatingMovie(false);
    }
  };

  const handleDeleteMovie = async (movie) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${movie.title}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingMovieId(movie._id);
    try {
      await api.delete(`/api/movies/deleteOne/${movie._id}`);
      setMovies((currentMovies) =>
        currentMovies.filter((currentMovie) => currentMovie._id !== movie._id),
      );
      toast.success(`"${movie.title}" was deleted.`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete this movie.",
      );
    } finally {
      setDeletingMovieId(null);
    }
  };

  const handleCloseAddMovie = () => {
    if (isCreatingMovie) return;
    setIsAddMovieOpen(false);
    setNewMovie(emptyMovieForm);
  };

  const handleNav = () => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role === "USER")
        navigate("/user-dashboard"); //there is logged in user
      else navigate("/admin-dashboard");
    } else navigate("/login"); //not logged in user
  };

  return isLoading || isBlocked ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
          onClick={() => handleNav()}
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

      <motion.div
        className={addMovieStyles.listActions}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        {localStorage.getItem("user") &&
          JSON.parse(localStorage.getItem("user")).role === "ADMIN" && (
            <button
              className={addMovieStyles.addButton}
              type="button"
              onClick={() => setIsAddMovieOpen(true)}
            >
              <Plus size={18} />
              <span>Add movie</span>
            </button>
          )}
      </motion.div>
      {displayedMovies.length !== 0 ? (
        <>
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
                  {}
                  {/* //movie card for logged in users role or not logged in */}
                  {(!localStorage.getItem("user") ||
                    (localStorage.getItem("user") &&
                      JSON.parse(localStorage.getItem("user")).role !==
                        "ADMIN")) && (
                    <MovieCard
                      movie={movie}
                      handleOpen={() => handleOpen(movie)}
                      handleBuyTicket={handleBuyTicket}
                    ></MovieCard>
                  )}
                  {/* //movie card for admin */}
                  {localStorage.getItem("user") &&
                    JSON.parse(localStorage.getItem("user")).role ===
                      "ADMIN" && (
                      <MovieCardAdmin
                        movie={movie}
                        handleOpen={() => handleOpen(movie)}
                        handleDelete={handleDeleteMovie}
                        isDeleting={deletingMovieId === movie._id}
                      ></MovieCardAdmin>
                    )}
                </Grid>
              ))}
            </Grid>
          </Container>

          {totalPages > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", my: 3, py: 2 }}
            >
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
          {/*    <Outlet/> */}
        </>
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
            <Typography variant="h5">🎬 No movies available</Typography>
          </motion.div>
        </Box>
      )}
      <Modal
        open={isAddMovieOpen}
        onClose={handleCloseAddMovie}
        aria-labelledby="add-movie-title"
        aria-describedby="add-movie-description"
      >
        <Box className={addMovieStyles.modal}>
          <div className={addMovieStyles.modalHeader}>
            <div>
              <span className={addMovieStyles.modalEyebrow}>ADMIN TOOLS</span>
              <h2 id="add-movie-title">Add a movie</h2>
              <p id="add-movie-description">
                Add a title to the catalog for moviegoers to discover.
              </p>
            </div>
            <button
              className={addMovieStyles.closeButton}
              type="button"
              aria-label="Close add movie form"
              onClick={handleCloseAddMovie}
              disabled={isCreatingMovie}
            >
              <X size={19} />
            </button>
          </div>

          <form className={addMovieStyles.form} onSubmit={handleCreateMovie}>
            <div className={addMovieStyles.fields}>
              <label
                className={`${addMovieStyles.field} ${addMovieStyles.fullWidth}`}
              >
                <span>
                  Movie title <b>*</b>
                </span>
                <input
                  name="title"
                  value={newMovie.title}
                  onChange={handleNewMovieChange}
                  placeholder="Enter movie title"
                  required
                  maxLength={120}
                />
              </label>

              <label className={addMovieStyles.field}>
                <span>
                  Genre <b>*</b>
                </span>
                <input
                  name="genre"
                  value={newMovie.genre}
                  onChange={handleNewMovieChange}
                  placeholder="e.g. Action, Drama"
                  required
                />
              </label>

              <label className={addMovieStyles.field}>
                <span>
                  Release date <b>*</b>
                </span>
                <input
                  name="releaseDate"
                  type="date"
                  value={newMovie.releaseDate}
                  onChange={handleNewMovieChange}
                  required
                />
              </label>

              <label className={addMovieStyles.field}>
                <span>
                  Duration <b>*</b>
                </span>
                <div className={addMovieStyles.durationInput}>
                  <input
                    name="duration_min"
                    type="number"
                    min="1"
                    step="0.01"
                    value={newMovie.duration_min}
                    onChange={handleNewMovieChange}
                    placeholder="Runtime"
                    required
                  />
                  <span>min</span>
                </div>
              </label>

              <label className={addMovieStyles.field}>
                <span>Language</span>
                <input
                  name="language"
                  value={newMovie.language}
                  onChange={handleNewMovieChange}
                  placeholder="English"
                />
              </label>

              <label
                className={`${addMovieStyles.field} ${addMovieStyles.fullWidth}`}
              >
                <span>
                  Overview <b>*</b>
                </span>
                <textarea
                  name="overview"
                  value={newMovie.overview}
                  onChange={handleNewMovieChange}
                  placeholder="Write a short synopsis"
                  rows={4}
                  required
                />
              </label>

              <label
                className={`${addMovieStyles.field} ${addMovieStyles.fullWidth}`}
              >
                <span>Poster image path</span>
                <input
                  name="poster_path"
                  value={newMovie.poster_path}
                  onChange={handleNewMovieChange}
                  placeholder="Enter the poster path from your movie catalog"
                />
              </label>

              <label
                className={`${addMovieStyles.field} ${addMovieStyles.fullWidth}`}
              >
                <span>Backdrop image path</span>
                <input
                  name="backdrop_path"
                  value={newMovie.backdrop_path}
                  onChange={handleNewMovieChange}
                  placeholder="Optional backdrop path from your movie catalog"
                />
              </label>
            </div>

            <div className={addMovieStyles.formActions}>
              <button
                className={addMovieStyles.cancelButton}
                type="button"
                onClick={handleCloseAddMovie}
                disabled={isCreatingMovie}
              >
                Cancel
              </button>
              <button
                className={addMovieStyles.submitButton}
                type="submit"
                disabled={isCreatingMovie}
              >
                <Plus size={17} />
                {isCreatingMovie ? "Adding movie…" : "Add movie"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>

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
                src={
                  selectedMovie.poster_path
                    ? `${process.env.REACT_APP_BASE_MOVIES_IMGS_URL}${selectedMovie.poster_path}`
                    : movieAlt
                }
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
