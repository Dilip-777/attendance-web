import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import EnhancedTableToolbar from "@/components/Table/EnhancedTableToolbar";
import CustomTable from "@/components/Table/Table";
import prisma from "@/lib/prisma";
import MonthSelect from "@/ui-component/MonthSelect";
import Edit from "@mui/icons-material/Edit";
import Launch from "@mui/icons-material/Launch";
import Visibility from "@mui/icons-material/Visibility";
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import { bills } from "@prisma/client";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import _ from "lodash";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import router from "next/router";
import { useEffect, useState } from "react";

interface HeadCells {
  id: string;
  label: string;
  numeric: boolean;
  included: boolean;
}

const headCells: HeadCells[] = [
  {
    id: "contractorname",
    numeric: false,
    label: "Contractor Name",
    included: true,
  },
  { id: "month", numeric: false, label: "Month", included: true },
  { id: "amount", numeric: true, label: "Amount", included: true },
  { id: "document", numeric: false, label: "Contractor Bill", included: true },
];

export default function Bill() {
  const [bills, setBills] = useState<bills[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(dayjs());

  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = bills.map((n) => n.contractorname);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    contractorname: string
  ) => {
    const selectedIndex = selected.indexOf(contractorname);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, contractorname);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (contractorname: string) =>
    selected.indexOf(contractorname) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bills.length) : 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchBills = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/uploadbill?month=${month.format("MM/YYYY")}`
    );
    setBills(res.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchBills();
  }, [month]);

  return (
    <Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ width: "5rem", p: 3 }}>
          <MonthSelect value={month} onChange={(e) => setMonth(e as Dayjs)} />
        </Box>
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
          }}
        >
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={bills.length}
              headCells={headCells}
            />
            <TableBody>
              {bills
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(
                    row.contractorname as string
                  );
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      //   sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) =>
                            handleClick(event, row.id as string)
                          }
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">{row.contractorname}</TableCell>
                      <TableCell align="left">{row.month}</TableCell>
                      <TableCell align="left">{row.amount}</TableCell>
                      <TableCell
                        onClick={() => router.push(row.document)}
                        align="left"
                        sx={{ cursor: "pointer" }}
                      >
                        View Document
                      </TableCell>
                    </TableRow>
                  );
                })}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bills.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (
    !(
      session.user?.role === "HoCommercialAuditor" ||
      session.user?.role === "Corporate"
    )
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
