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
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Download from "@mui/icons-material/Download";
import { useSession } from "next-auth/react";

interface HeadCells {
  id: string;
  label: string;
  numeric: boolean;
  included: boolean;
}

interface Props {
  rows: any[];
  filterName: string;
  setFilterName: React.Dispatch<React.SetStateAction<string>>;
  headcells: HeadCells[];
  editLink: string;
  extraTableCells?: React.ReactNode;
  setContractorId?: React.Dispatch<React.SetStateAction<string>>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  type?: string;
  handleClickReport?: () => void;
  upload?: React.ReactNode;
}

const CustomTable = (props: Props) => {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: session } = useSession();

  const router = useRouter();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = props.rows.map((n) => n.contractorname);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

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
        <EnhancedTableToolbar
          numSelected={selected.length}
          filtername={props.filterName}
          setFilterName={props.setFilterName}
          handleClickReport={props.handleClickReport}
          type={props.type}
          upload={props.upload}
        />
        <TableContainer
          sx={{
            maxHeight: 450,
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
              rowCount={props.rows.length}
              headCells={props.headcells}
            />
            <TableBody>
              {props.rows
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
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) =>
                            handleClick(event, row.employeename as string)
                          }
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      {props.headcells
                        .filter((h) => !h.included)
                        .map((headCell) => (
                          <TableCell
                            align={headCell.numeric ? "left" : "center"}
                            sx={{ minWidth: "10rem" }}
                          >
                            {_.get(row, headCell.id) === true && "Yes"}
                            {_.get(row, headCell.id) === false && "No"}
                            {(typeof _.get(row, headCell.id) !== "boolean" &&
                              _.get(row, headCell.id, "-")) ||
                              "-"}
                          </TableCell>
                        ))}
                      {props.setContractorId && props.setOpen && (
                        <>
                          {session?.user?.role !== "HR" && (
                            <TableCell
                              onClick={() => {
                                if (props.setContractorId && props.setOpen) {
                                  props.setContractorId(row.id as string);
                                  props.setOpen(true);
                                }
                              }}
                              align="center"
                            >
                              <IconButton sx={{ m: 0 }}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </TableCell>
                          )}

                          {session?.user?.role === "HoCommercialAuditor" && (
                            <TableCell align="center">
                              <IconButton
                                onClick={() => {
                                  router.push(`/hoauditor/${row.id}`);
                                }}
                                sx={{ m: 0 }}
                              >
                                <Launch fontSize="small" />
                              </IconButton>
                            </TableCell>
                          )}
                        </>
                      )}
                      <TableCell size="small" align="center">
                        <IconButton
                          onClick={() =>
                            router.push(`${props.editLink}/${row.id}`)
                          }
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
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default CustomTable;
