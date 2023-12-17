import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Stack,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Typography,
  ButtonGroup,
  TextField,
  Grid,
} from "@mui/material";
import {
  Contractor,
  Deductions,
  Department,
  Designations,
  Safety,
  Stores,
  Workorder,
  payoutTracker,
} from "@prisma/client";
import Close from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { print } from "@/components/PrintFinalSheet";
import PrintExcel from "./Printexceel";
import { useEffect, useState } from "react";
import axios from "axios";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: 350,
    sm: 400,
    md: 500,
    lg: 600,
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface d extends Department {
  designations: Designations[];
}

interface Props {
  open: boolean;
  handleClose: () => void;
  contractor: Contractor;
  date: string;
}

export default function PrintModal({
  open,
  handleClose,
  contractor,
  date,
}: Props) {
  const [deducations, setDeducations] = useState<Deductions | undefined>(
    undefined
  );
  const [gsthold, setGsthold] = useState<number>(0);
  const [gstrelease, setGstrelease] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [anyother, setAnyother] = useState<number>(0);

  const fetchDeducations = async () => {
    // try {
    //   const res = await axios.get(
    //     `/api/deductions?contractorId=${contractor.id}&date=${date}`
    //   );
    //   const data = await res.data;
    //   setDeducations(data);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/deductions", {
        contractorId: contractor.contractorId,
        month: date,
        gsthold: gsthold,
        gstrelease: gstrelease,
        advance: advance,
        anyother: anyother,
      });
      const data = await res.data;
      setDeducations(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDeducations();
  }, [contractor, date]);

  useEffect(() => {
    if (deducations) {
      setGsthold(deducations.gsthold);
      setGstrelease(deducations.gstrelease);
      setAdvance(deducations.advance);
      setAnyother(deducations.anyother);
    }
  }, [deducations]);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <IconButton
            sx={{ position: "absolute", right: 2, top: 2 }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
          <Stack spacing={3}>
            <Typography variant="h3">Deductions</Typography>
            <FormControl fullWidth>
              <Grid spacing={2} container>
                <Grid item xs={12} md={6}>
                  <FormLabel>GST Hold</FormLabel>
                  <TextField
                    value={gsthold}
                    onChange={(e) => setGsthold(Number(e.target.value))}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>GST Release</FormLabel>
                  <TextField
                    value={gstrelease}
                    onChange={(e) => setGstrelease(Number(e.target.value))}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>Advance</FormLabel>
                  <TextField
                    value={advance}
                    onChange={(e) => setAdvance(Number(e.target.value))}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>Any Other</FormLabel>
                  <TextField
                    value={anyother}
                    onChange={(e) => setAnyother(Number(e.target.value))}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={() => handleSubmit()}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </FormControl>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
}
