import { Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";
import { useState,useEffect } from "react";

export default  function MovieList  ()  {
 
    //get it from db
        const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies([
      { id: 1, title: "Inception", poster: "https://via.placeholder.com/300" },
      { id: 2, title: "Interstellar", poster: "https://via.placeholder.com/300" },
    ]);
  }, []);


    return (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={3} key={movie.id}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={movie.poster}
              alt={movie.title}
            />
            <CardContent>
              <Typography variant="h6">
                {movie.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};