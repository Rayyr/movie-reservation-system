import { useLocation } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import notFoundMovieBg from "../assests/Movie/notFoundMovieBg.avif";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const SelectSeat = ({setRemountKey,remountKey}) => {

  const {user}=useContext(AuthContext);

  
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocking] = useState(true);

  //contains selected movie + showtime
  const { state } = useLocation();
  const { showtime, movie } = state || {};

  //const [seats, setSeats] = useState([]);
  const [groupedSeats, setGroupedSeats] = useState({});//key:row,value:seatsObjs in that row
  const [seatsExist, setSeatsExist] = useState(true);

  //group seats by rows : {{A:[]},{B:[]}...}
  const groupSeats = (seatsArr) => {
    const grouped = {};
    seatsArr.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    setGroupedSeats(grouped);
  };

  //check if there is available seats IOW not all are RESERVED status
  const checkSeats = (seats) => {
    const atLeastOne = seats.some((seat) => {
      return seat.status === "AVAILABLE";
    });

    if (atLeastOne) return true;
    return false;
  };

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
            onClose: () => {
            setIsBlocking(false); //keep him at this page untill network is restored ! so i will not make setIsloading(false)
            },
          });
        //invalid showtimeID error | api error
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
            },
          });
        }
      }
    };

    fetchSeats();
  }, []); //on each refresh it will be triggered since the component will be remounted and this is the mean of [] dependency array

  const [selectedSeats, setSelectedSeats] = useState([]);//[seat1Obj,seat2Obj...]

  const toggleSeat = (seat) => {
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
  };

  const flattenSeatsIds=(seats)=>{
    //return only seat ids
    const flatten=seats.flatMap((s)=>{return s._id;});//[seat1Id,seat2Id...]
    return flatten;
  };

  //for confirm booking btn
  const [isPressed,setIsPressed]=useState(false);

  const confirmBooking = async() => {
    setIsPressed(true);
    try {
        const seats=flattenSeatsIds(selectedSeats);
        const data={user:user._id,showTime:showtime._id,seats:seats};
   
       const res=await api.post("/api/bookings/create",data);

        setRemountKey(remountKey+1);//or we can directlly call again fetchSeats api 
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
            setIsBlocking(false); //keep him at this page untill network is restored ! so i will not make setIsloading(false)
          },
        });
      //api error
      else if (  err.response.status === 500) {
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
          },
        });
      }
    } 
  };

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
          background: "rgba(0,0,0,0.5)",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h4" gutterBottom>
          {movie?.title}
        </Typography>

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

        {/* 🎬 SCREEN */}
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

        {!seatsExist && (
          <Typography sx={{ mb: 3 }}>
            Sorry there is no available seats currentlly !
          </Typography>
        )}

        {/* 🪑 SEATS BY ROW */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.keys(groupedSeats).map((rowKey) => (//go among them by row
            <Box
              key={rowKey}
              sx={{ display: "flex", gap: 1, alignItems: "center" }}
            >
              {/* Row Label */}
              <Box sx={{ width: 20, color: "white" }}>{rowKey}</Box>

              {/* Seats in this row */}
              {groupedSeats[rowKey].map((seat) => {//go among each seat in that row
                const isSelected = selectedSeats.some(
                  (selected) => selected._id === seat._id,
                );

                return (
                  <Box
                    key={seat._id}
                    onClick={() => toggleSeat(seat)}
                    sx={{
                      width: 35,
                      height: 35,
                      borderRadius: "6px",
                      cursor:
                        seat.status === "RESERVED" ? "not-allowed" : "pointer",
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
          ))}
        </Box>

        {/* 🎟️ Selected Info */}
        <Typography sx={{ mt: 3 }}>
          Selected Seats:{" "}
          {selectedSeats.length > 0
            ? selectedSeats
                .map((seat) => `${seat.row}${seat.number}`)
                .join(", ")
            : "None"}
        </Typography>

        <Button
          sx={{
            mt: 3,
            background: "var(--red)",
            textTransform: "none",
            color: "#fff",
            paddingX: 3,
            paddingY: 1.5,
          }}
          disabled={selectedSeats.length === 0 || isBlocked || isLoading}
          onClick={() => confirmBooking()}
        >
          {isPressed ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default SelectSeat;
