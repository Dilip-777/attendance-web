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
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";

const numberType = Yup.number().required("Required");

const mobilenumbertype = Yup.string().matches(
  /^(?:\+91[1-9]\d{9}|0[1-9]\d{9}|[1-9]\d{9})$/,
  "Please enter a valid mobile number"
);

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required("Required"),
  employeeId: Yup.string().required("Required"),
  employeename: Yup.string()
    .required("Required")
    .matches(/^[A-Za-z ]+$/, "Please enter only letters and spaces"),
  designationId: Yup.string().required("Required"),
  departmentId: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  phone: mobilenumbertype.required("Required"),
  emailid: Yup.string().required("Required").email().optional(),
  basicsalary_in_duration: Yup.string().required("Required"),
  basicsalary: numberType,
  allowed_wrking_hr_per_day: numberType,
  servicecharge: numberType.optional(),
  gst: numberType.optional(),
  tds: numberType.optional(),
});

interface EmployeeDesignationDepartment extends Employee {
  designation: Designations;
  department: Department;
}

export default function Edit({
  contractors,
  employee,
  designations,
}: {
  contractors: (Contractor & {
    departments: Department[];
  })[];
  employee: EmployeeDesignationDepartment;
  designations: Designations[];
}) {
  const router = useRouter();

  const initialValues = {
    contractorId: employee?.contractorId || "",
    employeeId: employee?.employeeId || "",
    employeename: employee?.employeename || "",
    designationId: employee?.designationId || "",
    departmentId: employee?.departmentId || "",
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

  const getOptions = (department: string) => {
    const options = designations
      .filter((d) => d.departmentId === department)
      .map((d) => ({
        value: d.id,
        label: d.designation,
      }));

    const unique = options.filter((item, index) => {
      return (
        index ===
        options.findIndex((obj) => {
          return JSON.stringify(obj) === JSON.stringify(item);
        })
      );
    });

    return unique;
  };

  const getDepartments = (contractorId: string) => {
    return (
      contractors.find((c) => c.contractorId === contractorId)?.departments ||
      []
    );
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
                contractorId: rest.contractorId,
                employeeId: employeeId,
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
            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={3} mt={2} container>
                  <Grid item xs={12} sm={6} xl={4}>
                    <AutoCompleteSelect
                      name="contractorId"
                      label="Contractor Name*"
                      placeHolder="Contractor Name"
                      disabled={false}
                      options={
                        contractors?.map((contractor) => ({
                          value: contractor.contractorId,
                          label: contractor.contractorname,
                        })) || []
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="employeeId"
                      label="Employee Id*"
                      placeHolder="Enter Employee Id"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="employeename"
                      label="Employee Name*"
                      placeHolder="Enter Employee Name"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <AutoCompleteSelect
                      name="departmentId"
                      label="Department*"
                      placeHolder="Enter the Department"
                      disabled={false}
                      options={getDepartments(values.contractorId).map((d) => ({
                        value: d.id,
                        label: d.department,
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
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
                  <Grid item xs={12} sm={6} xl={4}>
                    <AutoCompleteSelect
                      name="designationId"
                      label="Designation*"
                      placeHolder="Enter the Designation"
                      disabled={false}
                      options={getOptions(values.departmentId)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="phone"
                      label="Phone Number*"
                      placeHolder="Enter the Phone Number"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="emailid"
                      label="Email*"
                      placeHolder="Enter the Email"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormSelect
                      name="basicsalary_in_duration"
                      label="Basic Salary in Duration*"
                      placeHolder="Basic Salary in Duration"
                      disabled={false}
                      options={[
                        { value: "Hourly", label: "Hourly" },
                        { value: 'Daily', label: 'Daily' },
                        { value: "Monthly", label: "Monthly" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="basicsalary"
                      label="Basic Salary*"
                      placeHolder="Enter the Basic Salary"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="allowed_wrking_hr_per_day"
                      label="Allowed Working Hours Per Day*"
                      placeHolder="Allowed Working Hours Per Day"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="servicecharge"
                      label="Service Charge*"
                      placeHolder="Enter the Service Charge"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="gst"
                      label="GST*"
                      placeHolder="GST"
                      type="number"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
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

  const employee = await prisma.employee.findUnique({
    where: {
      id: id as string,
    },
  });

  const contractors = await prisma.contractor.findMany({
    include: {
      departments: true,
    },
  });

  const designations = await prisma.designations.findMany();

  return {
    props: {
      contractors,
      employee,
      designations,
    },
  };
};
