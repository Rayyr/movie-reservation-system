import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {Modal,
  Backdrop,Box,Typography} from '@mui/material';
import { GoStar } from "react-icons/go";

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
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            <GoStar />
            <GoStar />
            <GoStar />
            <GoStar />
            <GoStar />
          </Typography>
        </Box>
      </Modal>

    );
};



export default RateModal;