import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  OutlinedInput,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { shouldForwardProp } from "@mui/system";
import { useEffect, useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik, useFormik, useFormikContext } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Employee } from "@prisma/client";
import axios from "axios";

const DesignationSelect = ({ department }: { department: string }) => {
  const { values } = useFormikContext();
  const [options, setOptions] = useState([
    { value: "ELEC", label: "ELEC", department: "CCM LRF" },
    { value: "LCO", label: "LCO", department: "CCM" },
    { value: "TMAN", label: "TMAN", department: "CCM" },
    { value: "FITTER", label: "FITTER", department: "CCM LRF" },
    { value: "PO", label: "PO", department: "CCM" },
    { value: "BCO", label: "BCO", department: "CCM" },
    { value: "SRFILTER", label: "SRFILTER", department: "CCM LRF" },
    { value: "INCHARGE", label: "INCHARGE", department: "CCM" },
    { value: "MO", label: "MO", department: "CCM" },
    { value: "SHIFTINCH", label: "SHIFTINCH", department: "CCM" },
    { value: "GC", label: "GC", department: "CCM" },
    { value: "SBO", label: "SBO", department: "CCM" },
    { value: "LMAN", label: "LMAN", department: "CCM" },
    { value: "FORMAN", label: "FORMAN", department: "CCM" },
    { value: "TMESSON", label: "TMESSON", department: "CCM" },
    { value: "LMES", label: "LMES", department: "CCM LRF" },
    { value: "JRELE", label: "JRELE", department: "CCM" },
    { value: "HELPER", label: "HELPER", department: "CCM LRF" },
    { value: "8MW", label: "8MW", department: "8HR 12HR" },
    { value: "12WM", label: "12WM", department: "8HR 12HR" },
    { value: "DM Plant", label: "DM Plant", department: "8HR 12HR" },
    { value: "QC", label: "QC", department: "8HR 12HR" },
    { value: "STORE", label: "STORE", department: "8HR 12HR" },
    { value: "K-7 & 1-6PROC", label: "K-7 & 1-6PROC", department: "8HR 12HR" },
    { value: "RMHS", label: "RMHS", department: "8HR 12HR" },
    { value: "PS", label: "PS", department: "8HR 12HR" },
    { value: "HK & Garden", label: "HK & Garden", department: "8HR 12HR" },
    { value: "SVR", label: "SVR", department: "8HR 12HR CCM LRF" },
    { value: "Colony", label: "Colony", department: "colony" },
  ]);
  const optionchange = () => {
    if (department === "CCM") {
      setOptions((options) =>
        options.filter((option) => option.department.includes(department))
      );
    }
  };

  return (
    <FormSelect
      name="designation"
      label="Designation"
      options={options}
      placeHolder="Select the"
    />
  );
};

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(
  ({ theme }) => ({
    width: 350,
    // marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    "& input": {
      background: "transparent !important",
      paddingLeft: "4px !important",
    },
    [theme.breakpoints.down("lg")]: {
      width: 250,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff",
    },
  })
);

const numberType = Yup.number().required("Required");

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required("Required"),
  employeename: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  department: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  phone: numberType,
  emailid: Yup.string().required("Required").optional(),
  basicsalary_in_duration: Yup.string().required("Required"),
  basicsalary: numberType,
  allowed_wrking_hr_per_day: numberType,
  servicecharge: numberType,
  gst: numberType,
  tds: numberType,
});

export default function Edit({
  contractors,
  employee,
}: {
  contractors: Contractor[];
  employee: Employee;
}) {
  const router = useRouter();

  const [value, setValue] = useState("");
  const { id } = router.query;
  console.log(contractors);
  const options = [
    { value: "ELEC", label: "ELEC", department: "CCM LRF" },
    { value: "LCO", label: "LCO", department: "CCM" },
    { value: "TMAN", label: "TMAN", department: "CCM" },
    { value: "FITTER", label: "FITTER", department: "CCM LRF" },
    { value: "PO", label: "PO", department: "CCM" },
    { value: "BCO", label: "BCO", department: "CCM" },
    { value: "SRFILTER", label: "SRFILTER", department: "CCM LRF" },
    { value: "INCHARGE", label: "INCHARGE", department: "CCM" },
    { value: "MO", label: "MO", department: "CCM" },
    { value: "SHIFTINCH", label: "SHIFTINCH", department: "CCM" },
    { value: "GC", label: "GC", department: "CCM" },
    { value: "SBO", label: "SBO", department: "CCM" },
    { value: "LMAN", label: "LMAN", department: "CCM" },
    { value: "FORMAN", label: "FORMAN", department: "CCM" },
    { value: "TMESSON", label: "TMESSON", department: "CCM" },
    { value: "LMES", label: "LMES", department: "CCM LRF" },
    { value: "JRELE", label: "JRELE", department: "CCM" },
    { value: "HELPER", label: "HELPER", department: "CCM LRF" },
    { value: "8MW", label: "8MW", department: "8HR 12HR" },
    { value: "12WM", label: "12WM", department: "8HR 12HR" },
    { value: "DM Plant", label: "DM Plant", department: "8HR 12HR" },
    { value: "QC", label: "QC", department: "8HR 12HR" },
    { value: "STORE", label: "STORE", department: "8HR 12HR" },
    { value: "K-7 & 1-6PROC", label: "K-7 & 1-6PROC", department: "8HR 12HR" },
    { value: "RMHS", label: "RMHS", department: "8HR 12HR" },
    { value: "PS", label: "PS", department: "8HR 12HR" },
    { value: "HK & Garden", label: "HK & Garden", department: "8HR 12HR" },
    { value: "SVR", label: "SVR", department: "8HR 12HR CCM LRF" },
    { value: "colony", label: "Colony", department: "colony" },
  ];

  const initialValues = {
    contractorId: employee?.contractorId || "",
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
          onSubmit={(values) => {
            console.log(values);
            const { phone, ...rest } = values;
            console.log(String(phone), rest);
            axios
              .post("/api/hr/employee", {
                id: employee ? employee.id : undefined,
                ...rest,
                phone: String(phone),
              })
              .then((res) => {
                router.push("/employees");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {({ handleSubmit, values, errors }) => {
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
                      options={[
                        { value: "8HR", label: "8HR" },
                        { value: "12HR", label: "12HR" },
                        { value: "CCM", label: "CCM" },
                        { value: "LRF", label: "LRF" },
                        { value: "Colony", label: "Colony" },
                      ]}
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
                      options={options
                        .filter((op) =>
                          op.department.includes(values.department)
                        )
                        .map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                    />
                    {/* <DesignationSelect department="qwe" /> */}
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
                    <FormInput
                      name="basicsalary_in_duration"
                      label="Basic Salary in Duration*"
                      placeHolder="Basic Salary in Duration"
                      disabled={false}
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
                >
                  Submit
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

  return {
    props: {
      contractors,
      employee,
    },
  };
};
