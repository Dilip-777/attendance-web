import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Department, Designations } from "@prisma/client";
import getTotalAmountAndRows from "@/utils/get8hr";
import MonthSelect from "@/ui-component/MonthSelect";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import _ from "lodash";
import { useRouter } from "next/router";
import BackupIcon from "@mui/icons-material/Backup";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";
import Close from "@mui/icons-material/Close";

export const FormSelect = ({
  value,
  setValue,
  options,
}: {
  value: number | string;
  setValue: React.Dispatch<React.SetStateAction<number>> | any;
  options: { value: number | string; label: string }[];
}) => {
  return (
    <FormControl fullWidth variant="outlined">
      <Select
        value={value}
        onChange={(e) => setValue(e.target.value as number)}
        placeholder="Select"
        // defaultValue={value}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default function PlantCommercial({
  contractor,
  designations,
  selectedDepartment,
}: {
  contractor: Contractor;
  designations: Designations[];
  selectedDepartment: Department;
}) {
  const [value, setValue] = React.useState<string>(dayjs().format("MM/YYYY"));
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Record<string, string | number>[]>([]);
  const [total, setTotal] = React.useState(0);
  const [bill, setBill] = React.useState(undefined);
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [loadingbill, setLoadingBill] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();
  const colspan = designations.length > 2 ? 3 : 1;
  const { department } = router.query;

  const sgst = Math.floor(total * 0.09);

  const columns = [{ id: "date", label: "Date", minWidth: 80 }];

  const extra = designations.map((designation) => {
    const label = designation.gender === "Male" ? "M" : "F";
    return {
      id: designation.designationid,
      label,
      minWidth: 50,
    };
  });

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleChange = async (file: File) => {
    setLoadingBill(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "attendance-web"); // Replace with your Cloudinary upload preset name
    formData.append("resource_type", "raw");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dddvmk9xs/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      const body = {
        contractorId: contractor.contractorId,
        contractorname: contractor.contractorname,
        month: value,
        amount: total + sgst + sgst - (contractor.servicecharge || 0),
        document: result.secure_url,
      };
      const res = await axios.post("/api/uploadbill", body);
      setOpen(true);
    } catch (error) {
      console.log(error);
    }
    setLoadingBill(false);
  };

  columns.push(...extra);

  columns.push({ id: "total", label: "Total", minWidth: 60 });

  const fetchTimekeepers = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/gettimekeeper?contractor=${contractor.contractorId}&month=${value}&department=${department}`
    );
    const { rows, total1 } = getTotalAmountAndRows(
      res.data,
      dayjs(value, "MM/YYYY").month() + 1,
      dayjs(value, "MM/YYYY").year(),
      designations,
      selectedDepartment
    );
    setRows(rows);
    setTotal(total1);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTimekeepers();
  }, [value]);

  console.log(designations.length, designations);

  const onChange = (value: Dayjs | null) =>
    setValue(value?.format("MM/YYYY") || "");

  return (
    <Paper sx={{ width: "100%" }}>
      <Box
        sx={{
          height: "5rem",
          display: "flex",
          p: 3,
          justifyContent: "flex-start",
          mb: 2,
        }}
      >
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          action={action}
        >
          <Alert
            onClose={handleClose}
            severity={"success"}
            sx={{ width: "100%" }}
          >
            {"Bill Uploaded Successfully"}
          </Alert>
        </Snackbar>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <MonthSelect
              // label="Select Date"
              value={dayjs(value, "MM/YYYY")}
              onChange={onChange}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4" sx={{ width: "20rem" }}>
            Contractor Name :{" "}
            <span style={{ fontWeight: "500" }}>
              {contractor.contractorname}
            </span>
          </Typography>
          <Typography variant="h4" sx={{ width: "20rem" }}>
            Department : <span style={{ fontWeight: "500" }}>{department}</span>
          </Typography>
          <Tooltip title="Upload Bills">
            <Button
              // onClick={() => uploadBill()}
              variant="contained"
              component="label"
              disabled={loadingbill}
            >
              Upload
              {loadingbill && (
                <CircularProgress size={15} sx={{ ml: 1, color: "#364152" }} />
              )}
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files) {
                    handleChange(e.target.files[0]);
                  }
                }}
              />
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      <TableContainer
        sx={{
          maxHeight: 500,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            width: 9,
            height: 10,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#e0e0e0" }}>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                Date
              </TableCell>
              {designations.map((designation) => (
                <TableCell
                  key={designation.id}
                  align="center"
                  sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                  colSpan={1}
                >
                  {designation.designation}
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                TOTAL
              </TableCell>
            </TableRow>
            {selectedDepartment.basicsalary_in_duration?.toLowerCase() ===
              "hourly" && (
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={"center"}
                    style={{
                      top: 57,
                      minWidth: column.minWidth,
                      fontWeight: "600",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {!loading ? (
              rows.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.f8mw}>
                    {columns.map((column) => {
                      const value = _.get(row, column.id, "-");
                      return (
                        <TableCell key={column.id} align={"center"}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}
            <TableRow>
              {/* <TableCell rowSpan={10} /> */}
              <TableCell
                colSpan={designations.length > 2 ? designations.length - 2 : 2}
              ></TableCell>
              <TableCell
                colSpan={colspan}
                // align="left"
                sx={{ fontWeight: "600" }}
              >
                Total
              </TableCell>
              <TableCell align="center">{total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={designations.length > 2 ? designations.length - 2 : 2}
              ></TableCell>

              <TableCell
                colSpan={colspan}
                // align="center"
                sx={{ fontWeight: "600" }}
              >
                SGST 9%
              </TableCell>
              <TableCell align="center">{sgst}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={designations.length > 2 ? designations.length - 2 : 2}
              ></TableCell>
              <TableCell colSpan={colspan} sx={{ fontWeight: "600" }}>
                CGST 9%
              </TableCell>
              <TableCell align="center">{sgst}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={designations.length > 2 ? designations.length - 2 : 2}
              ></TableCell>
              <TableCell colSpan={colspan} sx={{ fontWeight: "600" }}>
                Service Charge
              </TableCell>
              <TableCell align="center">
                {contractor.servicecharge || 0}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={designations.length > 2 ? designations.length - 2 : 2}
              ></TableCell>
              <TableCell colSpan={colspan} sx={{ fontWeight: "600" }}>
                Total Net Amount
              </TableCell>
              <TableCell align="center">
                {total + sgst + sgst + (contractor.servicecharge || 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const { contractorid, department } = context.query;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  if (user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  const contractor = await prisma.contractor.findUnique({
    where: {
      id: contractorid as string,
    },
  });

  const designations = await prisma.designations.findMany({
    where: {
      departmentname: department as string,
    },
  });

  const selectedDepartment = await prisma.department.findFirst({
    where: {
      department: department as string,
    },
  });

  if (!contractor || !department) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      contractor,
      designations,
      selectedDepartment,
    },
  };
};
