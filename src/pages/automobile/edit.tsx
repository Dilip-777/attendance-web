import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  OutlinedInput,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { shouldForwardProp } from "@mui/system";
import { useEffect, useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik, useFormik, useFormikContext } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Automobile, Contractor, Workorder } from "@prisma/client";
import axios from "axios";
import FormDate from "@/components/FormikComponents/FormDate";
import FileUpload from "@/components/FormikComponents/FileUpload";
import TimeInput from "@/components/FormikComponents/TimeInput";
import dayjs from "dayjs";

const fileType = Yup.string().optional();

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required("Required"),
  // workorderId: Yup.string().required("Required"),
  date: Yup.string().required("Required"),
  openingMeterReading: Yup.number(),
  closingMeterReading: Yup.number(),
  startTime: Yup.string(),
  endTime: Yup.string(),
  totalRunning: Yup.number(),
  unit: Yup.string(),
  hsdIssuedOrConsumed: Yup.number(),
  mainetenaceTime: Yup.string(),
  breakdownTime: Yup.string(),
  breakDownDaysCounted: Yup.number(),
  reasonBehindBreakDown: Yup.string(),
  remarks: Yup.string(),
  status: Yup.string(),
  rejectionReason: Yup.string(),
});

export default function AddWordOrder({
  vehiclelogbook,
  contractors,
}: {
  vehiclelogbook: Automobile;
  contractors: Contractor[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    contractorId: vehiclelogbook?.contractorId || "",
    // workorderId: vehiclelogbook?.workorderId || "",
    date: vehiclelogbook?.date || "",
    openingMeterReading: vehiclelogbook?.openingMeterReading || "",
    closingMeterReading: vehiclelogbook?.closingMeterReading || "",
    startTime: vehiclelogbook?.startTime || "",
    endTime: vehiclelogbook?.endTime || "",
    totalRunning: vehiclelogbook?.totalRunning || "",
    unit: vehiclelogbook?.unit || "",
    hsdIssuedOrConsumed: vehiclelogbook?.hsdIssuedOrConsumed || "",
    mainetenaceTime: vehiclelogbook?.mainetenaceTime || "",
    breakdownTime: vehiclelogbook?.breakdownTime || "",
    breakDownDaysCounted: vehiclelogbook?.breakDownDaysCounted || "",
    reasonBehindBreakDown: vehiclelogbook?.reasonBehindBreakDown || "",
    remarks: vehiclelogbook?.remarks || "",
    status: vehiclelogbook?.status || "",
    rejectionReason: vehiclelogbook?.rejectionReason || "",
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
            Edit Vehicle Log Book
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            const month = dayjs(values.date).format("MM/YYYY");
            const body = { month, ...values };
            const res = await axios.post("/api/vehiclelogbook", body);
            setLoading(false);
          }}
        >
          {({ handleSubmit, values, errors }) => {
            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={6} mt={2} container>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="contractorId"
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
                    <FormDate
                      name="date"
                      label=" Date"
                      placeHolder="Enter the Date"
                      disabled={false}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="openingMeterReading"
                      label="Opening Meter Reading*"
                      placeHolder="Enter the Opening Meter Reading"
                      disabled={false}
                      type="number"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="closingMeterReading"
                      label="Closing Meter Reading*"
                      placeHolder="Enter the Closing Meter Reading"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TimeInput
                      name="startTime"
                      label="Start Time*"
                      placeHolder="Enter the Start Time"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TimeInput
                      name="endTime"
                      label="End Time*"
                      placeHolder="Enter the End Time"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="totalRunning"
                      label="Total Running*"
                      placeHolder="Enter the Total Running"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="unit"
                      label="Unit"
                      placeHolder="Unit"
                      options={[
                        { value: "day", label: "day" },
                        { value: "kms", label: "kms" },
                        { value: "hours", label: "hours" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="hsdIssuedOrConsumed"
                      label="HSD Issued/Consumed"
                      placeHolder="Enter the HSD Issued/Consumed"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TimeInput
                      name="mainetenaceTime"
                      label="Maintenance Time"
                      placeHolder="Enter the Maintenance Time"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TimeInput
                      name="breakdownTime"
                      label="Breakdown Time"
                      placeHolder="Enter the Breakdown Time"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="breakDownDaysCounted"
                      label="Breakdown Days Counted"
                      placeHolder="Enter the Breakdown Days Counted"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="reasonBehindBreakDown"
                      label="Reason Behind Breakdown"
                      placeHolder="Enter the Reason Behind Breakdown"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="remarks"
                      label="Remarks"
                      placeHolder="Remarks"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="status"
                      label="Status"
                      placeHolder="Status"
                      disabled={false}
                      options={[
                        { value: "Approved", label: "Approved" },
                        { value: "Rejected", label: "Rejected" },
                        { value: "Pending", label: "Pending" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="rejectionReason"
                      label="Rejection Reason"
                      placeHolder="Enter the Rejection Reason"
                      disabled={false}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ float: "right", mr: 10 }}
                  disabled={loading}
                >
                  Submit
                  {loading && (
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
  const { month, contractor } = context.query;
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

  const vehiclelogbook = await prisma.automobile.findFirst({
    where: {
      contractorId: contractor as string,
      date: {
        endsWith: month as string,
      },
    },
  });

  const contractors = await prisma.contractor.findMany();

  return {
    props: {
      vehiclelogbook,

      contractors,
    },
  };
};
