import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import React, { useState } from "react";
import axios from "axios";

export default function DeleteModal({
  openModal,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  snackbarMessage,
  deleteApi,
  ...props
}: {
  openModal: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  snackbarMessage?: string;
  deleteApi?: string;
  fetchData?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Dialog open={openModal} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="outlined" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              if (deleteApi) {
                try {
                  await axios.delete(deleteApi);
                  handleClick();
                  setError(false);
                  onClose();
                  if (props.fetchData) {
                    props.fetchData();
                  }
                } catch (error) {
                  setError(true);
                  handleClick();
                }
              } else if (onConfirm) {
                onConfirm();
                setError(false);
                handleClick();
              }
            }}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
      >
        <Alert
          onClose={handleClose}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error ? "Something Went Wrong" : snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
