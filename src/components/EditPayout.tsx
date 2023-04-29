import NavigateBefore from "@mui/icons-material/NavigateBefore";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { payoutTracker } from "@prisma/client";
import axios from "axios";
import * as Yup from "yup";
import { Formik } from "formik";
import FormInput from "./FormikComponents/FormInput";
import FormSelect from "./FormikComponents/FormSelect";
import { useState } from "react";

interface EditPayoutProps {
  row: payoutTracker | undefined;
  handleClose: () => void;
  open: boolean;
}

const style = {
  position: "absolute",
  overflowY: "auto",
  borderRadius: "15px",
  bgcolor: "background.paper",
  boxShadow: 24,
};

const validationSchema = Yup.object().shape({
  deduction: Yup.number().optional(),
  actualpaidoutmoney: Yup.number().optional(),
  balance: Yup.number().optional(),
});

export default function EditPayout({
  row,
  handleClose,
  open,
}: EditPayoutProps) {
  const [loading, setLoading] = useState(false);
  const initialValues = {
    deduction: row?.deduction || 0,
    actualpaidoutmoney: row?.actualpaidoutmoney || 0,
    balance: row?.balance || 0,
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{ display: "flex", justifyContent: " flex-end" }}
    >
      <Slide
        // direction={matches ? "left" : "up"}
        direction="left"
        timeout={500}
        in={open}
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
              Edit Details
            </Typography>
            <Divider />
            <Paper
              sx={{
                pt: "1rem",

                overflow: "hidden auto",
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": {
                  width: 9,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#bdbdbd",
                  borderRadius: 2,
                },
              }}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  setLoading(true);
                  await axios
                    .put("/api/payouttracker", {
                      id: row?.id,
                      ...values,
                    })
                    .then((res) => {
                      handleClose();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  setLoading(false);
                }}
              >
                {({ handleSubmit }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{ mt: 2, ml: 1 }}>
                      <FormInput
                        name="deduction"
                        label="Deduction"
                        type="number"
                        placeHolder="Enter deduction"
                      />
                      <FormInput
                        name="actualpaidoutmoney"
                        label="Actual Paid Out Money"
                        type="number"
                        placeHolder="Enter the Paid Out Money"
                      />
                      <FormInput
                        name="balance"
                        label="Balance"
                        type="number"
                        placeHolder="Enter the Balance"
                      />
                      <Button
                        type="submit"
                        disabled={loading}
                        variant="contained"
                        sx={{ float: "right", mr: 10 }}
                      >
                        Submit
                        {loading && (
                          <CircularProgress
                            size={15}
                            sx={{ ml: 1, color: "#364152" }}
                          />
                        )}
                      </Button>
                    </Stack>
                  </form>
                )}
              </Formik>
            </Paper>
          </Stack>
        </Box>
      </Slide>
    </Modal>
  );
}
