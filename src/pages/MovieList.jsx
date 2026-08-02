import { Container, Box } from "@mui/material";
import { useState, useEffect, useContext, useMemo } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import MovieCard from "../components/user-defined/MovieCard";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { Pagination } from "@mui/material";

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
        <Grid container spacing={5} justifyContent="center">
          {displayedMovies.map((movie) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={movie._id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {/* //movie card */}
              <MovieCard movie={movie}></MovieCard>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* //center it and make it split from contaner */}
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
    </Box>
  );
}
