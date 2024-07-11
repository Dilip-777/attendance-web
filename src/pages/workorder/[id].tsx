import {
  Box,
  Button,
  CircularProgress,
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
import { useEffect, useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik, useFormik, useFormikContext } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Project, Qcs, Workorder } from "@prisma/client";
import axios from "axios";
import FormDate from "@/components/FormikComponents/FormDate";
import FileUpload from "@/components/FormikComponents/FileUpload";
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";

const fileType = Yup.string().optional();

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required("Required"),
  nature: Yup.string().required("Required"),
  projectId: Yup.string(),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  remarks: Yup.string(),
  schedule: Yup.string(),
  workorderno: Yup.string(),
  paymentTerms: Yup.string(),
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
  workorder,
}: {
  contractors: (Contractor & {
    Qcs: (Qcs & {
      project: Project;
    })[];
  })[];
  workorder: Workorder;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    contractorId: workorder?.contractorId || "",
    nature: workorder?.nature || "",
    projectId: workorder?.projectId || "",
    startDate: workorder?.startDate || "",
    endDate: workorder?.endDate || "",
    location: workorder?.location || "",
    remarks: workorder?.remarks || "",
    schedule: workorder?.schedule || "",
    paymentTerms: workorder?.paymentTerms || "",
    workDescription: workorder?.workDescription || "",
    repeatOrOneTime: workorder?.repeatOrOneTime || "",
    workorderno: workorder?.workorderno || "WK12",
    alert1Month: workorder?.alert1Month || false,
    alert15days: workorder?.alert15days || false,
    amendmentDocument: workorder?.amendmentDocument
      ? workorder.amendmentDocument
      : undefined,
    addendumDocument: workorder?.addendumDocument
      ? workorder.addendumDocument
      : undefined,
    uploadDocument: workorder?.uploadDocument
      ? workorder.uploadDocument
      : undefined,
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
            width: 9,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ height: "3rem", display: "flex", alignItems: "center" }}>
          <Typography variant="h4" ml={5} my="auto">
            {workorder ? "Edit Work Order" : "Add Work Order"}
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            if (workorder) {
              await axios
                .put(`/api/workorder`, {
                  id: workorder.id,
                  ...values,
                  projectId: values.projectId || null,
                })
                .then((res) => {
                  router.push("/workorder");
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              await axios
                .post("/api/workorder", {
                  ...values,
                  projectId: values.projectId || null,
                })
                .then((res) => {
                  console.log(res);
                  router.push("/workorder");
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            setLoading(false);
          }}
        >
          {({ handleSubmit, values, errors }) => {
            const projects = contractors.find(
              (contractor) => contractor.contractorId === values.contractorId
            )?.Qcs;
            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={6} mt={2} container>
                  <Grid item xs={12} sm={6} md={4}>
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
                  <Grid item xs={12} sm={6} md={4}>
                    <AutoCompleteSelect
                      name="projectId"
                      label="Project"
                      placeHolder="Project Name"
                      disabled={false}
                      options={
                        projects?.map((p) => ({
                          value: p.projectId,
                          label: p.project.name,
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
                      name="schedule"
                      label="Schedule*"
                      placeHolder="Enter the Schedule"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="paymentTerms"
                      label="Payment Terms*"
                      placeHolder="Enter the Payment Terms"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="repeatOrOneTime"
                      label="Repeat Or One Time*"
                      placeHolder="Repeat Or One Time"
                      disabled={false}
                      options={[
                        { value: "Repeat", label: "Repeat" },
                        { value: "One Time", label: "One Time" },
                      ]}
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
                    <FormInput
                      name="remarks"
                      label="Remarks*"
                      placeHolder="Enter the Remarks"
                      disabled={false}
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
                  disabled={loading}
                >
                  Submit
                  {loading && (
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

  const contractors = await prisma.contractor.findMany({
    include: {
      Qcs: {
        include: {
          project: true,
        },
      },
    },
  });
  if (id !== "add") {
    const workorder = await prisma.workorder.findUnique({
      where: {
        id: id as string,
      },
    });

    return {
      props: {
        contractors,
        workorder,
      },
    };
  }

  return {
    props: {
      contractors,
    },
  };
};
