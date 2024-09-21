import {
  Button,
  Grid,
  CircularProgress,
  Box,
  Divider,
  Paper,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/FormikComponents/FormInput";
import {
  BOQ,
  BOQItem,
  BarBending,
  BarBendingItem,
  Contractor,
  Measurement,
  MeasurementItem,
  Project,
  Qcs,
  QcsBoqItem,
  Workorder,
} from "@prisma/client";
import FormSelect from "@/components/FormikComponents/FormSelect";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";
import FormDate from "@/components/FormikComponents/FormDate";
import FormInput1 from "@/ui-component/FormInput";
import dayjs from "dayjs";

const workItemSchema = Yup.object().shape({
  diamark: Yup.number(),
  barmark: Yup.string(),
  description: Yup.string().required("Required"),
  noofequipments: Yup.number(),
  costperequipment: Yup.number(),
  a: Yup.number(),
  b: Yup.number(),
  c: Yup.number(),
  d: Yup.number(),
  e: Yup.number(),
  f: Yup.number(),
  g: Yup.number(),
  h: Yup.number(),
  remarks: Yup.string(),
});

const validationSchema = Yup.object().shape({
  boqId: Yup.string(),
  description: Yup.string().required("Required"),
  contractorid: Yup.string().required("Required"),
  projectId: Yup.string().required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  barbendingItems: Yup.array().of(workItemSchema).required("Required"),
});

interface barbendingtypes extends BarBending {
  barbendingItems: BarBendingItem[];
  contractor: Contractor;
}

const AddBarBending = ({
  barbending,
  contractors,
  projects,
}: {
  barbending: barbendingtypes;
  contractors: Contractor[];
  projects: (Project & {
    Qcs: (Qcs & {
      BOQ: (BOQ & {
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
    boqId: barbending?.boqId || "",
    description: barbending?.description || "",
    contractorid: barbending?.contractorid || "",
    projectId: barbending?.projectId || "",
    startDate: barbending?.startDate || dayjs().format("DD/MM/YYYY"),
    endDate: barbending?.endDate || dayjs().format("DD/MM/YYYY"),

    barbendingItems: barbending
      ? barbending?.barbendingItems.map((w) => ({
          barmark: w.barmark || "",
          diamark: w.diamark,
          description: w.description,
          noofequipments: w.noofequipments,
          costperequipment: w.costperequipment,
          a: w.a,
          b: w.b,
          c: w.c,
          d: w.d,
          e: w.e,
          f: w.f,
          g: w.g,
          h: w.h,
          remarks: w.remarks,
          totalQuantity: 0,
          balanceQuantity: 0,
        }))
      : [],
  };

  return (
    <Paper
      sx={{
        height: "83.7vh",
        pt: "2rem",
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
      <Box sx={{ h: "3rem", display: "flex", alignItems: "center" }}>
        <Typography variant="h4" m={5} my="auto">
          Add Bar Bending Schedule
        </Typography>
      </Box>
      <Divider />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          let barbendingItems: any[] = [];
          values.barbendingItems.forEach((item) => {
            const totalcost = parseFloat(
              (item.noofequipments * item.costperequipment).toFixed(3)
            );
            const cuttinglength = parseFloat(
              (
                item.a +
                item.b +
                item.c +
                item.d +
                item.e +
                item.f +
                item.g +
                item.h
              ).toFixed(3)
            );
            const totalLength = parseFloat(
              (totalcost * cuttinglength).toFixed(3)
            );
            const unitweight = parseFloat(
              ((item.diamark * item.diamark) / 162.2).toFixed(3)
            );
            const totalweight = parseFloat(
              (totalLength * unitweight).toFixed(3)
            );
            const { balanceQuantity, totalQuantity, ...rest } = item;
            barbendingItems.push({
              ...rest,
              totalcost,
              cuttinglength,
              totalLength,
              unitweight,
              totalweight,
            });
          });

          const totalAmount = barbendingItems.reduce(
            (acc, curr) => acc + curr.totalweight,
            0
          );

          setSubmitting(true);
          if (barbending) {
            await axios.put(`/api/barbending`, {
              ...values,
              totalAmount,
              barbendingItems,
              id: barbending.id,
            });
          } else {
            await axios.post("/api/barbending", {
              ...values,
              totalAmount,
              barbendingItems,
            });
          }

          setSubmitting(false);
          router.push("/civil/barbending");
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
          console.log(errors);

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
              "barbendingItems",
              boqItems.map((w) => {
                const balanceQuantity =
                  w.quantity -
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
                  balanceQuantity,
                  totalQuantity: w.totalQuantity,
                  // unit: w.unit,
                  // unitrate: w.unitrate,
                  // nos: 0,
                  // length: 0,
                  // breadth: 0,
                  // height: 0,
                  // remarks: "",
                };
              })
            );
          }

          return (
            <form noValidate onSubmit={handleSubmit}>
              <Box sx={{ padding: "2rem" }}>
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
                  name="barbendingItems"
                  render={({ form, push, remove }) => {
                    const { barbendingItems } = form.values;
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
                            Work Items
                          </Typography>
                          <Button
                            color="secondary"
                            variant="contained"
                            onClick={() =>
                              push({
                                description: "",
                                diamark: 0,
                                noofequipments: 0,
                                costperequipment: 0,
                                a: 0,
                                b: 0,
                                c: 0,
                                d: 0,
                                e: 0,
                                f: 0,
                                g: 0,
                                h: 0,
                                remarks: "",
                              })
                            }
                          >
                            Add
                          </Button>
                        </Box>
                        {barbendingItems.map((item: any, index: number) => {
                          const totalcost = parseFloat(
                            (
                              item.noofequipments * item.costperequipment
                            ).toFixed(3)
                          );
                          const cuttinglength = parseFloat(
                            (
                              item.a +
                              item.b +
                              item.c +
                              item.d +
                              item.e +
                              item.f +
                              item.g +
                              item.h
                            ).toFixed(3)
                          );
                          const totalLength = parseFloat(
                            (totalcost * cuttinglength).toFixed(3)
                          );
                          const unitweight = parseFloat(
                            ((item.diamark * item.diamark) / 162.2).toFixed(3)
                          );
                          const totalweight = parseFloat(
                            (totalLength * unitweight).toFixed(3)
                          );
                          return (
                            <Grid container columnGap={8}>
                              <Grid item xs={12} sm={10}>
                                <FormInput
                                  name={`barbendingItems.${index}.description`}
                                  label="Description"
                                  placeHolder="Description"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              {barbendingItems.costperequipment > 1 && (
                                <Grid item xs={12} sm={1}>
                                  <IconButton
                                    sx={{
                                      mt: "2rem",
                                      ml: "1rem",
                                      color: "white",
                                      bgcolor: "red",
                                      ":hover": {
                                        bgcolor: "#e53935",
                                      },
                                    }}
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Grid>
                              )}

                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`barbendingItems.${index}.diamark`}
                                  label="Dia Mark"
                                  placeHolder="Dia Mark"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                  type="number"
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`barbendingItems.${index}.barmark`}
                                  label="Bar Mark"
                                  placeHolder="Bar Mark"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                  // type="number"
                                />
                              </Grid>

                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`barbendingItems.${index}.noofequipments`}
                                  label="No of Equipments"
                                  type="number"
                                  placeHolder="No of Equipments"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`barbendingItems.${index}.costperequipment`}
                                  label="Per Equipment"
                                  type="number"
                                  placeHolder="Per Equipment"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={1.2}>
                                <FormInput
                                  name={`barbendingItems.${index}.a`}
                                  label="A(M)"
                                  type="number"
                                  placeHolder="A(M)"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={1.2}>
                                <FormInput
                                  name={`barbendingItems.${index}.b`}
                                  label="B(M)"
                                  type="number"
                                  placeHolder="B(M)"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={1.2}>
                                <FormInput
                                  name={`barbendingItems.${index}.c`}
                                  label="C(M)"
                                  type="number"
                                  placeHolder="C(M)"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={1.2}>
                                <FormInput
                                  name={`barbendingItems.${index}.d`}
                                  label="D(M)"
                                  type="number"
                                  placeHolder="D(M)"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={1.2}>
                                <FormInput
                                  name={`barbendingItems.${index}.e`}
                                  label="E(M)"
                                  type="number"
                                  placeHolder="E(M)"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={1.2}>
                                <FormInput
                                  name={`barbendingItems.${index}.f`}
                                  label="F(M)"
                                  type="number"
                                  placeHolder="F(M)"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={1.2}>
                                <FormInput
                                  name={`barbendingItems.${index}.g`}
                                  label="G(M)"
                                  type="number"
                                  placeHolder="G(M)"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={1.2}>
                                <FormInput
                                  name={`barbendingItems.${index}.h`}
                                  label="H(M)"
                                  type="number"
                                  placeHolder="H(M)"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`barbendingItems.${index}.remarks`}
                                  label="Remarks"
                                  type="text"
                                  placeHolder="Enter Remarks"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput1
                                  label="Quantity"
                                  type="number"
                                  placeholder="Quantity"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                  value={totalweight}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput1
                                  label="Total Quantity"
                                  type="number"
                                  placeholder="Total Quantity"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                  value={item.totalQuantity}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput1
                                  label="Balance Quantity"
                                  type="number"
                                  placeholder="Balance Quantity"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                  value={
                                    item?.balanceQuantity -
                                    (Number(totalweight) || 0)
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Divider sx={{ my: 3 }} />
                              </Grid>
                            </Grid>
                          );
                        })}
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

export default AddBarBending;

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
  const barbending = await prisma.barBending.findUnique({
    where: { id: id as string },
    include: { barbendingItems: true, contractor: true },
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
      barbending,
      contractors,
      projects,
    },
  };
};
