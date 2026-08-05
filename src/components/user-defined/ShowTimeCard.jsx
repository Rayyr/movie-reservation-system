import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ShowTimeCard = ({ st, movie }) => {
  const navigate = useNavigate();
 
  const handleBooking = useCallback(() => {
    //select seat
    navigate("/select-seats", { state: { movie: movie, showtime: st } });
  });

  // Animations
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
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
        {/* 📄 Content */}
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {st.screen.theater.name}
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
            💰 {st.price}
            <Typography
              component="span"
              sx={{ fontSize: ".85rem", opacity: 0.9 }}
            >
              {" "}
              $/seat
            </Typography>
          </Typography>

          <Button
            variant="contained"
            sx={{
              background: "var(--red)",
              borderRadius: "999px",
              textTransform: "none",
              px: 2.5,
              py: 0.4,
              minHeight: 32,
              fontSize: ".95rem",
              "&:hover": { background: "#e11d48" },
              mt: 2.5,
            }}
            onClick={(e) => {
              e.preventDefault();
              handleBooking();
            }}
          >
            Book Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShowTimeCard;
