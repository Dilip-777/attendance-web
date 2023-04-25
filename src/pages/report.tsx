import DepartmentReport from "@/components/Report/departmentreport";
import DesignationReport from "@/components/Report/designationreport";
import ManPowerReport from "@/components/Report/manpowerreport";
import SalaryReport from "@/components/Report/salaryreport";
import WorkerReport from "@/components/Report/workerreport";
import prisma from "@/lib/prisma";
import { Paper, Typography, Divider, Tabs, Tab, Box } from "@mui/material";
import {
  Contractor,
  Department,
  Designations,
  Workorder,
} from "@prisma/client";
import { GetServerSideProps } from "next";
import { useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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
        <Box sx={{ p: 3 }}>
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

export default function Reports({
  contractors,
  workorders,
  departments,
  designations,
}: {
  contractors: Contractor[];
  workorders: Workorder[];
  departments: Department[];
  designations: Designations[];
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
      <Typography variant="h3" sx={{ p: 2, m: 0, fontWeight: "500" }}>
        Reports
      </Typography>
      <Divider sx={{ my: 1, width: "100%" }} />

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="contractor Worker Report" {...a11yProps(0)} />
            <Tab label="contractor Salary Report" {...a11yProps(1)} />
            <Tab label="Department wise Contractors" {...a11yProps(2)} />
            <Tab label="Total Man Power Report" {...a11yProps(3)} />
            <Tab label="Designation wise Report" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <WorkerReport contractors={contractors} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SalaryReport contractors={contractors} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <DepartmentReport departments={departments} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ManPowerReport />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <DesignationReport
            designations={designations.map((d) => d.designation)}
          />
        </TabPanel>
      </Box>
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const contractors = await prisma.contractor.findMany();
  const workorders = await prisma.workorder.findMany();
  const departments = await prisma.department.findMany();
  const designations = await prisma.designations.findMany();

  return {
    props: { contractors, workorders, departments, designations },
  };
};
