import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
// import {  useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Department, Designations, Employee } from "@prisma/client";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const numberType = Yup.number().required("Required");

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required("Required"),
  employeeId: numberType,
  employeename: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  department: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  phone: numberType,
  emailid: Yup.string().required("Required").optional(),
  basicsalary_in_duration: Yup.string().required("Required"),
  basicsalary: numberType,
  allowed_wrking_hr_per_day: numberType,
  servicecharge: numberType.optional(),
  gst: numberType.optional(),
  tds: numberType.optional(),
});

export default function Edit({
  contractors,
  employee,
  departments,
  designations,
}: {
  contractors: Contractor[];
  employee: Employee;
  departments: Department[];
  designations: Designations[];
}) {
  const router = useRouter();

  const initialValues = {
    contractorId: employee?.contractorId || "",
    employeeId: employee?.employeeId || 0,
    employeename: employee?.employeename || "",
    designation: employee?.designation || "",
    department: employee?.department || "",
    gender: employee?.gender || "",
    phone: employee?.phone || 0,
    emailid: employee?.emailid || "",
    basicsalary_in_duration: employee?.basicsalary_in_duration || "",
    basicsalary: employee?.basicsalary || 0,
    allowed_wrking_hr_per_day: employee?.allowed_wrking_hr_per_day || 0,
    servicecharge: employee?.servicecharge || 0,
    gst: employee?.gst || 0,
    tds: employee?.tds || 0,
  };

  return (
    <>
      <Paper
        sx={{
          height: "83.7vh",
          pt: "1rem",
          pb: "8rem",
          overflow: "hidden auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            width: 7,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ height: "3rem", display: "flex", alignItems: "center" }}>
          <Typography variant="h4" ml={5} my="auto">
            Add Employee
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setErrors, setSubmitting }) => {
            const { phone, employeeId, ...rest } = values;
            setSubmitting(true);
            axios
              .post("/api/hr/employee", {
                id: employee ? employee.id : undefined,
                ...rest,
                employeeId: employeeId.toString(),
                phone: String(phone),
              })
              .then((res) => {
                router.push("/employees");
              })
              .catch((err) => {
                if (err.response.data.message === "Employee already exists") {
                  alert("Employee Id already exists");
                  setErrors({ employeeId: "Employee Id already exists" });
                }
              });
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, values, isSubmitting }) => {
            // if (!errors.designation) {
            //   const options1 = options.filter((option) =>
            //     option.department.includes(values.designation)
            //   );
            //   setOptions(options1);
            // }
            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={6} mt={2} container>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="contractorId"
                      label="Contractor Name*"
                      placeHolder="Contractor Name"
                      disabled={false}
                      options={
                        contractors?.map((contractor) => ({
                          value: contractor.id,
                          label: contractor.contractorname,
                        })) || []
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="employeeId"
                      label="Employee Id*"
                      placeHolder="Enter Employee Id"
                      type="number"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="employeename"
                      label="Employee Name*"
                      placeHolder="Enter Employee Name"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="department"
                      label="Department*"
                      placeHolder="Enter the Department"
                      disabled={false}
                      options={departments.map((d) => ({
                        value: d.department,
                        label: d.department,
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="gender"
                      label="Gender*"
                      placeHolder="Gender"
                      disabled={false}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="designation"
                      label="Designation*"
                      placeHolder="Enter the Designation"
                      disabled={false}
                      options={designations
                        .filter((d) => d.departmentname === values.department)
                        .map((d) => ({
                          value: d.designation,
                          label: d.designation,
                        }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="phone"
                      label="Phone Number*"
                      placeHolder="Enter the Phone Number"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="emailid"
                      label="Email*"
                      placeHolder="Enter the Email"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="basicsalary_in_duration"
                      label="Basic Salary in Duration*"
                      placeHolder="Basic Salary in Duration"
                      disabled={false}
                      options={[
                        { value: "Hourly", label: "Hourly" },
                        { value: "Monthly", label: "Monthly" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="basicsalary"
                      label="Basic Salary*"
                      placeHolder="Enter the Basic Salary"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="allowed_wrking_hr_per_day"
                      label="Allowed Working Hours Per Day*"
                      placeHolder="Allowed Working Hours Per Day"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="servicecharge"
                      label="Service Charge*"
                      placeHolder="Enter the Service Charge"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="gst"
                      label="GST*"
                      placeHolder="GST"
                      type="number"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="tds"
                      label="TDS*"
                      placeHolder="TDS"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ float: "right", mr: 10 }}
                  disabled={isSubmitting}
                >
                  Submit
                  {isSubmitting && (
                    <CircularProgress
                      size={15}
                      sx={{ ml: 1, color: "#364152" }}
                    />
                  )}
                </Button>
              </form>
            );
          }}
        </Formik>
      </Paper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { id } = context.query;
  const departments = await prisma.department.findMany();

  const contractors = await prisma.contractor.findMany();
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

  const employee = await prisma.employee.findUnique({
    where: {
      id: id as string,
    },
  });

  const designations = await prisma.designations.findMany();

  return {
    props: {
      contractors,
      employee,
      departments,
      designations,
    },
  };
};
