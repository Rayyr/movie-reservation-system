import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {Modal,
  Backdrop,Box,Typography} from '@mui/material';
import { GoStar } from "react-icons/go";
import StarRating  from "../built-in/StarRating";
import{toast} from 'react-toastify';
import api from "../../services/api";
import { useState } from "react";

function RateModal({open,handleClose,movieID}){

    const fetchMovieRate=async()=>{

        try{
//console.log(movieID);
            const res=await api.get(`api/movies/getMovieRate/${movieID}`);

        }catch (err) {
              // api network error connection
              if (err.code === "ERR_NETWORK")
                toast.error("No network connection", {
                  style: {
                    width: "500px",
                  },
                  onOpen: () => {
                    /* setIsBlocking(true); */
                  },
                  onClose: () => {
                    /* setIsBlocking(false); */
                 // navigate("/login",{ replace: true });
                  },
                });
              //user exists error | api error
              else if (err.response.status === 400 || err.response.status === 500) {
                toast.error(err.response.data.message, {
                  style: {
                    width: "500px",
                  },
                  onOpen: () => {
                 /*    setIsBlocking(true); */
                  },
                  onClose: () => {
                  /*   setIsBlocking(false); */
        //  navigate("/login",{ replace: true });
                  },
                });
              }
            }
    };

      const [rating, setRating] = useState(4.3);

    return (

         <Modal
        open={open}
        onClose={() =>handleClose()}
       
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "#020617",
            color: "#fff",

            borderRadius: 3,
            boxShadow: 24,
            p: 3,
          }}
        >
          <IconButton
            aria-label="Close movie overview"
            onClick={() => handleClose()}
           
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1,
              color: "#fff",
              backgroundColor: "rgba(2, 6, 23, 0.55)",
              "&:hover": { backgroundColor: "rgba(2, 6, 23, 0.8)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* content */}
                <StarRating value={rating} onChange={setRating} maxStars={5} />
 <p>({rating})</p>
        </Box>
      </Modal>

    );
};



export default RateModal;