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
} from "@mui/material";
import { useRouter } from "next/router";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface Props {
  open: boolean;
  handleClose: () => void;
  options: { link: string; label: string }[];
  value: any;
  setValue: any;
  contractorId: any;
}

export default function ContractorModal({
  open,
  handleClose,
  options,
  value,
  setValue,
  contractorId,
}: Props) {
  const router = useRouter();
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
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>Select the Department</FormLabel>
              <Select
                placeholder="Select the Department"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                {options?.map((option) => (
                  <MenuItem value={option.label}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              disabled={Boolean(!value)}
              onClick={() =>
                router.push(
                  `plantcommercial?department=${value}&contractorid=${contractorId}`
                )
              }
            >
              View Attendance
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
}
