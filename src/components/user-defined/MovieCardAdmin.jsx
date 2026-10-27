import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Trash2 } from "lucide-react";
import movieAlt from "../../assests/Movie/movieAlt.png";
import { useNavigate } from "react-router";

export default function MovieCardAdmin({
  movie,
  handleOpen,
  handleDelete,
  isDeleting = false,
}) {
 
    const navigate=useNavigate();

    const handleEdit=()=>{
        navigate(`/edit-movie/${movie._id}`,{state:movie});
    };

    return (
    <Card
      sx={{
        width: 320,
        maxWidth: "100%",
        height: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        background: "linear-gradient(180deg, #0f172a, #020617)",
        color: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        "&:hover .movie-overview": { opacity: 1, transform: "translateY(0)" },
      }}
    >
      {/* Poster */}
      <Box
        sx={{
          position: "relative",
          flex: "0 0 135px",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <CardMedia
          component="img"
          src={movie.poster_path ? `${process.env.REACT_APP_BASE_MOVIES_IMGS_URL}${movie.poster_path}` : movieAlt}
          alt={movie.title}
          sx={{
            display: "block",
            width: "100%",
            height: "100%",
            objectPosition: "top",
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
        ></Box>
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
          {new Date(movie.releaseDate).getFullYear()} • {movie.genre} •{" "}
          {movie.duration_min}m
        </Typography>

        {/* Bottom Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              Edit
            </Button>
            <IconButton
              aria-label={`Delete ${movie.title}`}
              title={`Delete ${movie.title}`}
              disabled={isDeleting}
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(movie);
              }}
              sx={{
                width: 34,
                height: 34,
                color: "#fb7185",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "rgba(244, 63, 94, 0.2)",
                },
                "&.Mui-disabled": { color: "rgba(251, 113, 133, 0.45)" },
              }}
            >
              <Trash2 size={17} />
            </IconButton>
          </Box>

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon sx={{ color: "var(--red)", fontSize: 18 }} />
            <Typography variant="body2">{movie.rating.toFixed(2)}</Typography>
          </Box>
        </Box>
      </CardContent>

      <Box
        className="movie-overview"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: "auto",
          left: 0,
          height: 135,
          inset: 0,
          zIndex: 2,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",

          // 🌟 GLASS EFFECT
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",

          opacity: 0,
          transform: "translateY(8px)",
          transition: "opacity 180ms ease, transform 180ms ease",

          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        <Typography
          variant="body2"
          sx={{
            color: "white",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 5,
            overflow: "hidden",
            fontWeight: 500,
          }}
        >
          Overview
        </Typography>
      </Box>
    </Card>
  );
}
