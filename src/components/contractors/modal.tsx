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
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import { Department } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

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
  options: Department[];
  contractorId: any;
}

export default function ContractorModal({
  open,
  handleClose,
  options,
  contractorId,
}: Props) {
  const router = useRouter();
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");
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
              <Autocomplete
                onChange={(event: any, newValue: string | null) => {
                  if (
                    !selectedDepartments.find((d) => d.department === newValue)
                  ) {
                    if (newValue === "All Departments") {
                      setSelectedDepartments([
                        {
                          id: "0",
                          department: "All Departments",
                        } as Department,
                      ]);
                    } else {
                      const d = options.find((d) => d.department === newValue);
                      console.log(d, options);

                      if (d) {
                        setSelectedDepartments([...selectedDepartments, d]);
                      }
                    }
                  }
                  setInputValue("");
                }}
                value={inputValue}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={[
                  "All Departments",
                  ...options.map((d: any) => d.department),
                ]}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select a Department" />
                )}
                clearIcon={null}
                disabled={!!selectedDepartments.find((d) => d.id === "0")}
              />
              <Stack
                direction="row"
                spacing={2}
                mt={2}
                rowGap={2}
                flexWrap="wrap"
              >
                {selectedDepartments.map((d) => (
                  <Chip
                    key={d.department}
                    label={d.department}
                    onDelete={() =>
                      setSelectedDepartments(
                        selectedDepartments.filter(
                          (department) => department.department !== d.department
                        )
                      )
                    }
                  />
                ))}
              </Stack>
              {/* <Select placeholder="Select the Department" value={value} onChange={(e) => setValue(e.target.value)}>
                {options?.map((option) => <MenuItem value={option.label}>{option.label}</MenuItem>)}
              </Select> */}
            </FormControl>
            <Button
              variant="contained"
              color="secondary"
              disabled={selectedDepartments.length === 0}
              onClick={() => {
                if (selectedDepartments.find((d) => d.id === "0")) {
                  router.push(
                    `/plantcommercial?department=${options.map(
                      (d) => d.department
                    )}&contractorid=${contractorId}`
                  );
                } else {
                  router.push(
                    `/plantcommercial?department=${selectedDepartments.map(
                      (d) => d.department
                    )}&contractorid=${contractorId}`
                  );
                }
              }}
            >
              View Attendance
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
}
