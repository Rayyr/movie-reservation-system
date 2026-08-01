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
    width: 320,
    maxWidth: "100%",
    height: 300,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 4,
    overflow: "hidden",
    background: "linear-gradient(180deg, #0f172a, #020617)",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  }}
    >
      {/* Poster */}
      <Box
        sx={{
          position: "relative",
          flex: "0 0 135px",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={movie.poster_path}
          alt={movie.title}
          sx={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
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
      <CardContent
        sx={{
          flex: 1,
          minHeight: 0,
          p: "12px 16px",
          "&:last-child": { pb: "12px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 0.75,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            fontSize: "1.05rem",
            lineHeight: 1.25,
          }}
        >
          {movie.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#94a3b8",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {new Date(movie.releaseDate).getFullYear()} • {movie.genre} • {movie.duration_min}m
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
              background: "var(--red)",
              borderRadius: "999px",
              textTransform: "none",
              px: 2,
              py: 0.25,
              minHeight: 32,
              fontSize: "0.8rem",
              "&:hover": { background: "#e11d48" },
            }}
          >
            Buy Ticket
          </Button>

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon sx={{ color: "var(--red)", fontSize: 18 }} />
            <Typography variant="body2">{movie.rating}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
