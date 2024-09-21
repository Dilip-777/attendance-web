import {
  Button,
  Grid,
  CircularProgress,
  Box,
  Divider,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import {
  Contractor,
  MeasurementItem,
  Measurement,
  Project,
  BOQ,
  BOQItem,
  Qcs,
  QcsBoq,
  QcsBoqItem,
  BarBending,
  BarBendingItem,
} from "@prisma/client";
import FormSelect from "@/components/FormikComponents/FormSelect";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";
import AddMeasurementItem from "@/components/Civil/MeasurementItem";
import dayjs from "dayjs";
import FormDate from "@/components/FormikComponents/FormDate";

const workItemSchema = Yup.object().shape({
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

const validationSchema = Yup.object().shape({
  boqId: Yup.string(),
  description: Yup.string().required("Required"),
  contractorid: Yup.string().required("Required"),
  projectId: Yup.string().required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  measurementItems: Yup.array().of(workItemSchema).required("Required"),
});

interface MeasurementWithItems extends Measurement {
  measurementItems: MeasurementItem[];
  contractor: Contractor;
}

const Addworkitem = ({
  work,
  contractors,
  works,
  projects,
}: {
  work: MeasurementWithItems;
  contractors: Contractor[];
  works: Measurement[];
  projects: (Project & {
    Qcs: (Qcs & {
      BOQ: (QcsBoq & {
        BOQItems: (QcsBoqItem & {
          measurementItems: (MeasurementItem & {
            measurement: Measurement;
          })[];
          barBendingItems: (BarBendingItem & {
            barBending: BarBending;
          })[];
        })[];
      })[];
    })[];
  })[];
}) => {
  const router = useRouter();

  const initialValues = {
    boqId: work?.boqId || "",
    description: work?.description || "",
    startDate: work?.startDate || dayjs().format("DD/MM/YYYY"),
    endDate: work?.endDate || dayjs().format("DD/MM/YYYY"),
    contractorid: work?.contractorid || "",
    projectId: work?.projectId || "",
    measurementItems: work
      ? work?.measurementItems.map((w) => ({
          unit: w.unit,
          unitrate: w.unitrate,
          referenceWorkId: w.referenceWorkId,
          description: w.description,
          nos: w.nos,
          length: w.length,
          breadth: w.breadth,
          height: w.height,
          remarks: w.remarks || "",
          boqItemId: w.boqItemId,
        }))
      : [],
  };

  return (
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
          Add Measurement Sheet
        </Typography>
      </Box>
      <Divider />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          let measurementItems: any[] = [];
          values.measurementItems.forEach((workItem) => {
            let quantity =
              workItem.nos *
              workItem.length *
              workItem.breadth *
              (workItem?.height || 1);

            measurementItems.push({
              nos: workItem.nos,
              length: workItem.length,
              breadth: workItem.breadth,
              height: workItem.height,
              unit: workItem.unit,
              unitrate: workItem.unitrate,
              remarks: workItem.remarks,
              description: workItem.description,
              quantity: parseFloat(quantity.toFixed(3)),
              boqItemId: workItem.boqItemId,
              // valueofcurrentBill: parseFloat(valueofcurrentBill.toFixed(3)),
              // totalQuantity: parseFloat(totalQuantity.toFixed(3)),
              // valueofTotalBill: parseFloat(valueofTotalBill.toFixed(3)),
            });
          });

          setSubmitting(true);
          if (work) {
            await axios.put(`/api/works`, {
              ...values,
              measurementItems,
              id: work.id,
            });
          } else {
            await axios.post("/api/works", {
              ...values,
              measurementItems,
            });
          }

          setSubmitting(false);
          router.push("/civil/measurement");
        }}
      >
        {({
          errors,
          isSubmitting,
          handleSubmit,
          values,
          setFieldError,
          setFieldValue,
        }) => {
          if (
            projects.filter((w) =>
              w.Qcs.find((q) => q.contractorid === values.contractorid)
            ).length === 0 &&
            !errors.projectId
          ) {
            setFieldError("projectId", "No Project for this Contractor");
          }

          const qcs =
            projects.find((w) => w.id === values.projectId)?.Qcs || [];

          const boqs =
            qcs.find((w) => w.contractorid === values.contractorid)?.BOQ || [];

          const boq = boqs?.find((w) => w.id === values.boqId);

          const boqItems =
            (boq
              ? boq.BOQItems
              : boqs.find((w) => w.id === values.boqId)?.BOQItems) || [];

          if (boq?.description !== values.description) {
            setFieldValue("description", boq?.description);
            setFieldValue(
              "measurementItems",
              boqItems.map((w) => {
                const balanceQuantity =
                  w.totalQuantity -
                  w.measurementItems.reduce(
                    (acc, curr) => acc + curr.quantity,
                    0
                  ) -
                  w.barBendingItems.reduce(
                    (acc, curr) => acc + curr.totalweight,
                    0
                  );

                return {
                  boqItemId: w.id,
                  description: w.description,
                  unit: w.unit,
                  nos: 0,
                  length: 0,
                  breadth: 0,
                  height: 0,
                  balanceQuantity,
                  remarks: "",
                };
              })
            );
          }

          return (
            <form noValidate onSubmit={handleSubmit}>
              <Box sx={{ px: "2rem" }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <AutoCompleteSelect
                      name="contractorid"
                      label="Select Contractor"
                      placeHolder="Contractor"
                      sx={{ width: "100%", maxWidth: "100%" }}
                      options={contractors.map((work) => ({
                        value: work.contractorId,
                        label: work.contractorname,
                      }))}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <AutoCompleteSelect
                      name="projectId"
                      label="Select a Project"
                      placeHolder="Select a Project"
                      sx={{ width: "100%", maxWidth: "100%" }}
                      options={projects
                        .filter((w) =>
                          w.Qcs.find(
                            (q) => q.contractorid === values.contractorid
                          )
                        )
                        .map((work) => ({ value: work.id, label: work.name }))}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <AutoCompleteSelect
                      name="boqId"
                      label="Select BOQ"
                      placeHolder="Select a BOQ"
                      sx={{ width: "100%", maxWidth: "100%" }}
                      options={boqs.map((work) => ({
                        value: work.id,
                        label: work.description,
                      }))}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <FormDate
                      name="startDate"
                      label="Select Start Date"
                      placeHolder="Select Start Date"
                      sx={{ width: "100%", maxWidth: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <FormDate
                      name="endDate"
                      label="Select End Date"
                      placeHolder="Select End Date"
                      sx={{ width: "100%", maxWidth: "100%" }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
                <FieldArray
                  name="measurementItems"
                  render={({ form, push, remove }) => {
                    const { measurementItems } = form.values;
                    return (
                      <Stack>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "1rem", fontWeight: "600" }}
                          >
                            Measurement Items
                          </Typography>
                        </Box>
                        {measurementItems.map(
                          (workItem: any, index: number) => (
                            <AddMeasurementItem
                              key={index}
                              index={index}
                              workItem={workItem}
                              boqItems={boqItems}
                            />
                          )
                        )}
                      </Stack>
                    );
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
                  color="secondary"
                >
                  Submit {isSubmitting && <CircularProgress size={20} />}
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Paper>
  );
};

export default Addworkitem;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session?.user?.role !== "Civil") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { id } = context.query;
  let work = null;
  if (id !== "add") {
    work = await prisma.measurement.findUnique({
      where: { id: id as string },
      include: { measurementItems: true, contractor: true },
    });
  }
  const works = await prisma.measurement.findMany({
    where: {
      NOT: {
        id: id as string,
      },
    },
  });
  const contractors = await prisma.contractor.findMany({
    where: {
      servicedetail: "Civil",
    },
  });
  const projects = await prisma.project.findMany({
    include: {
      Qcs: {
        include: {
          BOQ: {
            include: {
              BOQItems: {
                include: {
                  measurementItems: {
                    include: {
                      measurement: true,
                    },
                  },
                  barBendingItems: {
                    include: {
                      barBending: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return {
    props: {
      work,
      contractors,
      works,
      projects,
    },
  };
};
