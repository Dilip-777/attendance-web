import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  Contractor,
  Department,
  Designations,
  Employee,
  SeperateSalary,
  Shifts,
  TimeKeeper,
} from "@prisma/client";
import getTotalAmountAndRows from "@/utils/getmonthlycount";
import MonthSelect from "@/ui-component/MonthSelect";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import _ from "lodash";
import { useRouter } from "next/router";
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import getHourlyCount from "@/utils/gethourlycount";
import MonthlyPlantCommercialTable from "@/components/PlantCommercial/MonthlyTable";
import HourlyTable from "@/components/PlantCommercial/HourlyTable";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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
    <FormControl
      fullWidth
      sx={{ maxWidth: 250, minWidth: 200 }}
      variant="outlined"
    >
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

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

interface DepartmentDesignation extends Department {
  designations: DesignationwithSalary[];
}

interface ContractorwithDepartment extends Contractor {
  departments: DepartmentDesignation[];
}

interface EmployeeDepartmentDesignation extends Employee {
  department: DepartmentDesignation;
  designation: DesignationwithSalary;
}

export default function PlantCommercial({
  contractor,
  designations,
  selectedDepartment,
  contractors,
  // departments,
  shifts,
}: {
  contractor: ContractorwithDepartment;
  designations: DesignationwithSalary[];
  selectedDepartment: DepartmentDesignation[];
  contractors: ContractorwithDepartment[];
  // departments: DepartmentDesignation[];
  shifts: Shifts[];
}) {
  const [value, setValue] = React.useState<string>(dayjs().format("MM/YYYY"));
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Record<string, string | number>[]>([]);
  const [total, setTotal] = React.useState(0);
  const [bill, setBill] = React.useState(undefined);
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [loadingbill, setLoadingBill] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [contractor1, setContractor] = React.useState(contractor.contractorId);
  const [department, setDepartment] = React.useState("");
  const [wrkhrs, setWrkhrs] = React.useState(8);
  const [selectedDepartments, setSelectedDepartments] = React.useState<
    DepartmentDesignation[]
  >(selectedDepartment || []);
  const [employees, setEmployees] = React.useState<
    EmployeeDepartmentDesignation[]
  >([]);
  const [hourlyCount, setHourlyCount] = React.useState<
    Record<string, string | number>[]
  >([]);

  const [timekeepers, setTimekeepers] = React.useState<TimeKeeper[]>([]);
  const [departments, setDepartments] = React.useState<DepartmentDesignation[]>(
    []
  );
  const [inputValue, setInputValue] = React.useState("");
  const [tabvalue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchTimekeepers = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/gettimekeeper?contractor=${contractor1}&month=${value}`
    );
    setTimekeepers(res.data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTimekeepers();
  }, [value, contractor1]);

  const fetchEmployees = async () => {
    const res = await axios.get(
      `/api/hr/employee?contractor=${contractor1}&departments=${selectedDepartments
        .map((d) => d.id)
        .join(",")}`
    );
    setEmployees(res.data);
  };

  React.useEffect(() => {
    fetchEmployees();
  }, [contractor1, selectedDepartments]);

  const sgst = Math.ceil(total * 0.09);

  const columns = [{ id: "date", label: "Date", minWidth: 80 }];

  const extra = designations
    .filter((d) => d.departmentname === department)
    .map((designation) => {
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

      const c = contractors.find((c) => c.contractorId === contractor1);

      const body = {
        contractorId: c?.contractorId,
        contractorname: c?.contractorname,
        month: value,
        amount: total + sgst + sgst - (c?.servicecharge || 0),
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

  React.useEffect(() => {
    // fetchTimekeepers();
    const d =
      contractors.find((c) => c.contractorId === contractor1)?.departments ||
      [];
    setDepartments(d);
    setSelectedDepartments(
      selectedDepartment.filter((s) =>
        d.find((d) => d.department === s.department)
      )
    );
  }, [contractor1]);

  const onChange = (value: Dayjs | null) =>
    setValue(value?.format("MM/YYYY") || "");

  const filteredDesignations = designations.filter(
    (d) => d.departmentname === department
  );
  const colspan = filteredDesignations.length > 2 ? 3 : 1;

  const hrs = wrkhrs ? [wrkhrs] : [8, 12];

  return (
    <Paper
      sx={{
        maxHeight: "calc(100vh - 100px)",
        width: "100%",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          width: 9,
          height: 10,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bdbdbd",
          borderRadius: 2,
        },
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          // height: "5rem",
          display: "flex",
          p: 2,
          pb: 1,
          justifyContent: "flex-start",
          mb: 0,
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

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          sx={{
            overflowX: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              width: 9,
              height: 7,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bdbdbd",
              borderRadius: 2,
            },
            py: 1,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <MonthSelect
              // label="Select Date"
              value={dayjs(value, "MM/YYYY")}
              onChange={onChange}
            />
            <FormSelect
              value={contractor1}
              setValue={setContractor}
              options={contractors.map((contractor1) => {
                return {
                  value: contractor1?.contractorId,
                  label: contractor1?.contractorname,
                };
              })}
            />
            {/* <FormSelect
              value={department}
              setValue={setDepartment}
              options={departments.map((d) => {
                return {
                  value: d.department,
                  label: d.department,
                };
              })}
            /> */}
            <Autocomplete
              sx={{
                minWidth: 250,
              }}
              onChange={(event: any, newValue: string | null) => {
                if (
                  !selectedDepartments.find((d) => d.department === newValue)
                ) {
                  const d = departments.find((d) => d.department === newValue);
                  if (d) {
                    setSelectedDepartments([...selectedDepartments, d]);
                  }
                }
                setInputValue("");
              }}
              value={inputValue}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={[...departments.map((d) => d.department)]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select a Department" />
              )}
              clearIcon={null}
            />
            {/* {selectedDepartments.find((d) => d.department === department)?.basicsalary_in_duration?.toLowerCase() ===
              'hourly' && ( */}
            <FormSelect
              value={wrkhrs}
              setValue={setWrkhrs}
              options={[
                { value: 8, label: "8 Hrs" },
                { value: 12, label: "12 Hrs" },
                { value: 0, label: "8 Hrs and 12 Hrs" },
              ]}
            />
            {/* )} */}
          </Stack>
          <Tooltip title="Upload Bills">
            <Button
              // onClick={() => uploadBill()}
              variant="contained"
              component="label"
              disabled={loadingbill}
              sx={{ bgcolor: "#5e35b1" }}
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

      <Stack direction="row" spacing={2} px={5} pb={2}>
        {selectedDepartments.map((d) => (
          <Chip
            key={d.department}
            label={d.department}
            onDelete={() =>
              setSelectedDepartments(
                selectedDepartments.filter(
                  (department) => department.department !== d.department
                )
              )
            }
          />
        ))}
      </Stack>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleTabChange}>
            <Tab
              label="Attendance Calculation"
              {...a11yProps(0)}
              sx={{
                borderBottom: tabvalue === 0 ? "3px solid #5e35b1" : "0",
                color: tabvalue === 0 ? "#5e35b1" : "",
              }}
            />
            <Tab
              label="OT hrs Calculation"
              {...a11yProps(1)}
              sx={{
                borderBottom: tabvalue === 1 ? "3px solid #5e35b1" : "0",
                color: tabvalue === 1 ? "#5e35b1" : "",
              }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabvalue} index={0}>
          <Stack spacing={3}>
            {selectedDepartments.find(
              (d) => d.basicsalary_in_duration === "Hourly"
            ) &&
              // {wrkhrs === 0 ? }
              hrs.map((hr) => (
                <HourlyTable
                  departments={selectedDepartments.filter(
                    (d) => d.basicsalary_in_duration === "Hourly"
                  )}
                  contractor={contractor}
                  shifts={shifts}
                  value={value}
                  wrkhrs={hr}
                  servicecharge={
                    contractors.find((c) => c.contractorId === contractor1)
                      ?.servicecharge as number
                  }
                  timekeepers={timekeepers}
                  ot={false}
                />
              ))}
            {employees.length > 0 && (
              <MonthlyPlantCommercialTable
                contractor={
                  contractors.find((c) => c.contractorId === contractor1) as any
                }
                value={value}
                employees={employees}
                departments={selectedDepartment}
                ot={false}
              />
            )}
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={tabvalue} index={1}>
          <Stack spacing={3}>
            {selectedDepartments.find(
              (d) => d.basicsalary_in_duration === "Hourly"
            ) &&
              // {wrkhrs === 0 ? }
              hrs.map((hr) => (
                <HourlyTable
                  departments={selectedDepartments.filter(
                    (d) => d.basicsalary_in_duration === "Hourly"
                  )}
                  contractor={contractor}
                  shifts={shifts}
                  value={value}
                  wrkhrs={hr}
                  servicecharge={
                    contractors.find((c) => c.contractorId === contractor1)
                      ?.servicecharge as number
                  }
                  timekeepers={timekeepers}
                  ot={true}
                />
              ))}
            {employees.length > 0 && (
              <MonthlyPlantCommercialTable
                contractor={
                  contractors.find((c) => c.contractorId === contractor1) as any
                }
                value={value}
                employees={employees}
                departments={selectedDepartment}
                ot={true}
              />
            )}
          </Stack>
        </CustomTabPanel>
      </Box>

      {/* <Stack spacing={3}>
        {selectedDepartments.find((d) => d.basicsalary_in_duration === 'Hourly') &&
          // {wrkhrs === 0 ? }
          hrs.map((hr) => (
            <HourlyTable
              departments={selectedDepartments.filter((d) => d.basicsalary_in_duration === 'Hourly')}
              contractor={contractor.contractorname}
              shifts={shifts}
              value={value}
              wrkhrs={hr}
              servicecharge={contractors.find((c) => c.contractorId === contractor1)?.servicecharge as number}
              timekeepers={timekeepers}
              ot={false}
            />
          ))}
        {employees.length > 0 && (
          <MonthlyPlantCommercialTable
            contractor={contractors.find((c) => c.contractorId === contractor1) as any}
            shifts={shifts}
            value={value}
            wrkhrs={wrkhrs}
            servicecharge={contractors.find((c) => c.contractorId === contractor1)?.servicecharge as number}
            timekeepers={timekeepers.filter((t) => t.department === department)}
            employees={employees}
            departments={selectedDepartment}
          />
        )}
      </Stack> */}
    </Paper>
  );
}

interface TableProps {
  designations: DesignationwithSalary[];
  department: DepartmentDesignation;
  contractor: string;
  shifts: Shifts[];
  value: string;
  wrkhrs: number;
  servicecharge?: number;
  timekeepers: TimeKeeper[];
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

  const contractors = await prisma.contractor?.findMany({
    include: {
      departments: {
        include: {
          designations: {
            include: {
              seperateSalary: true,
            },
          },
        },
      },
    },
  });
  const contractor = contractors?.find((c) => c.id === contractorid);

  const designations = await prisma.designations.findMany({
    include: {
      seperateSalary: true,
    },
  });

  const selectedDepartment = await prisma.department.findMany({
    where: {
      department: {
        in: (department as string).split(","),
      },
    },
    include: {
      designations: {
        include: {
          seperateSalary: true,
        },
      },
    },
  });

  if (!contractor || !selectedDepartment) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const shifts = await prisma.shifts.findMany();

  return {
    props: {
      contractor,
      designations,
      selectedDepartment,
      contractors: contractors,
      shifts,
    },
  };
};
