import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useState, useEffect, useContext, memo, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import notFoundMovieBg from "../assests/Movie/notFoundMovieBg.avif";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { GoChevronLeft } from "react-icons/go";

const SelectSeats = ({ setRemountKey, remountKey }) => {
  const { user,logout } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocking] = useState(true);

  //contains selected movie + showtime
  const { state } = useLocation();
  const { showtime, movie } = state || {};

  //const [seats, setSeats] = useState([]);
  const [groupedSeats, setGroupedSeats] = useState({}); //key:row,value:seatsObjs in that row
  const [seatsExist, setSeatsExist] = useState(true);

  //group seats by rows : {{A:[]},{B:[]}...}
  const groupSeats = useCallback((seatsArr) => {
    const grouped = {};
    seatsArr.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    setGroupedSeats(grouped);
  });

  //check if there is available seats IOW not all are RESERVED status
  const checkSeats = useCallback((seats) => {
    const atLeastOne = seats.some((seat) => {
      return seat.status === "AVAILABLE";
    });

    if (atLeastOne) return true;
    return false;
  });

  //fetch seats related to this screen of this showtime  and their status
  useEffect(() => {
    const fetchSeats = async () => {
      setIsBlocking(true);
      setIsLoading(true);

      try {
        const res = await api.get(
          `/api/bookings/getSeatsStatus/${showtime._id}/seats`,
        );
        //  console.log(res.data);
        // setSeats(res.data);

        groupSeats(res.data);

        //if there is no exist seats handle it
        if (checkSeats(res.data) === true) setSeatsExist(true);
        else setSeatsExist(false);

        setIsLoading(false);
        setIsBlocking(false);
      } catch (err) {
        // api network error connection
        if (err.code === "ERR_NETWORK")
          toast.error("No network connection", {
            style: {
              width: "500px",
            },
            onOpen: () => {
              setIsBlocking(true);
              setIsLoading(true);
            },
            onClose:()=>{logout();}
          });
        //invalid showtimeID error (impossiple since there is a previous chain of api calls with this id )| api error
        else if (err.response.status === 404 || err.response.status === 500) {
          toast.error(err.response.data.message, {
            style: {
              width: "500px",
            },
            onOpen: () => {
              setIsBlocking(true);
            },
            onClose: () => {
              setIsBlocking(false);
              setIsLoading(false);
              logout();
            },
          });
        }
      }
    };

    fetchSeats();
  }, []); //on each refresh it will be triggered since the component will be remounted and this is the mean of [] dependency array

  const [selectedSeats, setSelectedSeats] = useState([]); //[seat1Obj,seat2Obj...]

  const toggleSeat = useCallback((seat) => {
    if (seat.status === "RESERVED") return;

    const alreadySelected = selectedSeats.some(
      (selected) => selected._id === seat._id,
    );

    if (alreadySelected) {
      setSelectedSeats((prev) =>
        prev.filter((selected) => selected._id !== seat._id),
      );
    } else {
      setSelectedSeats((prev) => [...prev, seat]);
    }
  });

  const flattenSeatsIds = useCallback((seats) => {
    //return only seat ids
    const flatten = seats.flatMap((s) => {
      return s._id;
    }); //[seat1Id,seat2Id...]
    return flatten;
  });

  //for confirm booking btn
  const [isPressed, setIsPressed] = useState(false);

  const confirmBooking = useCallback(async () => {
    setIsPressed(true);
    try {
      const seats = flattenSeatsIds(selectedSeats);
      const data = { user: user._id, showTime: showtime._id, seats: seats };

      const res = await api.post("/api/bookings/create", data);

      setRemountKey(remountKey + 1); //or we can directlly call again fetchSeats api
      toast.success(res.data.message, {
        style: {
          width: "500px",
        },
        onOpen: () => {
          setIsPressed(true);
        },
        onClose: () => {
          setIsPressed(false);
        },
      });
    } catch (err) {
      // api network error connection
      if (err.code === "ERR_NETWORK")
        toast.error("No network connection", {
          style: {
            width: "500px",
          },
          onOpen: () => {
            setIsBlocking(true);
            setIsLoading(true);
          },
          onClose: () => {
             logout();
          },
        });
      //api error
      else if (err.response.status === 500) {
        toast.error(err.response.data.message, {
          style: {
            width: "500px",
          },
          onOpen: () => {
            setIsBlocking(true);
          },
          onClose: () => {
            setIsBlocking(false);
            setIsLoading(false);
            logout();
          },
        });
      }
    }
  });

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  
  const seatVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const itemVariants ={
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const MotionBox = motion(Box);

  const navigate=useNavigate();

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
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        minHeight: "100vh",
        backgroundImage: movie?.backdrop_path
          ? `url(${process.env.REACT_APP_BASE_MOVIES_IMGS_URL}${movie.backdrop_path})`
          : `url(${notFoundMovieBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        p: 4,
        color: "#fff",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(3px)",
          zIndex: 0,
        }}
      />

      {/* Content */}

      <Box sx={{ position: "relative", zIndex: 1 }}>

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
                  onClick={() => navigate(`/show-times/${movie._id}`)}
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

              
        <motion.div variants={itemVariants}>
          <Typography variant="h4" gutterBottom>
            {movie?.title}
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography sx={{ mb: 3 }}>
            {new Date(showtime?.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            {" - "}
            {new Date(showtime?.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </motion.div>

        {/* 🎬 SCREEN */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              width: "100%",
              height: 40,
              background: "#ddd",
              borderRadius: "50%",
              textAlign: "center",
              lineHeight: "40px",
              color: "#000",
              mb: 4,
            }}
          >
            SCREEN
          </Box>
        </motion.div>
        <motion.div variants={itemVariants}>
          {!seatsExist && (
            <Typography sx={{ mb: 3 }}>
              Sorry there is no available seats currentlly !
            </Typography>
          )}
        </motion.div>
        {/* 🪑 SEATS BY ROW */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.keys(groupedSeats).map(
            (
              rowKey, //go among them by row
            ) => (
              <Box
                key={rowKey}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                {/* Row Label */}
                <Box sx={{ width: 20, color: "white" }}>{rowKey}</Box>

                {/* Seats in this row */}
                {groupedSeats[rowKey].map((seat) => {
                  //go among each seat in that row
                  const isSelected = selectedSeats.some(
                    (selected) => selected._id === seat._id,
                  );

                  return (
                    <MotionBox
                      variants={seatVariants}
                      key={seat._id}
                      onClick={() => toggleSeat(seat)}
                      sx={{
                        width: 35,
                        height: 35,
                        borderRadius: "6px",
                        cursor:
                          seat.status === "RESERVED"
                            ? "not-allowed"
                            : "pointer",
                        backgroundColor:
                          seat.status === "RESERVED"
                            ? "#e50914"
                            : isSelected
                              ? "#ffdd57"
                              : "#2ecc71",
                        border: isSelected
                          ? "2px solid #fff"
                          : "2px solid transparent",
                        transition: "0.2s",
                      }}
                    />
                  );
                })}
              </Box>
            ),
          )}
        </Box>

        {/* 🎟️ Selected Info */}
        <motion.div variants={itemVariants}>
          <Typography sx={{ mt: 3 }}>
            Selected Seats:{" "}
            {selectedSeats.length > 0
              ? selectedSeats
                  .map((seat) => `${seat.row}${seat.number}`)
                  .join(", ")
              : "None"}
          </Typography>
        </motion.div>

        {/* 🎟️ Button */}
        <MotionBox variants={buttonVariants}>
          <Button
            sx={{
              background: "var(--red)",
              borderRadius: "999px",
              textTransform: "none",
              px: 2,
              py: 0.25,
              minHeight: 32,
              fontSize: "0.8rem",
              "&:hover": { background: "#e11d48" },
              mt: 3.5,
            }}
            disabled={selectedSeats.length === 0 || isBlocked || isLoading}
            onClick={(e) => {
              e.preventDefault();
              confirmBooking();
            }}
          >
            {isPressed ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </MotionBox>
      </Box>
    </MotionBox>
  );
};

export default SelectSeats;
