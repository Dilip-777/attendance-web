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
} from "@mui/material";
import {
  Contractor,
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

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface Props {
  open: boolean;
  handleClose: () => void;
  rows: any[];
  total: number;
  department: Department | undefined;
  contractor: Contractor;
  workorder: Workorder | undefined;
  date: string;
  store: Stores | null;
  safety: Safety | null;
  payouttracker: payoutTracker;
  prevMonthAmount: number;
  prevprevMonthAmount: number;
  prevYearAmount: number;
  designations: Designations[];
  month: string;
}

export default function PrintModal({
  open,
  handleClose,
  rows,
  total,
  department,
  contractor,
  workorder,
  date,
  store,
  safety,
  payouttracker,
  prevMonthAmount,
  prevprevMonthAmount,
  prevYearAmount,
  designations,
  month,
}: Props) {
  const router = useRouter();
  const handlePrint = async () => {
    print(
      rows,
      total,
      department,
      contractor,
      workorder as Workorder,
      month,
      store,
      safety,
      payouttracker,
      prevMonthAmount,
      prevprevMonthAmount,
      prevYearAmount,
      designations
    );
  };
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
            <Typography variant="h3">Print Final Sheet</Typography>
            <Stack spacing={2} direction="column" width="100%">
              <Button
                variant="contained"
                fullWidth
                onClick={() => handlePrint()}
              >
                Print Doc
              </Button>
              <PrintExcel
                designations={designations}
                department={department}
                total={total}
                rows={rows}
                safety={safety}
                // details={details}
                store={store}
                contractor={contractor}
                date={date}
                workorder={workorder}
                month={month}
                payouttracker={payouttracker}
                prevMonthAmount={prevMonthAmount}
                prevprevMonthAmount={prevprevMonthAmount}
                prevYearAmount={prevYearAmount}
              />
            </Stack>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
}
