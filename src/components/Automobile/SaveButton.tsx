import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";

export default function SaveButton({
  contractorId,
  month,
  cost,
}: {
  contractorId: string;
  month: string;
  cost: {
    monthHiringCost: number;
    monthHsdCost: number;
    monthHsdConsumed: number;
    monthHsdRate: number;
    monthCost: number;
  };
}) {
  const [open, setOpen] = React.useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleSubmit = async () => {
    try {
      await axios.post("/api/finalCalculations", {
        contractorId: contractorId,
        month: month,
        hiringCharged: parseFloat(cost.monthHiringCost.toFixed(2)),
        hsdCost: parseFloat(cost.monthHsdCost.toFixed(2)),
        hsdConsumed: parseFloat(cost.monthHsdConsumed.toFixed(2)),
        hsdRateCharged: parseFloat(cost.monthHsdRate.toFixed(2)),
        totalCost: parseFloat(cost.monthCost.toFixed(2)),
      });
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleSubmit()}
      >
        Save
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Changes Successfully Saved!
        </Alert>
      </Snackbar>
    </>
  );
}
