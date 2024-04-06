import {
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Table,
  TableContainerProps,
} from "@mui/material";
import EnhancedTableHead from "./EnhancedTableHead";

interface HeadCell {
  id: string;
  label: string;
  cell: (row: any) => any;
  numeric?: boolean;
  align?: "left" | "right" | "center";
  colspan?: number;
}

interface Props extends TableContainerProps {
  headCells: HeadCell[];
  data: any[];
}

export default function CustomTable({ headCells, data, ...props }: Props) {
  return (
    <TableContainer
      sx={{
        maxHeight: "calc(100vh - 16rem)",
        overflowY: "auto",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          height: 10,
          width: 10,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bdbdbd",
          borderRadius: 2,
        },
        px: 2,
      }}
      {...props}
    >
      <Table>
        <EnhancedTableHead
          headCells={headCells}
          numSelected={0}
          rowCount={0}
          nocheckbox
        />
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {headCells.map((headcell) => (
                <TableCell key={headcell.id}>{headcell.cell(row)}</TableCell>
              ))}
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={headCells.length} align="center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
