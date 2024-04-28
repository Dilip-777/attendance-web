import AutoComplete from "@/ui-component/Autocomplete";
import FormInput from "@/ui-component/FormInput";
import FormSelect from "@/ui-component/FormSelect";
import MonthSelect from "@/ui-component/MonthSelect";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Slide,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Contractor, Deductions } from "@prisma/client";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  overflowY: "auto",
  borderRadius: "15px",
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function AddDeductions({
  handleClose,
  deduction,
  contractors,
  open,
}: {
  handleClose: () => void;
  deduction: Deductions | undefined;
  contractors: Contractor[];
  open: boolean;
}) {
  const [contractorId, setContractorId] = useState<string>("");
  const [month, setMonth] = useState<string>(dayjs().format("MM/YYYY"));
  const [gsthold, setGsthold] = useState<number>(0);
  const [gstrelease, setGstrelease] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [anyother, setAnyother] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/deductions", {
        contractorId: contractorId,
        month: month,
        gsthold: gsthold,
        gstrelease: gstrelease,
        advance: advance,
        anyother: anyother,
        remarks: remarks,
      });
      handleClose();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deduction) {
      setContractorId(deduction.contractorId);
      setMonth(deduction.month);
      setGsthold(deduction.gsthold);
      setGstrelease(deduction.gstrelease);
      setAdvance(deduction.advance);
      setAnyother(deduction.anyother);
      setRemarks(deduction?.remarks || "");
    }
  }, [deduction]);

  return (
    <div>
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
          direction={"left"}
          timeout={500}
          in={open}
          mountOnEnter
          unmountOnExit
        >
          <Box
            p={{ xs: 0, sm: 2 }}
            width={{ xs: "100%", sm: 400 }}
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
                Deductions
              </Typography>
              <Divider />
              <FormControl fullWidth sx={{ mt: 2 }} color="secondary">
                <Stack width="100%" spacing={4}>
                  <AutoComplete
                    options={contractors.map((contractor) => ({
                      label: contractor.contractorname,
                      value: contractor.contractorId,
                    }))}
                    // ={(e) => setContractorId(e as string)}
                    value={contractorId}
                    setValue={(e) => setContractorId(e as string)}
                    label="Contractor"
                  />
                  <MonthSelect
                    value={dayjs(month, "MM/YYYY")}
                    onChange={(value: Dayjs | null) =>
                      setMonth(value?.format("MM/YYYY") || "")
                    }
                  />
                  <FormInput
                    label="GST Hold"
                    fullWidth
                    value={gsthold}
                    onChange={(e) => setGsthold(Number(e.target.value))}
                  />

                  <FormInput
                    label="GST Release"
                    fullWidth
                    value={gstrelease}
                    onChange={(e) => setGstrelease(Number(e.target.value))}
                  />
                  <FormInput
                    label="Advance"
                    fullWidth
                    value={advance}
                    onChange={(e) => setAdvance(Number(e.target.value))}
                  />
                  <FormInput
                    label="Any Other"
                    fullWidth
                    value={anyother}
                    onChange={(e) => setAnyother(Number(e.target.value))}
                  />
                  <FormInput
                    label="Remarks"
                    fullWidth
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Stack>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, float: "right" }}
                  disabled={loading}
                  onClick={() => handleSubmit()}
                  color="secondary"
                >
                  Submit
                  {loading && (
                    <CircularProgress
                      size={15}
                      sx={{ ml: 1, color: "#364152" }}
                    />
                  )}
                </Button>
              </FormControl>
            </Stack>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}
