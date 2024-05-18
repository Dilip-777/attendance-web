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
import { Contractor, Project, Qcs } from "@prisma/client";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";

const validationSchema = Yup.object().shape({
  contractorid: Yup.string().required("Required"),
  projectId: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

export default function AddProject({
  contractors,
  qcs,
}: {
  contractors: (Contractor & { projects: Project[] })[];
  qcs: Qcs | null;
}) {
  const router = useRouter();

  const initialValues = {
    contractorid: qcs?.contractorid || "",
    projectId: qcs?.projectId || "",
    description: qcs?.description || "",
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
            Add QCS
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setErrors, setSubmitting }) => {
            // const { phone, employeeId, ...rest } = values;

            setSubmitting(true);
            if (qcs) {
              await axios.put("/api/civil/qcs", {
                ...values,
                id: qcs.id,
              });
              router.push("/qcs");
              setSubmitting(false);
              return;
            }
            await axios.post("/api/civil/qcs", values);
            router.push("/qcs");
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, values, isSubmitting }) => {
            const projects =
              contractors.find(
                (contractor) => contractor.contractorId === values.contractorid
              )?.projects || [];
            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={3} mt={2} container>
                  <Grid item xs={12} sm={6} xl={4}>
                    <AutoCompleteSelect
                      name="contractorid"
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
                    <AutoCompleteSelect
                      name="projectId"
                      label="Project*"
                      placeHolder="Select project"
                      disabled={false}
                      options={
                        projects?.map((project) => ({
                          value: project.id,
                          label: project.name,
                        })) || []
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="description"
                      label="Bid*"
                      placeHolder="Enter Bid"
                      disabled={false}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ float: "right", mr: 10 }}
                  disabled={isSubmitting}
                  color="secondary"
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
  const { id } = context.params ? context.params : ({ id: null } as any);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (session.user?.role !== "Corporate") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const qcs = await prisma.qcs.findUnique({
    where: {
      id: id as string,
    },
  });

  const contractors = await prisma.contractor.findMany({
    include: {
      projects: true,
    },
  });

  return {
    props: {
      contractors,
      qcs,
    },
  };
};
