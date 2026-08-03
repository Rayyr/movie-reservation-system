import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import movieAlt from "../../assests/Movie/movieAlt.png";

const ShowTimeCard = ({ st, movie }) => {

  // Animations
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
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
         src={movie.poster_path ? `${process.env.REACT_APP_BASE_MOVIES_IMGS_URL}${movie.poster_path}` : movieAlt}
          
          alt="poster"
          sx={{
           width: "100%",      // Spans full container width
            maxWidth: 300,
            objectFit: "cover",
            
          }}
        />

        {/* 📄 Content */}
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h6">
            {movie?.title || "Movie"}
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {st.screen?.theater?.name}
          </Typography>

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

          <Typography sx={{ mt: 1 }}>
            💰 {st.price} EGP
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 2,
              background: "var(--red)",
              "&:hover": {
                background: "#e11d48",
              },
              textTransform: "none",
            }}
            onClick={() => console.log("Selected:", st)}
          >
            Book Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShowTimeCard;