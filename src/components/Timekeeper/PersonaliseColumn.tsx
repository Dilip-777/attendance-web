import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton, Stack } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  bgcolor: "background.paper",
  borderRadius: "5px",
  border: 0,
  boxShadow: 24,
  p: 4,
};

const IconStyle = {
  backgroundColor: "#616161",
  color: "#fff",
  borderRadius: "5px",
  padding: "5px",
  ":hover": {
    backgroundColor: "#616161",
  },
};

interface Column {
  id: string;
  label: string;
  selected: boolean;
  order: number;
  numeric: boolean;
  included: boolean;
}

interface Props {
  selectedColumns: Column[];
  availableColumns: Column[];
  open: boolean;
  handleClose: () => void;
  updateColumns: (prop: { selectedC: Column[]; available: Column[] }) => void;
  handleReset: () => void;
}

export default function PersonaliseColumns({
  selectedColumns,
  availableColumns,
  open,
  handleClose,
  updateColumns,
  handleReset,
}: Props) {
  const [selected, setSelected] = useState<Column[]>(selectedColumns);
  const [available, setAvailable] = useState<Column[]>(availableColumns);
  const [active, setActive] = useState<Column | null>(null);

  useEffect(() => {
    setSelected(selectedColumns);
    setAvailable(availableColumns);
  }, [selectedColumns, availableColumns, open]);

  const handleOrderChange = (direction: "up" | "down") => {
    if (!active || active.order === -1) return;
    const index = selected.findIndex((item) => item.label === active.label);
    if (index === -1) return console.log("not found");
    if (direction === "up") {
      if (index === 0) return;
      const newSelected = [...selected];

      const prev = newSelected[index - 1];
      newSelected[index - 1] = { ...active, order: index - 1 };
      if (prev) newSelected[index] = { ...prev, order: index };
      setSelected(newSelected);
      setActive({ ...active, order: index - 1 });
    } else {
      if (index === selected.length - 1) return;

      const newSelected = [...selected];
      const next = newSelected[index + 1];
      newSelected[index + 1] = { ...active, order: index + 1 };

      if (next) newSelected[index] = { ...next, order: index };
      setSelected(newSelected);
      setActive({ ...active, order: index + 1 });
    }
  };

  const handleChange = (direction: "left" | "right") => {
    if (!active) return;
    if (active.order === -1 && direction === "left") return;
    if (active.order !== -1 && direction === "right") return;
    if (direction === "right") {
      setAvailable((prev) =>
        prev.filter((item) => item.label !== active.label)
      );
      setSelected((prev) => [...prev, { ...active, order: selected.length }]);
      setActive({ ...active, order: selected.length });
    } else {
      setAvailable((prev) => [...prev, { ...active, order: -1 }]);
      const prev = selected
        .filter((item) => item.label !== active.label)
        .map((item, index) => ({ ...item, order: index }));
      setSelected(prev);
      setActive({ ...active, order: -1 });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <ColumnList
            columns={available}
            active={active}
            setActive={setActive}
            title="Available Columns"
          />
          <Stack
            sx={{
              width: "fit-content",
            }}
            spacing={1}
          >
            <IconButton sx={IconStyle} onClick={() => handleChange("right")}>
              <ChevronRight />
            </IconButton>
            <IconButton sx={IconStyle} onClick={() => handleChange("left")}>
              <ChevronLeft />
            </IconButton>
          </Stack>
          <ColumnList
            columns={selected}
            active={active}
            setActive={setActive}
            title="Selected Columns"
          />
          <Stack
            sx={{
              width: "fit-content",
            }}
            spacing={1}
          >
            <IconButton sx={IconStyle} onClick={() => handleOrderChange("up")}>
              <KeyboardArrowUp />
            </IconButton>
            <IconButton
              sx={IconStyle}
              onClick={() => handleOrderChange("down")}
            >
              <KeyboardArrowDown />
            </IconButton>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          mt={3}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleReset();
            }}
          >
            Reset
          </Button>
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setActive(null);
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                updateColumns({ selectedC: selected, available });
                setActive(null);
                handleClose();
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

const ColumnList = ({
  columns,
  active,
  setActive,
  title,
}: {
  columns: Column[];
  active: Column | null;
  setActive: (column: Column) => void;
  title: string;
}) => {
  return (
    <Box>
      <Typography variant="subtitle1">{title}</Typography>
      <Box
        sx={{
          border: "1px solid #616161",
          borderRadius: "5px",
          padding: "5px",
          margin: "5px 0",
          height: "250px",
          overflowY: "hidden",
          minWidth: "230px",
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            height: "100%",
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
          <Stack direction="column" spacing={0}>
            {columns.map((column) => (
              <Typography
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    column.label === active?.label ? "#616161" : "transparent",
                  color: column.label === active?.label ? "#fff" : "black",
                  padding: "5px 10px",
                  borderRadius: "3px",
                }}
                onClick={() => setActive(column)}
              >
                {column.label}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
