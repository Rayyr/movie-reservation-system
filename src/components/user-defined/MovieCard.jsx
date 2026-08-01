import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function MovieCard({ movie }) {
  return (
    <Card
      sx={{
        maxWidth: 280,
        borderRadius: 4,
        overflow: "hidden",
        background: "linear-gradient(180deg, #0f172a, #020617)",
        color: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* Poster */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="320"
          image={movie.poster_path}
          alt={movie.title}
        />

        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(2,6,23,1), rgba(2,6,23,0))",
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ mt: -4 }}>
        <Typography variant="h6" fontWeight="bold">
          {movie.title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>
          {movie.releaseDate} • {movie.genre} • {movie.duration}
        </Typography>

        {/* Bottom Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Button */}
          <Button
            variant="contained"
            sx={{
              background: "#f43f5e",
              borderRadius: "999px",
              textTransform: "none",
              px: 2,
              "&:hover": { background: "#e11d48" },
            }}
          >
            Buy Ticket
          </Button>

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon sx={{ color: "#f43f5e", fontSize: 18 }} />
            <Typography variant="body2">{movie.rating}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}