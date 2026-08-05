import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {Modal,
  Backdrop,Box,Typography} from '@mui/material';
import { GoStar } from "react-icons/go";
import { StarRating } from "../built-in/StarRating";

function RateModal({open,handleClose}){

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
           <StarRating 
        defaultValue={3}
        onRate={(rating) => console.log(`Rated: ${rating}`)}
      />
        </Box>
      </Modal>

    );
};



export default RateModal;