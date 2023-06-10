import NavigateBefore from "@mui/icons-material/NavigateBefore";
// import {
//   Modal,
//   Backdrop,
//   Slide,
//   Stack,
//   Typography,
//   IconButton,
//   Divider,
//   Box,
//   useMediaQuery,
// } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Backdrop from "@mui/material/Backdrop";
import { Comment, Upload } from "@prisma/client";

import Documents from "./Document";
import Comments from "./Comment";

const style = {
  position: "absolute",
  overflowY: "auto",
  borderRadius: "15px",
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function CustomModal({
  open,
  open1,
  handleClose,
  selected1,
}: {
  open: boolean;
  open1: boolean;
  handleClose: () => void;
  selected1: Upload[] | Comment[] | undefined;
}) {
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open || open1}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{ display: "flex", justifyContent: " flex-end" }}
    >
      <Slide
        direction={matches ? "left" : "up"}
        timeout={500}
        in={open || open1}
        mountOnEnter
        unmountOnExit
      >
        <Box
          p={{ xs: 0, sm: 2 }}
          width={{ xs: "100%", sm: 400, md: 500 }}
          height={{ xs: "70%", sm: "100%" }}
          top={{ xs: "30%", sm: "0" }}
          sx={style}
        >
          <Stack sx={{ overflowY: "auto" }} p={3}>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
              <IconButton
                onClick={handleClose}
                sx={{
                  // zIndex: 2,
                  padding: "5px",

                  marginRight: "1rem",
                  background: "white",
                  ":hover": { background: "white" },
                }}
              >
                <NavigateBefore fontSize="large" />
              </IconButton>
              {open ? "Documents" : "Comments"}
            </Typography>
            <Divider />
            {selected1 && selected1?.length > 0 ? (
              open ? (
                <Documents documents={selected1 as Upload[]} />
              ) : (
                <Comments comments={selected1 as Comment[]} />
              )
            ) : (
              <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
                {open ? "No Documents" : "No Comments"}
              </Typography>
            )}
          </Stack>
        </Box>
      </Slide>
    </Modal>
  );
}
