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
import {
  Contractor,
  Department,
  Designations,
  Employee,
  Project,
} from "@prisma/client";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";

const numberType = Yup.number().required("Required");

const mobilenumbertype = Yup.string().matches(
  /^(?:\+91[1-9]\d{9}|0[1-9]\d{9}|[1-9]\d{9})$/,
  "Please enter a valid mobile number"
);

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  type: Yup.string().required("Required"),
  place: Yup.string().required("Required"),
  contractorId: Yup.string().required("Required"),
});

export default function AddProject({
  contractors,
  project,
}: {
  contractors: Contractor[];
  project: Project | null;
}) {
  const router = useRouter();

  const initialValues = {
    name: project?.name || "",
    type: project?.type || "",
    place: project?.place || "",
    contractorId: project?.contractorId || "",
  };

  console.log(initialValues);

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
            Add Project
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setErrors, setSubmitting }) => {
            // const { phone, employeeId, ...rest } = values;

            setSubmitting(true);
            if (project) {
              await axios.put("/api/civil/project", {
                ...values,
                id: project.id,
              });
              router.push("/civil/project");
              setSubmitting(false);
              return;
            }
            await axios.post("/api/civil/project", values);
            router.push("/civil/project");
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, values, isSubmitting }) => {
            console.log(values);

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
                      name="name"
                      label="Project Name*"
                      placeHolder="Enter Project Name"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormSelect
                      name="type"
                      label="Project Type*"
                      placeHolder="Enter Project Type"
                      disabled={false}
                      options={[
                        { value: "Civil", label: "Civil" },
                        { value: "Electrical", label: "Electrical" },
                        { value: "Mechanical", label: "Mechanical" },
                        { value: "Fabrication", label: "Fabrication" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name="place"
                      label="Place*"
                      placeHolder="Enter Place"
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

  if (session.user?.role !== "Civil") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const project = await prisma.project.findUnique({
    where: {
      id: id as string,
    },
  });

  const contractors = await prisma.contractor.findMany();

  return {
    props: {
      contractors,
      project,
    },
  };
};
