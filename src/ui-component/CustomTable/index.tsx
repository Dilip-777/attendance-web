import {
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Table,
  TableContainerProps,
  Checkbox,
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
  nocheckbox?: boolean;
}

export default function CustomTable({
  headCells,
  data,
  nocheckbox = true,
  ...props
}: Props) {
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
          nocheckbox={nocheckbox}
          onSelectAllClick={() => {}}
        />
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {!nocheckbox && (
                <TableCell padding="checkbox">
                  <Checkbox color="secondary" />
                </TableCell>
              )}
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
