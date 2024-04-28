import { useEffect, useState } from "react";
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
import { FieldArray, Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  Contractor,
  Employee,
  FixedWork,
  StoreItem,
  Stores,
} from "@prisma/client";
import {
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";
import AutoComplete from "@/ui-component/Autocomplete";
import axios from "axios";

const numberType = Yup.number().required("Required");

const WorkItem = Yup.object().shape({
  description: Yup.string().required("Required"),
  rate: numberType,
});

const validationSchema = Yup.object().shape({
  deployment: Yup.boolean().required("Required"),
  minManpower: Yup.boolean().required("Required"),
  minHeadcount: numberType,
  workorderhighlights: Yup.string(),
  fixedworks: Yup.array().of(WorkItem),
});

interface ContractorWithFixedWorks extends Contractor {
  fixedworks: FixedWork[];
}

export default function Edit({
  contractors,
}: {
  contractors: ContractorWithFixedWorks[];
}) {
  const [contractor, setContractor] = useState<ContractorWithFixedWorks>(
    contractors[0]
  );
  const router = useRouter();

  const initialValues = {
    deployment: contractor.deployment || false,
    minManpower: contractor.minManpower || false,
    minHeadcount: contractor.minHeadcount || 0,
    workorderhighlights: contractor.workorderhighlights || "",
    fixedworks:
      contractor.fixedworks.length > 0
        ? contractor.fixedworks.map((work) => ({
            description: work.description,
            rate: work.rate,
          }))
        : [{ description: "", rate: 0 }],
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
            Add Works
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await axios.post("/api/fixedworks", {
              contractorId: contractor.contractorId,
              ...values,
            });
            router.push("/works");
          }}
        >
          {({ handleSubmit, values, setFieldValue, errors }) => {
            console.log(errors);

            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={3} mt={2} container>
                  <Grid item xs={12} sm={6} lg={4} sx={{ my: 2 }}>
                    <AutoComplete
                      value={contractor.contractorId}
                      setValue={(value) => {
                        const selectedContractor = contractors.find(
                          (contractor) => contractor.contractorId === value
                        );
                        if (!selectedContractor) return;
                        setContractor(selectedContractor);
                        setFieldValue(
                          "deployment",
                          selectedContractor.deployment
                        );
                        setFieldValue(
                          "minManpower",
                          selectedContractor.minManpower
                        );
                        setFieldValue(
                          "minHeadcount",
                          selectedContractor.minHeadcount
                        );
                        setFieldValue(
                          "workorderhighlights",
                          selectedContractor.workorderhighlights
                        );
                        setFieldValue(
                          "fixedworks",
                          selectedContractor.fixedworks.length > 0
                            ? selectedContractor.fixedworks.map((work) => ({
                                description: work.description,
                                rate: work.rate,
                              }))
                            : [{ description: "", rate: 0 }]
                        );
                      }}
                      label="Contractor Name*"
                      options={
                        contractors?.map((contractor) => ({
                          value: contractor.contractorId,
                          label: contractor.contractorname,
                        })) || []
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <FormSelect
                      name="deployment"
                      label="Deployment*"
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      placeHolder="Select Deployment"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <FormSelect
                      name="minManpower"
                      label="Minimum Manpower Capping*"
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      placeHolder="Select"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <FormInput
                      name="minHeadcount"
                      label="Minimum Headcount*"
                      placeHolder="Minimum Headcount"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <FormInput
                      name="workorderhighlights"
                      label="Work Order Highlights*"
                      placeHolder="Work Order Highlights"
                    />
                  </Grid>
                </Grid>
                <FieldArray1 values={values} setFieldValue={setFieldValue} />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ float: "right", mr: 10 }}
                  color="secondary"
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

function FieldArray1({
  values,
  setFieldValue,
}: {
  values: any;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}) {
  return (
    <FieldArray
      name="fixedworks"
      render={({ form, push, remove }) => {
        const { fixedworks } = form.values;

        return (
          <>
            <Stack mb={2} spacing={0} ml={3} sx={{ width: "fit-content" }}>
              <Stack justifyContent="space-between" direction="row">
                <Typography variant="h4">
                  Works : {fixedworks?.length || 0}
                </Typography>
              </Stack>
              <TableContainer sx={{ my: 3 }}>
                <TableHead sx={{ width: "100%" }}>
                  <TableRow sx={{ bgcolor: "#eeeeee" }}>
                    <TableCell>Description</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fixedworks?.map((value: any, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ py: 0 }}>
                          <FormInput
                            name={`fixedworks.${index}.description`}
                            placeHolder="Enter the Description"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 0 }}>
                          <FormInput
                            name={`fixedworks.${index}.rate`}
                            placeHolder="Enter the Rate"
                            type="number"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 0 }}>
                          <IconButton
                            onClick={() => {
                              remove(index);
                            }}
                            color="error"
                            sx={{ float: "right" }}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Button
                        onClick={() =>
                          push({
                            description: "",
                            rate: 0,
                          })
                        }
                        variant="contained"
                        color="secondary"
                      >
                        Add Work
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </TableContainer>
            </Stack>
          </>
        );
      }}
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

  if (session.user?.role !== "Corporate") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const contractors = await prisma.contractor.findMany({
    where: {
      servicedetail: "Fixed",
    },
    include: {
      fixedworks: {
        select: {
          description: true,
          rate: true,
        },
      },
    },
  });

  return {
    props: {
      contractors,
    },
  };
};
