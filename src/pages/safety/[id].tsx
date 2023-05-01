import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import { useRouter } from "next/router";
// import {  useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { FieldArray, Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Employee, Safety, SafetyItem } from "@prisma/client";
import axios from "axios";
import shortid from "shortid";
import FormDate from "@/components/FormikComponents/FormDate";
import dayjs from "dayjs";
import MonthSelect from "@/ui-component/MonthSelect";
import SelectMonth from "@/components/FormikComponents/FormMonth";

const numberType = Yup.number().required("Required");

const SafetyItem = Yup.object().shape({
  division: Yup.string().required("Required"),
  chargeableItemIssued: Yup.string().required("Required"),
  penalty: Yup.string().required("Required"),
  netchargeableamount: numberType,
});

const validationSchema = Yup.object().shape({
  contractorid: Yup.string().required("Required"),
  month: Yup.string().required("Required"),
  safetyItems: Yup.array().of(SafetyItem),
  totalAmount: numberType.test(
    "sumOfChargeableAmounts",
    "Total amount should be equal to sum of chargeable amounts",
    function (value) {
      const { safetyItems } = this.parent;
      const sumOfChargeableAmounts = safetyItems.reduce(
        (acc: any, item: any) => acc + Number(item.netchargeableamount || 0),
        0
      );
      return Number(value) === sumOfChargeableAmounts;
    }
  ),
  // division: Yup.string().required("Required"),
  // chargeableItemIssued: Yup.string().required("Required"),
  // penalty: Yup.string().required("Required"),
  // netchargeableamount: numberType,
});

export default function Edit({
  contractors,
  safety,
  safetyItems,
}: {
  contractors: Contractor[];
  safety: Safety;
  safetyItems: SafetyItem[];
}) {
  const router = useRouter();

  const { id } = router.query;

  console.log("safetyItems", safetyItems);

  const initialValues = {
    contractorid: safety?.contractorid || "",
    month: safety?.month
      ? dayjs(safety?.month, "MM/YYYY")
      : dayjs().format("MM/YYYY"),
    // division: safety?.division || "",
    // chargeableItemIssued: safety?.chargeableItemIssued || "",
    // penalty: safety?.penalty || "",
    // netchargeableamount: safety?.netchargeableamount || 0,
    safetyItems:
      safetyItems.length > 0
        ? safetyItems.map((safetyItem) => ({
            division: safetyItem.division,
            chargeableItemIssued: safetyItem.chargeableItemIssued,
            penalty: safetyItem.penalty,
            netchargeableamount: safetyItem.netchargeableamount,
          }))
        : [
            {
              division: "",
              chargeableItemIssued: "",
              penalty: 0,
              netchargeableamount: 0,
            },
          ],
    totalAmount: safety?.totalAmount || 0,
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
            Add Safety
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const id = safety ? safety.id : shortid.generate();
            axios
              .post("/api/safety", {
                id: id,
                contractorid: values.contractorid,
                contractorName: contractors.find(
                  (c) => c.contractorId === values.contractorid
                )?.contractorname,
                month: values.month,
                totalAmount: values.totalAmount,
                safetyItems: values.safetyItems.map((safetyItem) => ({
                  id: shortid.generate(),
                  safetyId: id,
                  division: safetyItem.division,
                  chargeableItemIssued: safetyItem.chargeableItemIssued,
                  penalty: safetyItem.penalty,
                  netchargeableamount: safetyItem.netchargeableamount,
                })),
              })
              .then((res) => {
                router.push("/safety");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {({ handleSubmit, values, errors, setFieldValue }) => {
            // if (!errors.division) {
            //   const options1 = options.filter((option) =>
            //     option.chargeableItemIssued.includes(values.division)
            //   );
            //   setOptions(options1);
            // }
            const totalAmount = values.safetyItems.reduce(
              (acc: any, item: any) =>
                acc + Number(item.netchargeableamount || 0),
              0
            );

            if (totalAmount !== values.totalAmount) {
              setFieldValue("totalAmount", totalAmount);
            }

            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={6} mt={2} container>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
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
                  <Grid item xs={12} sm={6} md={4}>
                    <SelectMonth
                      name="month"
                      label="Month*"
                      placeHolder="Select a month"
                      disabled={false}
                      format="MM/YYYY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormInput
                      name="totalAmount"
                      label="Total Amount*"
                      placeHolder="Enter the Total Amount"
                      disabled={false}
                    />
                  </Grid>

                  <FieldArray1 setFieldValue={setFieldValue} values={values} />

                  {/* <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="division"
                      label="Division*"
                      placeHolder="Enter the Division"
                      disabled={false}
                    />
                   
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="penalty"
                      label="Chargeable Voilation*"
                      placeHolder="Enter the Chargeable Voilation"
                      disabled={false}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="netchargeableamount"
                      label="Net Chargeable Amount*"
                      placeHolder="Enter the Net Chargeable Amount"
                      disabled={false}
                      type="number"
                    />
                  </Grid> */}
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
      name="safetyItems"
      render={({ form, push, remove }) => {
        const { safetyItems } = form.values;

        return (
          <>
            <Stack mb={2} spacing={0}>
              <Stack justifyContent="space-between" direction="row">
                <Typography variant="h4">
                  Chargeable Items : {safetyItems?.length || 0}
                </Typography>
              </Stack>
              {safetyItems?.map((value: any, index: number) => {
                return (
                  <Box key={index} p={2} borderRadius={8}>
                    <Grid
                      container
                      columns={12}
                      // spacing={{ xs: 1, sm: 1 }}
                    >
                      <Grid item xs={12} sm={6} md={4}>
                        <FormInput
                          name={`safetyItems.${index}.chargeableItemIssued`}
                          label="Chargeable Item Issued*"
                          placeHolder="Chargeable Item Issued"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormInput
                          name={`safetyItems.${index}.division`}
                          label="Division*"
                          placeHolder="Enter the Division"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormInput
                          name={`safetyItems.${index}.penalty`}
                          label="Penalty*"
                          placeHolder="Enter the Penalty"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormInput
                          name={`safetyItems.${index}.netchargeableamount`}
                          label="Chargeable Amount*"
                          placeHolder="Enter the Chargeable Amount"
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={12} md={8} px={10} mt={"auto"} pb={2}>
                        {safetyItems.length > 1 && (
                          <Button
                            onClick={() => {
                              values.safetyItems[index].chargeableItemIssued =
                                "";
                              values.safetyItems[index].penalty = 0;
                              values.safetyItems[index].division = "";
                              values.safetyItems[index].netchargeableamount = 0;
                              remove(index);
                            }}
                            variant="contained"
                            color="error"
                            sx={{ float: "right" }}
                          >
                            Remove <Delete />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                    <Stack
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={3}
                    >
                      <Box display="flex" sx={{ alignSelf: "center" }}></Box>
                    </Stack>
                    <Divider />
                  </Box>
                );
              })}
              <IconButton
                onClick={() =>
                  push({
                    chargeableItemIssued: "",
                    penalty: 0,
                    division: "",
                    units: "",
                    rate: 0,
                    netchargeableamount: 0,
                  })
                }
                size="small"
                sx={{
                  bgcolor: "#2065D1",
                  alignSelf: "flex-start",
                  color: "white",
                  ":hover": { bgcolor: "#103996" },
                }}
              >
                <Add sx={{ color: "white" }} />
              </IconButton>
            </Stack>
          </>
        );
      }}
    />
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

  const safety = await prisma.safety.findUnique({
    where: {
      id: id as string,
    },
  });

  const safetyItems = await prisma.safetyItem.findMany();

  return {
    props: {
      contractors,
      safety,
      safetyItems,
    },
  };
};
