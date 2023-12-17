import Edit from "@mui/icons-material/Edit";
import Launch from "@mui/icons-material/Launch";
import Visibility from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { useState } from "react";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import EnhancedTableToolbar from "@/components/Table/EnhancedTableToolbar";
import Download from "@mui/icons-material/Download";
import { useSession } from "next-auth/react";
import { Contractor, Deductions } from "@prisma/client";
import prisma from "@/lib/prisma";
import axios from "axios";
import AddDeductions from "@/components/Deductions/addDeductions";
import { Button, Stack } from "@mui/material";
import FormSelect from "@/ui-component/FormSelect";
import MonthSelect from "@/ui-component/MonthSelect";
import dayjs, { Dayjs } from "dayjs";

const headCells = [
  {
    id: "contractorId",
    label: "Contractor ID",
    numeric: false,
    included: false,
  },
  {
    id: "contractorName",
    label: "Contractor Name",
    numeric: false,
    included: false,
  },
  { id: "month", label: "Month", numeric: false, included: false },
  { id: "gsthold", label: "GST Hold", numeric: true, included: false },
  { id: "gstrelease", label: "GST Release", numeric: true, included: false },
  { id: "advance", label: "Advance", numeric: true, included: false },
  { id: "anyother", label: "Any Other", numeric: true, included: false },
  { id: "action", label: "Action", numeric: false, included: true },
];

export default function Deduction({
  //   deductions,
  contractors,
}: {
  //   deductions: Deductions[];
  contractors: Contractor[];
}) {
  const [open, setOpen] = useState(false);
  const [deduction, setDeduction] = useState<Deductions | undefined>(undefined);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: session } = useSession();
  const [filterName, setFilterName] = useState("");
  const [deductions, setDeductions] = useState<Deductions[]>([]);
  const [loading, setLoading] = useState(false);
  const [contractorId, setContractorId] = useState<string>("all");
  const [month, setMonth] = useState<string | null>(null);

  const fetchDeducations = async () => {
    setLoading(true);
    try {
      const data = await axios.get(`/api/deductions`);
      setDeductions(data.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setDeduction(undefined);
    fetchDeducations();
  };

  React.useEffect(() => {
    fetchDeducations();
  }, []);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = deductions.map((n) => n.id);
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

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - deductions.length) : 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={4}>
            <FormSelect
              options={[
                { label: "All", value: "all" },
                ...contractors.map((contractor) => ({
                  label: contractor.contractorname,
                  value: contractor.contractorId,
                })),
              ]}
              handleChange={(e) => setContractorId(e as string)}
              value={contractorId}
            />
            <MonthSelect
              value={month ? dayjs(month, "MM/YYYY") : null}
              onChange={(value: Dayjs | null) =>
                setMonth(value?.format("MM/YYYY") || "")
              }
            />
          </Stack>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ justifySelf: "flex-end" }}
          >
            Add Deduction
          </Button>
        </Stack>
        <TableContainer
          sx={{
            p: 2,
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
              rowCount={deductions.length}
              headCells={headCells}
            />
            <TableBody>
              {deductions
                .filter(
                  (d) =>
                    (contractorId === "all" ||
                      d.contractorId === contractorId) &&
                    (month === null || d.month === month)
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id as string);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
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
                      {headCells
                        .filter((h) => !h.included)
                        .map((headCell) => (
                          <TableCell sx={{ minWidth: "10rem" }}>
                            {_.get(row, headCell.id)}
                          </TableCell>
                        ))}
                      <TableCell size="small" align="center">
                        <IconButton
                          onClick={() => {
                            setOpen(true);
                            setDeduction(row);
                          }}
                          sx={{ m: 0 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
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
          count={deductions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <AddDeductions
          open={open}
          handleClose={handleClose}
          deduction={deduction}
          contractors={contractors}
        />
      </Paper>
    </Box>
  );
}

export async function getServerSideProps() {
  const contractors = await prisma.contractor.findMany();
  return {
    props: {
      contractors,
    },
  };
}
