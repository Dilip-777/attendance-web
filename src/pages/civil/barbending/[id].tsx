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
  BarBending,
  BarBendingItem,
  Contractor,
  WorkItem,
  Works,
} from "@prisma/client";
import FormSelect from "@/components/FormikComponents/FormSelect";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";

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
  description: Yup.string().required("Required"),
  contractorid: Yup.string().required("Required"),
  barbendingItems: Yup.array().of(workItemSchema).required("Required"),
});

interface barbendingtypes extends BarBending {
  barbendingItems: BarBendingItem[];
  contractor: Contractor;
}

const AddBarBending = ({
  barbending,
  contractors,
  works,
}: {
  barbending: barbendingtypes;
  contractors: Contractor[];
  works: Works[];
}) => {
  const router = useRouter();
  //   const validationSchema = Yup.object().shape({
  //     workId: Yup.string().required("Required"),
  //     unit: Yup.string().required("Required"),
  //     diamark: Yup.number().required("Required"),
  //     description: Yup.string().required("Required"),
  //     noofequipments: Yup.number().required("Required"),
  //     costperequipment: Yup.number().required("Required"),
  //     a: Yup.number().required("Required"),
  //     b: Yup.number().required("Required"),
  //   });

  //   const initialValues = {
  //     workId: "",
  //     unit: "",
  //     diamark: 0,
  //     description: "",
  //     noofequipments: 0,
  //     costperequipment: 0,
  //     a: 0,
  //     b: 0,
  //   };

  const initialValues = {
    description: barbending?.description || "",
    contractorid: barbending?.contractorid || "",

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
        }))
      : [
          {
            barmark: "",
            diamark: 0,
            description: "",
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
          },
        ],
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
            barbendingItems.push({
              ...item,
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

          // const quantity =
          //   values.noofequipments * values.costperequipment * values.a * values.b;
          // const item = {
          //   ...values,
          //   quantity: parseFloat(quantity.toFixed(3)),
          // };

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

          // await axios.post("/api/works", {
          //   item,
          // });
          setSubmitting(false);
          router.push("/civil/barbending");
        }}
      >
        {({ errors, touched, isSubmitting, handleSubmit }) => {
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Box sx={{ padding: "2rem" }}>
                <Stack direction="row" columnGap={5}>
                  <FormSelect
                    name="contractorid"
                    label="Select Contractor"
                    placeHolder="Contractor"
                    sx={{ width: "100%", maxWidth: "100%" }}
                    options={contractors.map((barbending) => ({
                      value: barbending.contractorId,
                      label: barbending.contractorname,
                    }))}
                  />
                  <FormInput
                    name="description"
                    label="Description"
                    placeHolder="Description"
                    sx={{ width: "100%", maxWidth: "100%" }}
                  />
                </Stack>
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
                        {barbendingItems.map((item: any, index: number) => (
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
                                type="number"
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
                            <Grid item xs={12}>
                              <Divider sx={{ my: 3 }} />
                            </Grid>
                          </Grid>
                        ))}
                      </Stack>
                    );
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
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
  const contractors = await prisma.contractor.findMany();
  const works = await prisma.works.findMany({
    where: {
      id: {
        not: id as string,
      },
    },
  });
  return {
    props: {
      barbending,
      contractors,
      works,
    },
  };
};
