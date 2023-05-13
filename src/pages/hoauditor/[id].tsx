import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import FileUpload from "@/components/FormikComponents/FileUpload";
import axios from "axios";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { Contractor } from "@prisma/client";
import FormDate from "@/components/FormikComponents/FormDate";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Dayjs } from "dayjs";
// import { Contractor } from "@prisma/client"

const fileType = Yup.string().optional();

const validationSchema = Yup.object().shape({
  contractorname: Yup.string().required("Required"),
  workDescription: Yup.string().required("Required"),
  invoiceNo: Yup.string().required("Required"),
  uploadDoc1: fileType,
  uploadDoc2: fileType,
  date: Yup.string().required("Required"),
  monthOfInvoice: Yup.string().required("Required"),
  fromDate: Yup.string().required("Required"),
  toDate: Yup.string().required("Required"),
  basicbillamount: Yup.number().required("Required"),
  firstbillormonthly: Yup.string().required("Required"),
  serviceCharges: Yup.number().required("Required"),
  // Organsiation Details
  totalbillAmount: Yup.number().required("Required"),
  gst: Yup.number().required("Required"),
  netbillAmount: Yup.number().required("Required"),
  uploadDoc4: fileType,
  uploadDoc3: fileType,
  uploadDoc5: fileType,
  bankDetails: Yup.string().required("Required"),
  onetimeInvoice: Yup.boolean().required("Required"),
  verifiedComplainces: Yup.boolean().required("Required"),
  workOrderAvailable: Yup.boolean().required("Required"),
  licensesInPlace: Yup.boolean().required("Required"),
  previousMonthPayReceived: Yup.boolean().required("Required"),
  previousPayVerified: Yup.boolean().required("Required"),
  detailsSentToAuditAndHo: Yup.boolean().required("Required"),
  gstChallanAttached: Yup.boolean().required("Required"),
  //Service / Product Details
  deductions: Yup.string().required("Required"),
  variationsInManpower: Yup.string().required("Required"),
  manchineOrRegisterMode: Yup.string().required("Required"),
  uploadDoc6: fileType,
});

export default function HoAuditorForm({
  contractor,
}: {
  contractor: Contractor;
}) {
  const router = useRouter();
  // const [contractor, setContractor] = useState<Contractor || null>()
  const [value, setValue] = useState("");
  const [value1, setValue1] = useState<string | null>("");
  const { id } = router.query;

  const initialValues = {
    contractorname: contractor.contractorname || "",
    workDescription: "",
    invoiceNo: "",
    uploadDoc1: undefined,
    uploadDoc2: undefined,
    date: undefined,
    monthOfInvoice: "",
    fromDate: undefined,
    toDate: undefined,
    basicbillamount: 0,
    firstbillormonthly: "",
    serviceCharges: 0,
    totalbillAmount: 0,
    gst: 0,
    netbillAmount: 0,
    uploadDoc4: undefined,
    uploadDoc3: undefined,
    uploadDoc5: undefined,
    bankDetails: "",
    onetimeInvoice: false,
    verifiedComplainces: false,
    workOrderAvailable: false,
    licensesInPlace: false,
    previousPayVerified: false,
    previousMonthPayReceived: false,
    detailsSentToAuditAndHo: false,
    gstChallanAttached: false,
    deductions: "",
    variationsInManpower: "",
    manchineOrRegisterMode: "",
    uploadDoc6: undefined,
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
            HO Commercial Form
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await axios
              .post("/api/hoauditor", {
                ...values,
                contractorId: contractor?.id,
              })
              .then((res) => {
                router.push("/hoauditor");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {({ handleSubmit, errors, values }) => {
            return (
              <form noValidate onSubmit={handleSubmit}>
                <Stack spacing={0}>
                  <Typography variant="h4" ml={4} my={3}>
                    Kindly Provide the details required below.
                  </Typography>
                  <Grid ml={{ xs: 0, sm: 2, md: 6 }} container>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="contractorname"
                        label="Contractor Name*"
                        placeHolder="Enter the Contractor Name"
                        disabled={false}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="workDescription"
                        label="Work Description*"
                        placeHolder="Enter Work Description"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="invoiceNo"
                        label="Invoice No*"
                        placeHolder="Enter Invoice No"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormDate
                        name="date"
                        label="Date of Invoice"
                        placeHolder="Enter the date"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormDate
                        name="monthOfInvoice"
                        label="Month Of Invoice*"
                        placeHolder="Month Of Invoice"
                        disabled={false}
                        // views={["month", "year"]}
                        views={["year", "month"]}
                        format="MM/YYYY"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormDate
                        name="fromDate"
                        label="From Date*"
                        placeHolder="Enter the From Date"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormDate
                        name="toDate"
                        label="To Date"
                        placeHolder="Enter the To Date"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="basicbillamount"
                        label="Basic Bill Amount*"
                        placeHolder="Enter Basic Bill Amount"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="firstbillormonthly"
                        label="Whether First Bill Or Regular Monthly*"
                        placeHolder="Select First Bill Or Regular Monthly"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="serviceCharges"
                        label="Service Charges*"
                        placeHolder="Enter Service Charges"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="totalbillAmount"
                        label="Total Bill Amount*"
                        placeHolder="Enter the Total Bill Amount"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="gst"
                        label="GST*"
                        placeHolder="GST"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="netbillAmount"
                        label="Net Bill Amount*"
                        placeHolder="Enter the Net Bill Amount"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="bankDetails"
                        label="Bank Details Available On Bill*"
                        placeHolder="Enter the Bank Details Available On Bill"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="uploadDoc1" label="Upload Document 1" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="uploadDoc2" label="Upload Document 2" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="uploadDoc3" label="Upload Document 3" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="uploadDoc4" label="Upload Document 4" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="uploadDoc5" label="Upload Document 5" />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />
                <Stack spacing={0}>
                  <Typography variant="h4" ml={4} my={4}>
                    Kindly Select Yes or No for the following fields
                  </Typography>

                  <Grid ml={{ xs: 0, sm: 2, md: 6 }} mt={2} container>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name="onetimeInvoice"
                        label="Whether One Time Invoice*"
                        placeHolder="Select One Time Invoice or Not"
                        disabled={false}
                        options={[
                          { value: true, label: "Yes" },
                          { value: false, label: "No" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name="verifiedComplainces"
                        label="Verified for Compliances or not*"
                        placeHolder="Turnover Last Year"
                        disabled={false}
                        options={[
                          { value: true, label: "Yes" },
                          { value: false, label: "No" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name="workOrderAvailable"
                        label="Word Order Available or Not*"
                        placeHolder="Word Order Available or Not"
                        disabled={false}
                        options={[
                          { value: true, label: "Yes" },
                          { value: false, label: "No" },
                        ]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name="licensesInPlace"
                        label="Labour Licenses & Other Licenses in Place or Not*"
                        placeHolder="Labour Licenses & Other Licenses in Place or Not"
                        disabled={false}
                        options={[
                          { value: true, label: "Yes" },
                          { value: false, label: "No" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name="previousMonthPayReceived"
                        label="Previous Month Pay received or Not*"
                        placeHolder="Previous Month Pay received or Not"
                        disabled={false}
                        options={[
                          { value: true, label: "Yes" },
                          { value: false, label: "No" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name="previousPayVerified"
                        label="Previous Month Pay Register Checked Or Verified With Previous Month*"
                        placeHolder="Select a option"
                        disabled={false}
                        options={[
                          { value: true, label: "Yes" },
                          { value: false, label: "No" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name="detailsSentToAuditAndHo"
                        label="Details of variations sent to audit and HO*"
                        placeHolder="Details of variations sent to audit and HO"
                        disabled={false}
                        options={[
                          { value: true, label: "Yes" },
                          { value: false, label: "No" },
                        ]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name="gstChallanAttached"
                        label="Whether GST Challa of Previous Month Attached?*"
                        placeHolder="Select a option"
                        disabled={false}
                        options={[
                          { value: true, label: "Yes" },
                          { value: false, label: "No" },
                        ]}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />
                <Stack spacing={0} mt={4}>
                  <Typography variant="h4" ml={4} my="auto">
                    Kindly Provide the information required and suitable reasons
                    for the same if any.
                  </Typography>
                  <Grid ml={{ xs: 0, sm: 2, md: 6 }} mt={0} container>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="deductions"
                        label="Deductions"
                        placeHolder="Enter the Deductions"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="variationsInManpower"
                        label="Variations in Manpower"
                        placeHolder="Enter the Variations in Manpower"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="manchineOrRegisterMode"
                        label="Whether Machine or Register Attendance Mode Adopted?*"
                        placeHolder="Enter whether Machine or Register Mode"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="uploadDoc6" label="Upload Document 6" />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />

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
  const { id } = context.query;
  const contractor = await prisma.contractor.findUnique({
    where: {
      id: id as string,
    },
  });
  return {
    props: {
      contractor,
    },
  };
};
