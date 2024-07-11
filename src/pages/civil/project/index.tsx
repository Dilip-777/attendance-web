import * as React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Project } from "@prisma/client";
import _, { identity } from "lodash";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Toolbar,
  alpha,
  styled,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import CustomTable from "@/ui-component/CustomTable";
import Add from "@mui/icons-material/Add";
import Download from "@mui/icons-material/Download";
import Search from "@mui/icons-material/Search";
import AutoComplete from "@/ui-component/Autocomplete";

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  marginRight: 30,
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

export default function Projects({ projects }: { projects: Project[] }) {
  const [filterName, setFilterName] = React.useState("");
  const [orderby, setOrderby] = React.useState("name");
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const router = useRouter();
  const headcells = [
    { id: "name", label: "Project Name", cell: (row: Project) => row.name },
    { id: "type", label: "Project Type", cell: (row: Project) => row.type },
    { id: "place", label: "Place", cell: (row: Project) => row.place },
    {
      id: "consultant",
      label: "Consultant",
      cell: (row: Project) => row.consultant || "-",
    },
    { id: "email", label: "Email", cell: (row: Project) => row.email || "-" },
    { id: "phone", label: "Phone", cell: (row: Project) => row.phone || "-" },

    {
      id: "action",
      label: "Action",
      cell: (row: Project) => {
        return (
          <Stack direction="row" spacing={2}>
            <IconButton onClick={() => router.push("/civil/project/" + row.id)}>
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => {
                setSelected(row.id);
                setOpen(true);
              }}
            >
              <Delete />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const handleClickReport = () => {
    // const tableRows = [
    //   [
    //     "Employee ID",
    //     "Employee Name",
    //     "Contractor ID",
    //     "Contractor Name",
    //     "Designation",
    //     "Department",
    //     "Gender",
    //     "Email",
    //     "Phone Number",
    //     "Basic Salary In Duration",
    //     "basic Salary",
    //     "Allowed Working Hours Per Day",
    //     "Service Charge",
    //     "GST",
    //     "TDS",
    //   ],
    // ];
    // employees
    //   .filter((employee) =>
    //     _.get(employee, orderby, "contractorname")
    //       .toString()
    //       .toLowerCase()
    //       .includes(filterName.toLowerCase())
    //   )
    //   .forEach((item) => {
    //     tableRows.push([
    //       item.employeeId.toString(),
    //       item.employeename,
    //       item.contractorId,
    //       item.contractorname,
    //       item.designation.designation,
    //       item.department.department || "-",
    //       item?.gender || "-",
    //       item.emailid || "-",
    //       item.phone?.toString() || "-",
    //       item.basicsalary_in_duration || "-",
    //       item.basicsalary?.toString() || "-",
    //       item.allowed_wrking_hr_per_day?.toString() || "-",
    //       item.servicecharge?.toString() || "-",
    //       item.gst?.toString() || "-",
    //       item.tds?.toString() || "-",
    //     ]);
    //   });
    // const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;
    // // Download CSV file
    // const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.setAttribute("href", url);
    // link.setAttribute("download", "Employees.csv");
    // link.style.visibility = "hidden";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={2}>
            <StyledSearch
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Search ..."
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => router.push("/civil/project/add")}
              startIcon={<Add />}
              color="secondary"
            >
              Add Project
            </Button>
          </Stack>
        </Toolbar>
        <CustomTable
          nocheckbox={false}
          headCells={headcells}
          data={projects.filter((project) =>
            project.name.toLowerCase().includes(filterName.toLowerCase())
          )}
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

  if (session.user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const projects = await prisma.project.findMany();

  return {
    props: {
      projects,
    },
  };
};
