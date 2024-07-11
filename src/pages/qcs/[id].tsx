import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { FieldArray, Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { BOQ, BOQItem, Contractor, Project, Qcs } from "@prisma/client";
import axios from "axios";
import { CircularProgress, Stack } from "@mui/material";
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";
import AddMeasurementItem from "@/components/Civil/MeasurementItem";

const BOQItemSchema = Yup.object().shape({
  unit: Yup.string(),
  unitrate: Yup.number(),
  referenceWorkId: Yup.string().optional().nullable(),
  description: Yup.string().required("Required"),
  nos: Yup.number(),
  length: Yup.number(),
  breadth: Yup.number(),
  height: Yup.number(),
  remarks: Yup.string().optional(),
});

const BOQSchema = Yup.object().shape({
  id: Yup.string(),
  description: Yup.string().required("Required"),
  BOQItems: Yup.array().of(BOQItemSchema).optional(),
});

const validationSchema = Yup.object().shape({
  contractorid: Yup.string().required("Required"),
  projectId: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  boqs: Yup.array().of(BOQSchema).required("Required"),
});

export default function AddProject({
  contractors,
  qcs,
  projects,
}: {
  contractors: Contractor[];
  qcs: Qcs | null;
  projects: (Project & {
    BOQ: (BOQ & {
      BOQItems: BOQItem[];
    })[];
  })[];
}) {
  const router = useRouter();
  const prevProjectId = useRef("");

  const initialValues = {
    contractorid: qcs?.contractorid || "",
    projectId: qcs?.projectId || "",
    description: qcs?.description || "",
    boqs: [],
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
            const { boqs, ...rest } = values;
            const b = boqs.map((boq: any) => {
              const totalQuantity = (boq as any).BOQItems.reduce(
                (acc: any, item: any) => {
                  return acc + item.quantity;
                },
                0
              );
              const totalAmount = boq.BOQItems.reduce((acc: any, item: any) => {
                return acc + item.unitrate * item.quantity;
              }, 0);

              return {
                ...boq,
                totalQuantity,
                totalAmount,
              };
            });
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
            await axios.post("/api/civil/qcs", {
              ...rest,
              boqs: b,
            });
            router.push("/qcs");
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, values, isSubmitting, setFieldValue }) => {
            useEffect(() => {
              if (prevProjectId.current !== values.projectId) {
                prevProjectId.current = values.projectId;
                const contractor = contractors.find(
                  (c) => c.contractorId === values.contractorid
                );
                const project = projects.find((p) => p.id === values.projectId);
                setFieldValue("boqs", project?.BOQ || []);
              }
            }, [
              values.projectId,
              values.contractorid,
              contractors,
              setFieldValue,
            ]);

            let bidprice = 0;

            values.boqs.forEach((boq: any) => {
              boq.BOQItems.forEach((item: any) => {
                bidprice +=
                  item.unitrate *
                  (item.nos * item.length * item.breadth * item.height);
              });
            });

            if (bidprice.toString() !== values.description.toString()) {
              setFieldValue("description", bidprice.toString());
            }

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
                <FieldArray
                  name="boqs"
                  render={({ form, push, remove }) => {
                    const { boqs } = form.values;
                    console.log(boqs);

                    return (
                      <Stack>
                        {boqs.map((b: any, index: number) => (
                          <Stack spacing={1} key={index} sx={{ p: "24px" }}>
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                fontWeight: "600",
                              }}
                            >
                              {b.description}
                            </Typography>
                            <FieldArray
                              name={`boqs[${index}].BOQItems`}
                              render={({ form, push, remove }) => {
                                const { BOQItems } = b;

                                return (
                                  <Stack>
                                    {BOQItems?.map(
                                      (workItem: any, workIndex: number) => (
                                        <AddMeasurementItem
                                          key={workIndex}
                                          index={workIndex}
                                          qcs={true}
                                          mainIndex={index}
                                        />
                                      )
                                    )}
                                  </Stack>
                                );
                              }}
                            />
                          </Stack>
                        ))}
                      </Stack>
                    );
                  }}
                />

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
    where: {
      servicedetail: "Civil",
    },
  });

  const projects = await prisma.project.findMany({
    include: {
      BOQ: {
        include: {
          BOQItems: true,
        },
      },
    },
  });

  return {
    props: {
      contractors,
      qcs,
      projects,
    },
  };
};
