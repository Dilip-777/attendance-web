import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Delete from "@mui/icons-material/Delete";
import {
  Safety,
  SafetyItem,
  StoreItem,
  Stores,
  UnsafeActs,
} from "@prisma/client";
import _ from "lodash";
import { useSession } from "next-auth/react";
import Edit from "@mui/icons-material/Edit";

interface Headcell {
  id: string;
  label: string;
  numeric: boolean;
  included: boolean;
}

const createHeadCells = (
  id: string,
  label: string,
  numeric: boolean,
  included: boolean
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
  };
};

const headcells2 = [
  createHeadCells("unsafeacts", "Unsafe Acts and Violation", true, false),
  createHeadCells("division", "Division", true, false),
  createHeadCells("frequency", "Frequency", true, false),
  createHeadCells("penalty", "Penalty Amount", true, false),
  createHeadCells("remarks", "Remarks", true, false),
];

interface Props {
  row: Stores | Safety;
  items: StoreItem[] | SafetyItem[];
  items2?: UnsafeActs[];
  headcells: Headcell[];
  headcells1: Headcell[];
  handleDelete: (id: string) => void;
  handleEdit?: () => void;
}

export default function Row(props: Props) {
  const {
    row,
    items,
    headcells,
    headcells1,
    handleDelete,
    items2,
    handleEdit,
  } = props;
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {headcells.map((headcell) => (
          <TableCell align="left">
            {_.get(row, headcell.id, "-") || "-"}
          </TableCell>
        ))}
        {!(
          session?.user?.role === "PlantCommercial" ||
          session?.user?.role === "HoCommercialAuditor"
        ) && (
          <TableCell>
            {session?.user?.role !== "Corporate" && (
              <IconButton
                onClick={() => handleEdit && handleEdit()}
                sx={{ mr: 2 }}
              >
                <Edit />
              </IconButton>
            )}
            <IconButton onClick={() => handleDelete(row.id)}>
              <Delete />
            </IconButton>
          </TableCell>
        )}

        {/* <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="left">{row.calories}</TableCell>
        <TableCell align="left">{row.fat}</TableCell>
        <TableCell align="left">{row.carbs}</TableCell>
        <TableCell align="left">{row.protein}</TableCell> */}
      </TableRow>
      {items.length > 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h5" gutterBottom component="div">
                  Chargeable Items: {items.length}
                </Typography>
                <Table aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {headcells1.map((headcell) => (
                        <TableCell sx={{ fontWeight: "600" }} align="center">
                          {headcell.label}
                        </TableCell>
                      ))}
                      {/* <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="left">Amount</TableCell>
                    <TableCell align="left">Total price ($)</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        {headcells1.map((headcell) => (
                          <TableCell align="center">
                            {_.get(item, headcell.id, "-") || "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      {items2 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 15, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h5" gutterBottom component="div">
                  Unsafe Acts and Violation: {items2.length}
                </Typography>
                <Table aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {headcells2.map((headcell) => (
                        <TableCell sx={{ fontWeight: "600" }} align="center">
                          {headcell.label}
                        </TableCell>
                      ))}
                      {/* <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="left">Amount</TableCell>
                    <TableCell align="left">Total price ($)</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items2.map((item) => (
                      <TableRow key={item.id}>
                        {headcells2.map((headcell) => (
                          <TableCell align="center" sx={{ maxWidth: "10rem" }}>
                            {_.get(item, headcell.id, "-") || "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
