import * as React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { Department, Designations, Employee } from '@prisma/client';
import _ from 'lodash';
import CustomTable from '@/components/Table/Table';
import ImportData from '@/components/employeeImport';

const createHeadCells = (id: string, label: string, numeric: boolean, included: boolean) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
  };
};

const headCells1 = [
  createHeadCells('contractorname', 'Contractor Name', false, false),
  createHeadCells('contractorId', 'Contractor ID', false, false),
  createHeadCells('employeeId', 'Employee ID', false, false),
  createHeadCells('employeename', 'Employee Name', false, false),
  createHeadCells('designation.designation', 'Designation', false, false),
  createHeadCells('department.department', 'Department', false, false),
  createHeadCells('gender', 'Gender', false, false),
  createHeadCells('phone', 'Phone Number', true, false),
  createHeadCells('emailid', 'Email', false, false),
  createHeadCells('basicsalary_in_duration', 'Basic Salary In Duration', false, false),
  createHeadCells('basicsalary', 'Basic Salary', false, false),
  createHeadCells('allowed_wrking_hr_per_day', 'Allowed Working Hours Per Day', false, false),
  createHeadCells('servicecharge', 'Service Charge', false, false),
  createHeadCells('gst', 'GST', true, false),
  createHeadCells('tds', 'TDS', true, false),
];

interface EmployeeDesignationDepartment extends Employee {
  designation: Designations;
  department: Department;
}

export default function Employees({
  employees,
  departments,
  designations,
}: {
  employees: EmployeeDesignationDepartment[];
  departments: Department[];
  designations: Designations[];
}) {
  const [filterName, setFilterName] = React.useState('');
  const [orderby, setOrderby] = React.useState('contractorname');
  const handleClickReport = () => {
    const tableRows = [
      [
        'Employee ID',
        'Employee Name',
        'Contractor ID',
        'Contractor Name',
        'Designation',
        'Department',
        'Gender',
        'Email',
        'Phone Number',
        'Basic Salary In Duration',
        'basic Salary',
        'Allowed Working Hours Per Day',
        'Service Charge',
        'GST',
        'TDS',
      ],
    ];
    employees
      .filter((employee) =>
        _.get(employee, orderby, 'contractorname').toString().toLowerCase().includes(filterName.toLowerCase())
      )
      .forEach((item) => {
        tableRows.push([
          item.employeeId.toString(),
          item.employeename,
          item.contractorId,
          item.contractorname,
          item.designation.designation,
          item.department.department || '-',
          item?.gender || '-',
          item.emailid || '-',
          item.phone?.toString() || '-',
          item.basicsalary_in_duration || '-',
          item.basicsalary?.toString() || '-',
          item.allowed_wrking_hr_per_day?.toString() || '-',
          item.servicecharge?.toString() || '-',
          item.gst?.toString() || '-',
          item.tds?.toString() || '-',
        ]);
      });
    const csvContent = `${tableRows.map((row) => row.join(',')).join('\n')}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Employees.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CustomTable
      headcells={headCells1}
      rows={employees.filter((employee) =>
        _.get(employee, orderby, 'contractorname').toString().toLowerCase().includes(filterName.toLowerCase())
      )}
      filterName={filterName}
      setFilterName={setFilterName}
      editLink="/employees"
      upload={<ImportData departments={departments} designations={designations} />}
      orderby={orderby}
      setOrderby={setOrderby}
      handleClickReport={handleClickReport}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (session.user?.role === 'Admin') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }
  const employees = await prisma.employee.findMany({
    include: {
      designation: true,
      department: true,
    },
  });
  const departments = await prisma.department.findMany();
  const designations = await prisma.designations.findMany();
  return {
    props: {
      employees,
      departments,
      designations,
    },
  };
};
