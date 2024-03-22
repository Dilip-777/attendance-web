import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  Box,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

export interface HeadCell {
  id: string;
  label: string;
  numeric?: boolean;
  align?: "left" | "right" | "center";
  colspan?: number;
}

interface EnhancedTableProps {
  numSelected: number;
  nocheckbox?: boolean;

  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  headCells: HeadCell[];
  align?: "left" | "right" | "center";
  orderby?: string;
  setOrderby?: React.Dispatch<React.SetStateAction<string>>;
}

export default function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    numSelected,
    rowCount,
    headCells,
    nocheckbox,
    align,
    orderby,
    setOrderby,
  } = props;

  return (
    <TableHead sx={{ bgcolor: "#eeeeee" }}>
      <TableRow sx={{ bgcolor: "#eeeeee" }}>
        <TableCell sx={{ bgcolor: "#eeeeee" }} padding="checkbox">
          {onSelectAllClick && !nocheckbox && (
            <Checkbox
              color="secondary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          )}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || align || "left"}
            // padding={"normal"}
            colSpan={headCell.colspan || 1}
            sx={{ fontWeight: "600", minWidth: "5rem", bgcolor: "#eeeeee" }}
          >
            {setOrderby ? (
              <TableSortLabel
                active={orderby === headCell.id}
                direction={orderby === headCell.id ? "asc" : "desc"}
                onClick={() => setOrderby && setOrderby(headCell.id)}
              >
                {headCell.label}
                {orderby === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    sorted ascending
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
            {/* {headCell.label} */}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
