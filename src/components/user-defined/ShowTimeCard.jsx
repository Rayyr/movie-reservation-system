import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import movieAlt from "../../assests/Movie/movieAlt.png";


const ShowTimeCard = ({ st, movie }) => {
  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        background: "#1c1c1c",
        color: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* 🎬 Poster */}
      <Box
        component="img"
        src={movie.poster_path?movie.poster_path:movieAlt}
        alt="poster"
        sx={{
          width: 120,
          height: 160,
          objectFit: "cover",
        }}
      />

      {/* 📄 Content */}
      <CardContent sx={{ flex: 1 }}>
        {/* 🎬 Movie Name */}
        <Typography variant="h6">
          {movie?.title || "Movie"}
        </Typography>

        {/* 📍 Theater */}
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {st.screen?.theater?.name}
        </Typography>

        {/* ⏰ Time */}
        <Typography sx={{ mt: 1 }}>
          {new Date(st.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" - "}
          {new Date(st.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>

        {/* 💰 Price */}
        <Typography sx={{ mt: 1 }}>
          💰 {st.price} EGP
        </Typography>

        {/* 🎟️ Button */}
        <Button
          variant="contained"
          sx={{
            mt: 2,
            background: "var(--red)",
            "&:hover": {
              background: "#ff4444",
            },
          }}
          onClick={() => console.log("Selected:", st)}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShowTimeCard;