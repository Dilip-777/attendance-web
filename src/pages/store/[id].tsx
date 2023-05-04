import { useEffect } from "react";
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
import { Contractor, Employee, StoreItem, Stores } from "@prisma/client";
import axios from "axios";
import shortid from "shortid";
import FormDate from "@/components/FormikComponents/FormDate";
import dayjs from "dayjs";
import MonthSelect from "@/ui-component/MonthSelect";
import SelectMonth from "@/components/FormikComponents/FormMonth";
import { IconButton, Stack } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";

const numberType = Yup.number().required("Required");

const StoreItem = Yup.object().shape({
  division: Yup.string().required("Required"),
  chargeableItemIssued: Yup.string().required("Required"),
  quantity: numberType,
  units: Yup.string().required("Required"),
  rate: numberType,
  chargeableamount: numberType.test(
    "calculateChargeableAmount",
    "Chargeable amount should be equal to rate multiplied by quantity",
    function (value) {
      const rate = this.resolve(Yup.ref("rate"));
      const quantity = this.resolve(Yup.ref("quantity"));
      const chargeableAmount = Number(rate) * Number(quantity);
      return value === chargeableAmount;
    }
  ),
});

const validationSchema = Yup.object().shape({
  contractorid: Yup.string().required("Required"),
  month: Yup.string().required("Required"),
  storeItems: Yup.array().of(StoreItem),
  totalamount: numberType.test(
    "sumOfChargeableAmounts",
    "Total amount should be equal to sum of chargeable amounts",
    function (value) {
      const { storeItems } = this.parent;
      const sumOfChargeableAmounts = storeItems.reduce(
        (acc: any, item: any) => acc + Number(item.chargeableamount || 0),
        0
      );
      return Number(value) === sumOfChargeableAmounts;
    }
  ),
});

export default function Edit({
  contractors,
  store,
  storeItems,
}: {
  contractors: Contractor[];
  store: Stores;
  storeItems: StoreItem[];
}) {
  const router = useRouter();

  const { id } = router.query;

  const initialValues = {
    contractorid: store?.contractorid || "",
    month: store?.month
      ? dayjs(store?.month, "MM/YYYY")
      : dayjs().format("MM/YYYY"),
    totalamount: store?.totalAmount || 0,
    storeItems:
      storeItems.length > 0
        ? storeItems.map((storeitem) => ({
            division: storeitem.division,
            chargeableItemIssued: storeitem.chargeableItemIssued,
            quantity: storeitem.quantity,
            units: storeitem.units,
            rate: storeitem.rate,
            chargeableamount: storeitem.chargeableamount,
          }))
        : [
            {
              division: "",
              chargeableItemIssued: "",
              quantity: 0,
              units: "",
              rate: 0,
              chargeableamount: 0,
            },
          ],
    // division: store?.division || "",
    // chargeableItemIssued: store?.chargeableItemIssued || "",
    // quantity: store?.quantity || 0,
    // units: store?.units || "",
    // rate: store?.rate || 0,
    // chargeableamount: store?.chargeableamount || 0,
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
            Add Stores
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
            const id = store ? store.id : shortid.generate();
            axios
              .post("/api/stores", {
                id: id,
                contractorid: values.contractorid,
                contractorName: contractors.find(
                  (c) => c.contractorId === values.contractorid
                )?.contractorname,
                month: values.month,
                totalAmount: values.totalamount,
                storeItems: values.storeItems.map((storeItem) => ({
                  id: shortid.generate(),
                  storeId: id,
                  division: storeItem.division,
                  chargeableItemIssued: storeItem.chargeableItemIssued,
                  quantity: storeItem.quantity,
                  units: storeItem.units,
                  rate: storeItem.rate,
                  chargeableamount: storeItem.chargeableamount,
                })),
              })
              .then((res) => {
                router.push("/store");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {({ handleSubmit, values, setFieldValue }) => {
            const totalamount = values.storeItems.reduce(
              (acc: any, item: any) => acc + Number(item.chargeableamount || 0),
              0
            );
            if (totalamount !== values.totalamount) {
              setFieldValue("totalamount", totalamount);
            }
            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={3} mt={2} container>
                  <Grid item xs={12} sm={6} lg={4}>
                    <FormSelect
                      name="contractorid"
                      label="Contractor Name*"
                      placeHolder="Contractor Name"
                      options={
                        contractors?.map((contractor) => ({
                          value: contractor.contractorId,
                          label: contractor.contractorname,
                        })) || []
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <SelectMonth
                      name="month"
                      label="Month*"
                      placeHolder="Select a month"
                      format="MM/YYYY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <FormInput
                      name="totalamount"
                      label="Total Amount*"
                      placeHolder="Total Amount"
                      type="number"
                    />
                  </Grid>
                </Grid>
                <FieldArray1 values={values} setFieldValue={setFieldValue} />
                {/* <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="chargeableItemIssued"
                      label="Chargeable Item Issued*"
                      placeHolder="Chargeable Item Issued"
                  
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="quantity"
                      label="Quantity*"
                      placeHolder="Enter the Quantity"
                  
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="division"
                      label="Division*"
                      placeHolder="Enter the Division"
                  
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="units"
                      label="Units*"
                      placeHolder="Enter the Units"
                  
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="rate"
                      label="Rate*"
                      placeHolder="Enter the Rate"
                  
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="chargeableamount"
                      label="Chargeable Amount*"
                      placeHolder="Enter the Chargeable Amount"
                  
                      type="number"
                    />
                  </Grid> */}

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
      name="storeItems"
      render={({ form, push, remove }) => {
        const { storeItems } = form.values;

        return (
          <>
            <Stack mb={2} spacing={0} ml={3}>
              <Stack justifyContent="space-between" direction="row">
                <Typography variant="h4">
                  Chargeable Items : {storeItems?.length || 0}
                </Typography>
              </Stack>
              {storeItems?.map((value: any, index: number) => {
                if (value.rate * value.quantity !== value.chargeableamount) {
                  setFieldValue(
                    `storeItems.${index}.chargeableamount`,
                    value.rate * value.quantity
                  );
                }
                return (
                  <Box key={index} p={2} borderRadius={8}>
                    <Grid
                      container
                      columns={12}
                      columnSpacing={2}
                      // spacing={{ xs: 1, sm: 1 }}
                    >
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`storeItems.${index}.chargeableItemIssued`}
                          label="Chargeable Item Issued*"
                          placeHolder="Chargeable Item Issued"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`storeItems.${index}.quantity`}
                          label="Quantity*"
                          placeHolder="Enter the Quantity"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`storeItems.${index}.division`}
                          label="Division*"
                          placeHolder="Enter the Division"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`storeItems.${index}.units`}
                          label="Units*"
                          placeHolder="Enter the Units"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`storeItems.${index}.rate`}
                          label="Rate*"
                          placeHolder="Enter the Rate"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`storeItems.${index}.chargeableamount`}
                          label="Chargeable Amount*"
                          placeHolder="Enter the Chargeable Amount"
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={12} px={10} pb={2}>
                        {storeItems.length > 1 && (
                          <Button
                            onClick={() => {
                              values.storeItems[index].chargeableItemIssued =
                                "";
                              values.storeItems[index].quantity = 0;
                              values.storeItems[index].division = "";
                              values.storeItems[index].units = "";
                              values.storeItems[index].rate = 0;
                              values.storeItems[index].chargeableamount = 0;
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
                    quantity: 0,
                    division: "",
                    units: "",
                    rate: 0,
                    chargeableamount: 0,
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

  const store = await prisma.stores.findUnique({
    where: {
      id: id as string,
    },
  });

  const storeItems = await prisma.storeItem.findMany({
    where: {
      storeId: id as string,
    },
  });

  return {
    props: {
      contractors,
      store,
      storeItems,
    },
  };
};
