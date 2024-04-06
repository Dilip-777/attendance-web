import { useState } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Contractor, Vehicle } from "@prisma/client";
import FormInput from "@/components/FormikComponents/FormInput";
import prisma from "@/lib/prisma";
import FormSelect from "@/components/FormikComponents/FormSelect";
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";

const numberType = Yup.number().required("Required");

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required("Required"),
  vehicleNo: Yup.string().required("Required"),
  vehicleType: Yup.string().required("Required"),
  mileage: numberType,
  charges: numberType,
  paymentMode: Yup.string().required("Required"),
  paymentStructure: Yup.string().required("Required"),
  shiftduraion: numberType,
  maintenanceDaysAllowed: numberType,
  deployment: Yup.string().required("Required"),
  eligibleForOvertime: Yup.boolean(),
  hsdProvidedBy: Yup.string().required("Required"),
  hsdDeduction: Yup.boolean(),
  gst: numberType,
});

export default function AddVehicle({
  contractors,
  vehicle,
}: {
  contractors: Contractor[];
  vehicle: Vehicle | null;
}) {
  const router = useRouter();

  const initialValues = {
    contractorId: vehicle?.contractorId || "",
    vehicleNo: vehicle?.vehicleNo || "",
    vehicleType: vehicle?.vehicleType || "",
    mileage: vehicle?.mileage || 0,
    charges: vehicle?.charges || 0,
    paymentMode: vehicle?.paymentMode || "",
    paymentStructure: vehicle?.paymentStructure || "",
    shiftduraion: vehicle?.shiftduraion || 0,
    maintenanceDaysAllowed: vehicle?.maintenanceDaysAllowed || 0,
    deployment: vehicle?.deployment || "",
    eligibleForOvertime: vehicle?.eligibleForOvertime || false,
    hsdProvidedBy: vehicle?.hsdProvidedBy || "",
    hsdDeduction: vehicle?.hsdDeduction || false,
    gst: vehicle?.gst || 0,
  };

  return (
    <>
      <Paper
        sx={{
          height: "83.7vh",
          pt: "1rem",
          // pb: "4rem",
          px: "2rem",
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
          <Typography variant="h3" my="auto">
            {vehicle ? "Edit" : "Add"} Vehicle
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setErrors, setSubmitting }) => {
            setSubmitting(true);
            axios
              .post("/api/vehicle", {
                id: vehicle?.id,
                ...values,
              })
              .then((res) => {
                router.push("/vehicles");
              })
              .catch((err) => {
                console.error("Error:", err);
                // Handle error response
              });
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, values, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={12} sm={6} md={4}>
                  {/* Contractor Select */}
                  <AutoCompleteSelect
                    name="contractorId"
                    label="Contractor"
                    placeHolder="Select Contractor"
                    disabled={false}
                    options={contractors.map((contractor) => ({
                      value: contractor.contractorId,
                      label: contractor.contractorname,
                    }))}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  {/* Vehicle No Input */}
                  <FormInput
                    name="vehicleNo"
                    label="Vehicle Number"
                    placeHolder="Enter Vehicle Number"
                    disabled={false}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  {/* Vehicle Type Input */}
                  <FormInput
                    name="vehicleType"
                    label="Vehicle Type"
                    placeHolder="Enter Vehicle Type"
                    disabled={false}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  {/* Mileage Input */}
                  <FormInput
                    name="mileage"
                    label="Mileage"
                    placeHolder="Enter Mileage"
                    disabled={false}
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="charges"
                    label="Charges"
                    placeHolder="Enter Charges"
                    disabled={false}
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormSelect
                    name="paymentMode"
                    label="Payment Mode"
                    placeHolder="Select"
                    disabled={false}
                    options={[
                      { value: "monthly", label: "Monthly" },
                      { value: "hourly", label: "Hourly" },
                      { value: "daily", label: "Daily" },
                      { value: "trip", label: "Trip" },
                      { value: "km", label: "K.M" },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormSelect
                    name="paymentStructure"
                    label="Payment Structure"
                    placeHolder="Select"
                    disabled={false}
                    options={[
                      { value: "monthly", label: "Monthly" },
                      { value: "hourly", label: "Hourly" },
                      { value: "daily", label: "Daily" },
                      { value: "trip", label: "Trip" },
                      { value: "km", label: "K.M" },
                    ]}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="shiftduraion"
                    label="Shift Duration"
                    placeHolder="Enter Shift Duration"
                    disabled={false}
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="maintenanceDaysAllowed"
                    label="Allowed Maintenance Days"
                    placeHolder="Enter Allowed Maintenance Days"
                    disabled={false}
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  {/* Deployment Input */}
                  <FormInput
                    name="deployment"
                    label="Deployment"
                    placeHolder="Enter Deployment"
                    disabled={false}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormSelect
                    name="eligibleForOvertime"
                    label="Eligible For Overtime"
                    placeHolder="Select"
                    disabled={false}
                    options={[
                      { value: true, label: "Yes" },
                      { value: false, label: "No" },
                    ]}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="hsdProvidedBy"
                    label="HSD Provided By"
                    placeHolder="Enter HSD Provided By"
                    disabled={false}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormSelect
                    name="hsdDeduction"
                    label="HSD Deduction"
                    placeHolder="Select"
                    disabled={false}
                    options={[
                      { value: true, label: "Yes" },
                      { value: false, label: "No" },
                    ]}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="gst"
                    label="GST"
                    placeHolder="Enter GST"
                    disabled={false}
                    type="number"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 2 }}
                color="secondary"
              >
                Submit
                {isSubmitting && <CircularProgress size={15} />}
              </Button>
            </form>
          )}
        </Formik>
      </Paper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { id } = context.query;
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (session.user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: id as string,
    },
  });
  const contractors = await prisma.contractor.findMany({
    where: {
      servicedetail: "Equipment / Vehicle Hiring",
    },
  });

  return {
    props: {
      contractors,
      vehicle,
    },
  };
};
