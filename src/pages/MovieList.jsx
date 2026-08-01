import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import MovieCard from "../components/user-defined/MovieCard";
import { CircularProgress } from "@mui/material";

export default function MovieList() {
  const [movies, setMovies] = useState([]);

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
            },
          });
        // api error
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
            },
          });
        }
      } finally {
        setIsLoading(false);
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
    <Container maxWidth="m" sx={{ mt: 4 }}>
      <Grid container spacing={5} justifyContent="center">
        {movies.map((movie) => (
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
  );
}
