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
import { useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";

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

const numberType = Yup.number()
  .transform((value, originalValue) => {
    if (isNaN(parseInt(originalValue))) {
      return undefined;
    }
    return value;
  })
  .required("Required");

const validationSchema = Yup.object().shape({
  contractorName: Yup.string().required("Required"),
  employeename: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  department: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  phone: numberType,
  emailid: Yup.string().required("Required"),
  basicsalaryinduration: Yup.string().required("Required"),
  basicsalary: Yup.string().required("Required"),
  allowedWorkinghoursperday: numberType,
  servicecharge: Yup.string().required("Required"),
  gst: numberType,
  tds: numberType,
});

export default function Edit() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { id } = router.query;

  const initialValues = {
    contractorName: "John Doe",
    employeename: "",
    designation: "",
    department: "",
    gender: "",
    phone: undefined,
    emailid: "",
    basicsalaryinduration: "",
    basicsalary: "",
    allowedWorkinghoursperday: 0,
    servicecharge: "",
    gst: null,
    tds: null,
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
          onSubmit={(values) => router.push("/")}
        >
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid ml={6} mt={2} container>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="contractorName"
                    label="Contractor Name*"
                    placeHolder="Contractor Name"
                    disabled={true}
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
                  <FormInput
                    name="designation"
                    label="Designation*"
                    placeHolder="Enter the Designation"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormSelect
                    name="gender"
                    label="Gender*"
                    placeHolder="Gender"
                    disabled={false}
                    options={["MALE", "FEMALE", "OTHERS"]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="department"
                    label="Department*"
                    placeHolder="Enter the Department"
                    disabled={false}
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
                  <FormInput
                    name="basicsalaryinduration"
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
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="allowedWorkinghoursperday"
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
          )}
        </Formik>
      </Paper>
    </>
  );
}
