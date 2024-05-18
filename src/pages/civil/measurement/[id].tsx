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
  Contractor,
  MeasurementItem,
  Workorder,
  Measurement,
  Project,
} from "@prisma/client";
import FormSelect from "@/components/FormikComponents/FormSelect";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";

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
  description: Yup.string().required("Required"),
  contractorid: Yup.string().required("Required"),
  projectId: Yup.string().required("Required"),
  measurementItems: Yup.array().of(workItemSchema).required("Required"),
});

interface worktypes extends Measurement {
  measurementItems: MeasurementItem[];
  contractor: Contractor;
}

const Addworkitem = ({
  work,
  contractors,
  works,
  projects,
}: {
  work: worktypes;
  contractors: Contractor[];
  works: Measurement[];
  projects: Project[];
}) => {
  const router = useRouter();
  //   const validationSchema = Yup.object().shape({
  //     workId: Yup.string().required("Required"),
  //     unit: Yup.string().required("Required"),
  //     unitrate: Yup.number().required("Required"),
  //     description: Yup.string().required("Required"),
  //     nos: Yup.number().required("Required"),
  //     length: Yup.number().required("Required"),
  //     breadth: Yup.number().required("Required"),
  //     height: Yup.number().required("Required"),
  //   });

  //   const initialValues = {
  //     workId: "",
  //     unit: "",
  //     unitrate: 0,
  //     description: "",
  //     nos: 0,
  //     length: 0,
  //     breadth: 0,
  //     height: 0,
  //   };

  const initialValues = {
    description: work?.description || "",
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
        }))
      : [
          {
            unit: "",
            referenceWorkId: "",
            unitrate: 0,
            description: "",
            nos: 0,
            length: 0,
            breadth: 0,
            height: 0,
            remarks: "",
          },
        ],
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

            const valueofcurrentBill = parseFloat(
              (quantity * workItem.unitrate).toFixed(3)
            );
            const totalQuantity = quantity;
            const valueofTotalBill = valueofcurrentBill;
            measurementItems.push({
              ...workItem,
              quantity: parseFloat(quantity.toFixed(3)),
              valueofcurrentBill: parseFloat(valueofcurrentBill.toFixed(3)),
              totalQuantity: parseFloat(totalQuantity.toFixed(3)),
              valueofTotalBill: parseFloat(valueofTotalBill.toFixed(3)),
            });
          });

          console.log(measurementItems, values);

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

          // await axios.post("/api/works", {
          //   ...values,
          //   workItem,
          // });
          setSubmitting(false);
          router.push("/civil/measurement");
        }}
      >
        {({
          errors,
          touched,
          isSubmitting,
          handleSubmit,
          values,
          setFieldError,
          setFieldValue,
        }) => {
          if (
            projects.filter((w) => w.contractorId === values.contractorid)
              .length === 0 &&
            !errors.projectId
          ) {
            // errors.projectId = "No Work Order for this Contractor";
            setFieldError("projectId", "No Work Order for this Contractor");
          }

          // if (
          //   project.find(
          //     (w) =>
          //       w.id === values.projectId &&
          //       w.contractorId === values.contractorid
          //   ) &&
          //   !values.projectId
          // ) {
          //   setFieldValue("projectId", "");
          // }

          console.log(values);

          return (
            <form noValidate onSubmit={handleSubmit}>
              <Box sx={{ px: "2rem" }}>
                <Stack direction="row" columnGap={5}>
                  <FormSelect
                    name="contractorid"
                    label="Select Contractor"
                    placeHolder="Contractor"
                    sx={{ width: "100%", maxWidth: "100%" }}
                    options={contractors.map((work) => ({
                      value: work.contractorId,
                      label: work.contractorname,
                    }))}
                  />
                  <FormSelect
                    name="projectId"
                    label="Select Work Order"
                    placeHolder="Work Order"
                    sx={{ width: "100%", maxWidth: "100%" }}
                    options={projects
                      .filter((w) => w.contractorId === values.contractorid)
                      .map((work) => ({ value: work.id, label: work.name }))}
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
                            Work Items
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() =>
                              push({
                                description: "",
                                unit: "",
                                unitrate: 0,
                                nos: 0,
                                length: 0,
                                breadth: 0,
                                height: 0,
                                remarks: "",
                              })
                            }
                          >
                            Add
                          </Button>
                        </Box>
                        {measurementItems.map(
                          (workItem: any, index: number) => (
                            <Grid container columnGap={8}>
                              <Grid item xs={12} sm={10}>
                                <FormInput
                                  name={`measurementItems.${index}.description`}
                                  label="Description"
                                  placeHolder="Description"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              {measurementItems.length > 1 && (
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
                                <FormSelect
                                  name={`measurementItems.${index}.referenceWorkId`}
                                  label="References Work Id (Optional)"
                                  placeHolder="References Work Id (Optional)"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                  type="number"
                                  options={works.map((work) => ({
                                    value: work.id,
                                    label: work.description,
                                  }))}
                                />
                              </Grid>

                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`measurementItems.${index}.unit`}
                                  label="Unit"
                                  type="text"
                                  placeHolder="Unit"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`measurementItems.${index}.unitrate`}
                                  label="Unit Rate"
                                  placeHolder="Unit Rate"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                  type="number"
                                />
                              </Grid>

                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`measurementItems.${index}.nos`}
                                  label="Nos"
                                  type="number"
                                  placeHolder="Nos"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`measurementItems.${index}.length`}
                                  label="Length"
                                  type="number"
                                  placeHolder="Length"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`measurementItems.${index}.breadth`}
                                  label="Breadth"
                                  type="number"
                                  placeHolder="Breadth"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`measurementItems.${index}.height`}
                                  label="Height"
                                  type="number"
                                  placeHolder="Height"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5} md={4} lg={3}>
                                <FormInput
                                  name={`measurementItems.${index}.remarks`}
                                  label="Remarks"
                                  placeHolder="Remarks"
                                  sx={{ width: "100%", maxWidth: "100%" }}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Divider sx={{ my: 3 }} />
                              </Grid>
                            </Grid>
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
  const contractors = await prisma.contractor.findMany();
  const projects = await prisma.project.findMany();
  return {
    props: {
      work,
      contractors,
      works,
      projects,
    },
  };
};
