// import {
//   Box,
//   Button,
//   Divider,
//   Grid,
//   Paper,
//   Stack,
//   Typography,
// } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import FileUpload from "@/components/FormikComponents/FileUpload";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor } from "@prisma/client";
import { CircularProgress } from "@mui/material";
import FormDate from "@/components/FormikComponents/FormDate";
import dayjs from "dayjs";
// import { Contractor } from "@prisma/client"

const fileType = Yup.string().optional();

const stringtype = Yup.string().required("Required").optional();

const numberType = Yup.number().transform((value, originalValue) => {
  return originalValue !== "" ? null : value;
});

const mobilenumbertype = Yup.string().matches(
  /^(?:\+91[1-9]\d{9}|0[1-9]\d{9}|[1-9]\d{9})$/,
  "Please enter a valid mobile number"
);

const validationSchema = Yup.object().shape({
  contractorname: Yup.string()
    .required("Required")
    .matches(/^[A-Za-z .]+$/, "Please enter only letters and spaces"),
  contractorId: Yup.string().required("Required"),
  servicedetail: Yup.string().required("Required"),
  supplierdetail: Yup.string().required("Required"),
  businessdetaildocument: fileType,
  uploadutilitybill: fileType,
  officeaddress: Yup.string().required("Required"),
  contactperson: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  telephonenumber: mobilenumbertype,
  mobilenumber: mobilenumbertype.required("Mobile number is required"),
  emailid: stringtype.email("Please enter a valid email address"),
  website: stringtype.url("Please enter a valid website URL"),
  expirationDate: stringtype,
  servicecharge: Yup.number().required("Rquired"),
  bankaccountnumber: stringtype.required("Required"),
  ifscno: stringtype.required("Required"),
  pancardno: stringtype,
  areaofwork: stringtype,
  beneficialname: stringtype,
  gstin: stringtype,
  typeofcontractor: stringtype,
  strategicbusinessunit: stringtype,
  // Organsiation Details
  organisationtype: stringtype,
  dateofincorporation: stringtype,
  associationwithcompetitor: stringtype,
  memorandam_of_associate: fileType,
  listofdirector: fileType,
  profileofkeyperson: fileType,
  competitorname: stringtype.matches(
    /^[A-Za-z ]+$/,
    "Please enter only letters and spaces"
  ),
  isocertified: stringtype,
  turnoverlastyear: stringtype,
  turnover2yearback: stringtype,
  uploadbranchdetail: fileType,
  uploadreturndetail: fileType,
  uniquenumber: numberType.nullable().optional(),
  registration_number: numberType.nullable().optional(),
  first_registration_number: numberType.nullable().optional(),
  latest_mnth_gst1_filed: stringtype,
  latest_mnth_gst2b_filed: stringtype,
  comply_regulatory: stringtype,
  upload_registration_cert: fileType,
  upload_licence1: fileType,
  upload_licence2: fileType,
  code_of_proprietor: stringtype,
  //Service / Product Details
  list_major_product: stringtype,
  qualty_control_procedure: stringtype,
  valueadd_product: stringtype,
  five_strength_points: stringtype,
  weakness: stringtype,
  selection_training_method: stringtype,
  delivery_procedure: stringtype,
  clientele: stringtype,
  // Reference Details
  reference_organistaion_1: stringtype,
  reference_contact_person_1: stringtype,
  reference_designation_1: stringtype,
  reference_contact_1: stringtype,
  period_of_service_1: stringtype,
  reference_organistaion_2: stringtype,
  reference_contact_person_2: stringtype,
  reference_designation_2: stringtype,
  reference_contact_2: stringtype,
  period_of_service_2: stringtype,
  reference_organistaion_3: stringtype,
  reference_contact_person_3: stringtype,
  reference_designation_3: stringtype,
  reference_contact_3: stringtype,
  period_of_service_3: stringtype,
  upload_list_ofclientele: fileType,
  upload_certificate_services: fileType,
  upload_doc1: fileType,
  upload_doc2: fileType,
});

export default function EditContractor({
  contractor,
}: {
  contractor: Contractor;
}) {
  const router = useRouter();
  // const [contractor, setContractor] = useState<Contractor || null>()
  // const [value, setValue] = useState("");
  const { id } = router.query;

  console.log(contractor);

  const initialValues = {
    contractorname: contractor?.contractorname || "",
    contractorId: contractor?.contractorId || "",
    servicedetail: contractor?.servicedetail || "",
    supplierdetail: contractor?.supplierdetail || "",
    businessdetaildocument: undefined,
    uploadutilitybill: undefined,
    officeaddress: contractor?.officeaddress || "",
    contactperson: contractor?.contactperson || "",
    designation: contractor?.designation || "",
    telephonenumber: contractor?.telephonenumber || "",
    mobilenumber: contractor?.mobilenumber || 0,
    emailid: contractor?.emailid || "",
    website: contractor?.website || "",
    pancardno: contractor?.pancardno || "",
    areaofwork: contractor?.areaofwork || "",
    expirationDate: contractor?.expirationDate || "",
    servicecharge: contractor?.servicecharge || 0,
    bankaccountnumber: contractor?.bankaccountnumber || "",
    ifscno: contractor?.ifscno || "",
    beneficialname: contractor?.beneficialname || "",
    gstin: contractor?.gstin || "",
    typeofcontractor: contractor?.typeofcontractor || "",
    strategicbusinessunit: contractor?.strategicbusinessunit || "",

    organisationtype: contractor?.organisationtype || "",
    dateofincorporation: contractor?.dateofincorporation || "",
    associationwithcompetitor: contractor?.associationwithcompetitor || "",
    memorandam_of_associate: undefined,
    listofdirector: undefined,
    profileofkeyperson: undefined,
    competitorname: contractor?.competitorname || "",
    isocertified: contractor?.isocertified || "",
    turnoverlastyear: contractor?.turnoverlastyear || "",
    turnover2yearback: contractor?.turnover2yearback || "",
    uploadbranchdetail: undefined,
    uploadreturndetail: undefined,
    uniquenumber: contractor?.uniquenumber || "",
    registration_number: contractor?.registration_number || "",
    first_registration_number: contractor?.first_registration_number || "",
    latest_mnth_gst1_filed: contractor?.latest_mnth_gst1_filed || "",
    latest_mnth_gst2b_filed: contractor?.latest_mnth_gst2b_filed || "",
    comply_regulatory: contractor?.comply_regulatory || "",
    upload_registration_cert: undefined,
    upload_licence1: undefined,
    upload_licence2: undefined,
    code_of_proprietor: contractor?.code_of_proprietor || "",
    list_major_product: contractor?.list_major_product || "",
    qualty_control_procedure: contractor?.qualty_control_procedure || "",
    valueadd_product: contractor?.valueadd_product || "",
    five_strength_points: contractor?.five_strength_points || "",
    weakness: contractor?.weakness || "",
    selection_training_method: contractor?.selection_training_method || "",
    delivery_procedure: contractor?.delivery_procedure || "",
    clientele: contractor?.clientele || "",
    reference_organistaion_1: contractor?.reference_organistaion_1 || "",
    reference_contact_person_1: contractor?.reference_contact_person_1 || "",
    reference_designation_1: contractor?.reference_designation_1 || "",
    reference_contact_1: contractor?.reference_contact_1 || "",
    period_of_service_1: contractor?.period_of_service_1 || "",
    reference_organistaion_2: contractor?.reference_organistaion_2 || "",
    reference_contact_person_2: contractor?.reference_contact_person_2 || "",
    reference_designation_2: contractor?.reference_designation_2 || "",
    reference_contact_2: contractor?.reference_contact_2 || "",
    period_of_service_2: contractor?.period_of_service_2 || "",
    reference_organistaion_3: contractor?.reference_organistaion_3 || "",
    reference_contact_person_3: contractor?.reference_contact_person_3 || "",
    reference_designation_3: contractor?.reference_designation_3 || "",
    reference_contact_3: contractor?.reference_contact_3 || "",
    period_of_service_3: contractor?.period_of_service_3 || "",
    upload_list_ofclientele: undefined,
    upload_certificate_services: undefined,
    upload_doc1: undefined,
    upload_doc2: undefined,
  };

  return (
    <>
      <Paper
        sx={{
          height: { sm: "80vh", md: "82.2vh", xl: "83.7vh" },
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
            Add Contractor
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setErrors, setSubmitting }) => {
            const {
              associationwithcompetitor,
              isocertified,
              comply_regulatory,
              telephonenumber,
              mobilenumber,
              uniquenumber,
              registration_number,
              first_registration_number,
              ...otherValues
            } = values;
            if (contractor) {
              setSubmitting(true);
              await axios
                .put("/api/hr/contractors", {
                  id: id,
                  ...otherValues,
                  gstin: String(values.gstin),
                  associationwithcompetitor:
                    associationwithcompetitor === "Yes" ? true : false,
                  isocertified: isocertified === "Yes" ? true : false,
                  comply_regulatory: comply_regulatory === "Yes" ? true : false,
                  telephonenumber: String(telephonenumber),
                  mobilenumber: String(mobilenumber),
                  uniquenumber: String(uniquenumber),
                  registration_number: String(registration_number),
                  first_registration_number: String(first_registration_number),
                })
                .then((res) => {
                  router.push("/contractors");
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            await axios
              .post("/api/hr/contractors", {
                ...otherValues,
                associationwithcompetitor:
                  associationwithcompetitor === "Yes" ? true : false,
                isocertified: isocertified === "Yes" ? true : false,
                comply_regulatory: comply_regulatory === "Yes" ? true : false,
                telephonenumber: String(telephonenumber),
                mobilenumber: String(mobilenumber),
                uniquenumber: String(uniquenumber),
                registration_number: String(registration_number),
                first_registration_number: String(first_registration_number),
              })
              .then((res) => {
                router.push("/contractors");
              })
              .catch((err) => {
                if (err?.response?.data?.error === "contractorId") {
                  setErrors({ contractorId: "Contractor Id already exists" });
                }
              });
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, errors, values, isSubmitting }) => {
            return (
              <form noValidate onSubmit={handleSubmit}>
                <Stack spacing={0}>
                  <Typography variant="h5" ml={1} mt={2}>
                    General
                  </Typography>
                  <Grid
                    columnSpacing={3}
                    ml={{ xs: 0, sm: 2, lg: 0 }}
                    container
                  >
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="contractorId"
                        label="Contractor Id*"
                        placeHolder="Enter the Contractor Id"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="contractorname"
                        label="Contractor Name*"
                        placeHolder="Enter the Contractor Name"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="servicedetail"
                        label="Service Detail*"
                        placeHolder="Enter Service Detail"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="supplierdetail"
                        label="Supplier Detail*"
                        placeHolder="Enter Supplier Detail"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="officeaddress"
                        label="Office Address*"
                        placeHolder="Enter Office Address"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="contactperson"
                        label="Contact Person*"
                        placeHolder="Contact Person"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="designation"
                        label="Designation*"
                        placeHolder="Enter Designation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="telephonenumber"
                        label="Telephone Number"
                        placeHolder="Enter Telephone Number"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="mobilenumber"
                        label="Mobile Number*"
                        placeHolder="Enter Mobile Number"
                        disabled={false}
                        // type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="emailid"
                        label="Email"
                        placeHolder="Enter Email"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="website"
                        label="Website"
                        placeHolder="Enter Website"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormDate
                        name="expirationDate"
                        label="Expiration Date*"
                        placeHolder="Enter Expiration Date"
                        disabled={false}
                        minDate={dayjs()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="servicecharge"
                        label="Service Charge*"
                        placeHolder="Enter the Service Charge"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="pancardno"
                        label="Pan Card Number*"
                        placeHolder="Enter Pan Card Number"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="areaofwork"
                        label="Area of Work*"
                        placeHolder="Enter Area of Work"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="bankaccountnumber"
                        label="Bank Account Number*"
                        placeHolder="Enter Bank Account Number"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="ifscno"
                        label="IFSC Code*"
                        placeHolder="Enter IFSC Code"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="beneficialname"
                        label="Beneficial Name*"
                        placeHolder="Enter Beneficial Name"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="gstin"
                        label="GSTIN*"
                        placeHolder="Enter GSTIN"
                        disabled={false}
                        // type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="typeofcontractor"
                        label="Type of Contractor*"
                        placeHolder="Enter Type of Contractor"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="strategicbusinessunit"
                        label="Strategic Business Unit*"
                        placeHolder="Enter Strategic Business Unit"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="businessdetaildocument"
                        label="Business Details Document"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="uploadutilitybill"
                        label="Upload Utility Bill"
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />
                <Stack spacing={0}>
                  <Typography variant="h5" ml={1} mt={2}>
                    Organisation
                  </Typography>

                  <Grid ml={{ xs: 0, sm: 4 }} mt={2} container>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormSelect
                        name="organisationtype"
                        label="Organisation Type"
                        placeHolder="Select a Organisation Type"
                        options={[
                          {
                            value: "Public Limited Company",
                            label: "Public Limited Company",
                          },
                          {
                            value: "Private Limited Company",
                            label: "Private Limited Company",
                          },
                          {
                            value: "Partnership Firm",
                            label: "Partnership Firm",
                          },
                          {
                            value: "Sole Proprietorship",
                            label: "Sole Proprietorship",
                          },
                          { value: "Others", label: "Others" },
                        ]}
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormDate
                        name="dateofincorporation"
                        label="Date of Incorporation"
                        placeHolder="Date of Incorporation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormSelect
                        name="associationwithcompetitor"
                        label="Are you an associative member of any organisation?"
                        placeHolder="Association with Competitor"
                        disabled={false}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="memorandam_of_associate"
                        label="Memorandum of Associate"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="listofdirector"
                        label="List of Directors"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="profileofkeyperson"
                        label="Profile of Key Person"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="competitorname"
                        label="Competitor Name"
                        placeHolder="Enter Competitor Name"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormSelect
                        name="isocertified"
                        label="ISO Certified"
                        placeHolder="ISO Certified"
                        disabled={false}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="turnoverlastyear"
                        label="What is Turnover of Last Year"
                        placeHolder="Turnover Last Year"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="turnover2yearback"
                        label="What is Turnover of 2nd Last Year"
                        placeHolder="Turnover 2nd Last Year"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="uploadbranchdetail"
                        label="Branch Detail"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="uploadreturndetail"
                        label="Return Detail"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="uniquenumber"
                        label="Unique Number"
                        placeHolder="Enter Unique Number"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="registration_number"
                        label="Registration Number"
                        placeHolder="Enter your Registration Number"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="first_registration_number"
                        label="Fist Registration Number"
                        placeHolder="Enter your Fist Registration Number"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="latest_mnth_gst1_filed"
                        label="Latest Month GST 1 Filed"
                        placeHolder="Latest Month GST 1 Filed"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="latest_mnth_gst2b_filed"
                        label="Latest Month GST 2 Filed"
                        placeHolder="Latest Month GST 2 Filed"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormSelect
                        name="comply_regulatory"
                        label="Comply Regulatory"
                        placeHolder="Comply Regulatory"
                        disabled={false}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="upload_registration_cert"
                        label="Registration Certificate"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload name="upload_licence1" label="License1" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload name="upload_licence2" label="License2" />
                    </Grid>

                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="code_of_proprietor"
                        label="Code No of Proprietor"
                        placeHolder="Code no of Proprietor"
                        disabled={false}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />
                <Stack spacing={0} mt={4}>
                  <Typography variant="h5" ml={1} my="auto">
                    Service / Product Details
                  </Typography>
                  <Grid ml={{ xs: 0, sm: 4 }} mt={0} container>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="list_major_product"
                        label="List Major Products"
                        placeHolder="Enter the List of Major Product"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="qualty_control_procedure"
                        label="What are your Quality Control Procedure"
                        placeHolder="Enter your Quality Control Procedure"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="valueadd_product"
                        label="What value add product can you provide?"
                        placeHolder="Enter your value add product"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="five_strength_points"
                        label="What are your five strength points?"
                        placeHolder="Enter your five strength points"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="weakness"
                        label="What are your five weakness points?"
                        placeHolder="Enter your five weakness points"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="selection_training_method"
                        label="What is your selection and training method?"
                        placeHolder="Enter your selection and training method"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="delivery_procedure"
                        label="What is your delivery procedure?"
                        placeHolder="Enter your delivery procedure"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="clientele"
                        label="What is your clientele?"
                        placeHolder="Enter your clientele"
                        disabled={false}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />
                <Stack spacing={0} mt={4}>
                  <Typography variant="h5" ml={1} my="auto">
                    Reference Details
                  </Typography>
                  <Grid ml={{ xs: 0, sm: 4 }} mt={2} container>
                    <Grid item xs={12}>
                      <Typography>Organisation1:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_organistaion_1"
                        label="Reference Organisation"
                        placeHolder="Enter your Reference Organisation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_contact_person_1"
                        label="Reference Contact Person"
                        placeHolder="Enter your Reference Contact Person"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_designation_1"
                        label="Reference Designation"
                        placeHolder="Enter your Reference Designation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_contact_1"
                        label="Reference Contact"
                        placeHolder="Enter your Reference Contact"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="period_of_service_1"
                        label="Period of Service"
                        placeHolder="Enter your Period of Service"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Organisation2</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_organistaion_2"
                        label="Reference Organisation"
                        placeHolder="Enter your Reference Organisation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_contact_person_2"
                        label="Reference Contact Person"
                        placeHolder="Enter your Reference Contact Person"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_designation_2"
                        label="Reference Designation"
                        placeHolder="Enter your Reference Designation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_contact_2"
                        label="Reference Contact"
                        placeHolder="Enter your Reference Contact"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="period_of_service_2"
                        label="Period of Service"
                        placeHolder="Enter your Period of Service"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Organisation3</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_organistaion_3"
                        label="Reference Organisation"
                        placeHolder="Enter your Reference Organisation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_contact_person_3"
                        label="Reference Contact Person"
                        placeHolder="Enter your Reference Contact Person"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_designation_3"
                        label="Reference Designation"
                        placeHolder="Enter your Reference Designation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="reference_contact_3"
                        label="Reference Contact"
                        placeHolder="Enter your Reference Contact"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormInput
                        name="period_of_service_3"
                        label="Period of Service"
                        placeHolder="Enter your Period of Service"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="upload_list_ofclientele"
                        label="Upload List of Clientele"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload
                        name="upload_certificate_services"
                        label="Upload Certificate of Services"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload name="upload_doc1" label="Upload Document1" />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FileUpload name="upload_doc2" label="Upload Document2" />
                    </Grid>
                  </Grid>
                </Stack>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ float: "right", mr: 10 }}
                  disabled={isSubmitting}
                >
                  Submit
                  {isSubmitting && (
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
  const { id } = context.query;
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
      id: session?.user?.id as string,
    },
  });

  const contractor = await prisma.contractor.findUnique({
    where: {
      id: id as string,
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

  return {
    props: {
      contractor,
    },
  };
};
