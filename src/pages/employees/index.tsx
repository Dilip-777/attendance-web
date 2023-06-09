import * as React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Employee } from "@prisma/client";
import _ from "lodash";
import CustomTable from "@/components/Table/Table";
import ImportData from "@/components/employeeImport";

const createHeadCells = (
  id: string,
  label: string,
  numeric: boolean,
  included: boolean
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
  };
};

const headCells1 = [
  createHeadCells("contractorname", "Contractor Name", false, false),
  createHeadCells("contractorId", "Contractor ID", false, false),
  createHeadCells("employeeId", "Employee ID", false, false),
  createHeadCells("employeename", "Employee Name", false, false),
  createHeadCells("designation", "Designation", false, false),
  createHeadCells("department", "Department", false, false),
  createHeadCells("gender", "Gender", false, false),
  createHeadCells("phone", "Phone Number", true, false),
  createHeadCells("emailid", "Email", false, false),
  createHeadCells(
    "basicsalary_in_duration",
    "Basic Salary In Duration",
    false,
    false
  ),
  createHeadCells("basicsalary", "Basic Salary", false, false),
  createHeadCells(
    "allowed_wrking_hr_per_day",
    "Allowed Working Hours Per Day",
    false,
    false
  ),
  createHeadCells("servicecharge", "Service Charge", false, false),
  createHeadCells("gst", "GST", true, false),
  createHeadCells("tds", "TDS", true, false),
];

export default function Employees({ employees }: { employees: Employee[] }) {
  const [filterName, setFilterName] = React.useState("");
  return (
    <CustomTable
      headcells={headCells1}
      rows={employees.filter((employee) =>
        employee.employeename.toLowerCase().includes(filterName.toLowerCase())
      )}
      filterName={filterName}
      setFilterName={setFilterName}
      editLink="/employees"
      upload={<ImportData />}
    />
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
  const employees = await prisma.employee.findMany();
  return {
    props: {
      employees,
    },
  };
};
