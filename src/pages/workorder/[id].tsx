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
import FormDate from "@/components/FormikComponents/FormDate";
import FileUpload from "@/components/FormikComponents/FileUpload";

const fileType = Yup.object().required("Required");

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required("Required"),
  nature: Yup.string().required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  workDescription: Yup.string().required("Required"),
  repeatOrOneTime: Yup.string().required("Required"),
  alert1Month: Yup.boolean().required("Required"),
  alert15days: Yup.boolean().required("Required"),
  amendmentDocument: fileType,
  addendumDocument: fileType,
  uploadDocument: fileType,
});

export default function AddWordOrder({
  contractors,
  employee,
}: {
  contractors: Contractor[];
  employee: Employee;
}) {
  const router = useRouter();

  const initialValues = {
    contractorId: "",
    nature: "",
    startDate: "",
    endDate: "",
    location: "",
    workDescription: "",
    repeatOrOneTime: "",
    alert1Month: false,
    alert15days: false,
    amendmentDocument: undefined,
    addendumDocument: undefined,
    uploadDocument: undefined,
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
            axios
              .post("/api/workorder", values)
              .then((res) => {
                console.log(res);
                router.push("/workOrder");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {({ handleSubmit, values, errors }) => {
            // if (!errors.startDate) {
            //   const options1 = options.filter((option) =>
            //     option.department.includes(values.startDate)
            //   );
            //   setOptions(options1);
            // }
            console.log(errors);

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
                      name="nature"
                      label="Nature*"
                      placeHolder="Enter the Nature"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormDate
                      name="startDate"
                      label="Start Date"
                      placeHolder="Enter the Start Date"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormDate
                      name="endDate"
                      label="End Date"
                      placeHolder="Enter the End Date"
                      disabled={false}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="location"
                      label="Location*"
                      placeHolder="Enter the Location"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="workDescription"
                      label="Work Description*"
                      placeHolder="Enter the Work Description"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="repeatOrOneTime"
                      label="Repeat Or One Time*"
                      placeHolder="Repeat Or One Time"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="alert1Month"
                      label="Alert Before 1 Month before it expires*"
                      placeHolder="Alert Before 1 Month before it expires"
                      disabled={false}
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="alert15days"
                      label="Alert Before 15 Days before it expires*"
                      placeHolder="Alert Before 15 Days before it expires"
                      disabled={false}
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="amendmentDocument"
                      label="Amendment Document"
                      placeholder="Amendment Document"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="addendumDocument"
                      label="Addendum Document"
                      placeholder="Addendum Document"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="uploadDocument"
                      label="Upload Document"
                      placeholder="Upload Document"
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
