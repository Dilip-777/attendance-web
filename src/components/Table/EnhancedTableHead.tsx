import { TableHead, TableRow, TableCell, Checkbox } from "@mui/material";

interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
  included: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  nocheckbox?: boolean;

  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  headCells: HeadCell[];
  align?: "left" | "right" | "center";
}

export default function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    numSelected,
    rowCount,
    headCells,
    nocheckbox,
    align,
  } = props;

  return (
    <TableHead sx={{ bgcolor: "#eeeeee" }}>
      <TableRow sx={{ bgcolor: "#eeeeee" }}>
        <TableCell sx={{ bgcolor: "#eeeeee" }} padding="checkbox">
          {onSelectAllClick && !nocheckbox && (
            <Checkbox
              color="primary"
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
            align={align || "left"}
            padding={"normal"}
            sx={{ fontWeight: "600", minWidth: "8rem", bgcolor: "#eeeeee" }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
