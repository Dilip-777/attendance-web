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
import { Contractor, Employee, Stores } from "@prisma/client";
import axios from "axios";
import shortid from "shortid";
import FormDate from "@/components/FormikComponents/FormDate";
import dayjs from "dayjs";
import MonthSelect from "@/ui-component/MonthSelect";
import SelectMonth from "@/components/FormikComponents/FormMonth";

const numberType = Yup.number().required("Required");

const validationSchema = Yup.object().shape({
  contractorid: Yup.string().required("Required"),
  month: Yup.string().required("Required"),
  division: Yup.string().required("Required"),
  chargeableItemIssued: Yup.string().required("Required"),
  quantity: numberType,
  units: Yup.string().required("Required"),
  rate: numberType,
  chargeableamount: numberType,
});

export default function Edit({
  contractors,
  store,
}: {
  contractors: Contractor[];
  store: Stores;
}) {
  const router = useRouter();

  const { id } = router.query;
  console.log(contractors);

  const initialValues = {
    contractorid: store?.contractorid || "",
    month: store?.month
      ? dayjs(store?.month, "MM/YYYY")
      : dayjs().format("MM/YYYY"),
    division: store?.division || "",
    chargeableItemIssued: store?.chargeableItemIssued || "",
    quantity: store?.quantity || 0,
    units: store?.units || "",
    rate: store?.rate || 0,
    chargeableamount: store?.chargeableamount || 0,
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
            axios
              .post("/api/stores", {
                id: store ? store.id : shortid.generate(),
                contractorName: contractors.find(
                  (c) => c.contractorId === values.contractorid
                )?.contractorname,
                ...values,
              })
              .then((res) => {
                router.push("/store");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {({ handleSubmit, values, errors }) => {
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
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="chargeableItemIssued"
                      label="Chargeable Item Issued*"
                      placeHolder="Chargeable Item Issued"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="quantity"
                      label="Quantity*"
                      placeHolder="Enter the Quantity"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="division"
                      label="Division*"
                      placeHolder="Enter the Division"
                      disabled={false}
                    />
                    {/* <DesignationSelect chargeableItemIssued="qwe" /> */}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="units"
                      label="Units*"
                      placeHolder="Enter the Units"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="rate"
                      label="Rate*"
                      placeHolder="Enter the Rate"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="chargeableamount"
                      label="Chargeable Amount*"
                      placeHolder="Enter the Chargeable Amount"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
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

  return {
    props: {
      contractors,
      store,
    },
  };
};
