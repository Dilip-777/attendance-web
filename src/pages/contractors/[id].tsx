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
import { Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import FileUpload from "@/components/FormikComponents/FileUpload";

const fileType = Yup.mixed()
  .test("fileType", "Invalid file type", (value) => {
    if (!value) return true;
    return value instanceof File;
  })
  .required("Required");

const validationSchema = Yup.object().shape({
  contractorName: Yup.string().required("Required"),
  servicedetail: Yup.string().required("Required"),
  supplierdetail: Yup.string().required("Required"),
  businessdetaildocument: fileType,
  uploadutilitybill: fileType,
  officeaddress: Yup.string().required("Required"),
  contactperson: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  telephonenumber: Yup.number()
    .transform((value, originalValue) => {
      if (isNaN(parseInt(originalValue))) {
        return undefined;
      }
      return value;
    })
    .required("Required"),
  mobilenumber: Yup.number()
    .transform((value, originalValue) => {
      if (isNaN(parseInt(originalValue))) {
        return undefined;
      }
      return value;
    })
    .required("Required"),
  email: Yup.string().required("Required"),
  website: Yup.string().required("Required"),
  // Organsiation Details
  organisationType: Yup.string().required("Required"),
  dateofincorporation: Yup.string().required("Required"),
  associationwithcompetitor: Yup.string().required("Required"),
  memorandamofassociate: fileType,
  listofdirector: fileType,
  profileofkeyperson: fileType,
  competitorname: Yup.string().required("Required"),
  isocertified: Yup.string().required("Required"),
  turnoverlastyear: Yup.string().required("Required"),
  turnover2ndlastyear: Yup.string().required("Required"),
  uploadbranchdetail: fileType,
  uploadreturndetail: fileType,
  uniquenumber: Yup.number()
    .transform((value, originalValue) => {
      if (isNaN(parseInt(originalValue))) {
        return undefined;
      }
      return value;
    })
    .required("Required"),
  registrationnumber: Yup.number()
    .transform((value, originalValue) => {
      if (isNaN(parseInt(originalValue))) {
        return undefined;
      }
      return value;
    })
    .required("Required"),
  firstregistrationnumber: Yup.number()
    .transform((value, originalValue) => {
      if (isNaN(parseInt(originalValue))) {
        return undefined;
      }
      return value;
    })
    .required("Required"),
  latestMonthgst1filed: Yup.string().required("Required"),
  latestMonthgst2filed: Yup.string().required("Required"),
  complyregulatory: Yup.string().required("Required"),
  uploadregistrationcertificate: fileType,
  uploadlicense1: fileType,
  uploadlicense2: fileType,
  codeproprietor: Yup.string().required("Required"),
  //Service / Product Details
  listmajorproduct: Yup.string().required("Required"),
  qualitycontrolprocedure: Yup.string().required("Required"),
  valueaddproduct: Yup.string().required("Required"),
  fivestrengthpoints: Yup.string().required("Required"),
  fiveweakpoints: Yup.string().required("Required"),
  selectiontrainingmethod: Yup.string().required("Required"),
  deliveryprocedure: Yup.string().required("Required"),
  clientele: Yup.string().required("Required"),
  // Reference Details
  referenceorganisation1: Yup.string().required("Required"),
  referencecontactperson1: Yup.string().required("Required"),
  referencedesignation1: Yup.string().required("Required"),
  referencecontact1: Yup.string().required("Required"),
  periodofservice1: Yup.string().required("Required"),
  referenceorganisation2: Yup.string().required("Required"),
  referencecontactperson2: Yup.string().required("Required"),
  referencedesignation2: Yup.string().required("Required"),
  referencecontact2: Yup.string().required("Required"),
  periodofservice2: Yup.string().required("Required"),
  referenceorganisation3: Yup.string().required("Required"),
  referencecontactperson3: Yup.string().required("Required"),
  referencedesignation3: Yup.string().required("Required"),
  referencecontact3: Yup.string().required("Required"),
  periodofservice3: Yup.string().required("Required"),
});

export default function Edit() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { id } = router.query;

  const initialValues = {
    contractorName: "",
    servicedetail: "",
    supplierdetail: "",
    businessdetaildocument: undefined,
    uploadutilitybill: undefined,
    officeaddress: "",
    contactperson: "",
    designation: "",
    telephonenumber: null,
    mobilenumber: null,
    email: "",
    website: "",
    organisationType: "",
    dateofincorporation: "",
    associationwithcompetitor: "",
    memorandamofassociate: undefined,
    listofdirector: undefined,
    profileofkeyperson: undefined,
    competitorname: "",
    isocertified: "",
    turnoverlastyear: "",
    turnover2ndlastyear: "",
    uploadbranchdetail: undefined,
    uploadreturndetail: undefined,
    uniquenumber: null,
    registrationnumber: null,
    firstregistrationnumber: null,
    latestMonthgst1filed: "",
    latestMonthgst2filed: "",
    complyregulatory: "",
    uploadregistrationcertificate: undefined,
    uploadlicense1: undefined,
    uploadlicense2: undefined,
    codeproprietor: "",
    listmajorproduct: "",
    qualitycontrolprocedure: "",
    valueaddproduct: "",
    fivestrengthpoints: "",
    fiveweakpoints: "",
    selectiontrainingmethod: "",
    deliveryprocedure: "",
    clientele: "",
    referenceorganisation1: "",
    referencecontactperson1: "",
    referencedesignation1: "",
    referencecontact1: "",
    periodofservice1: "",
    referenceorganisation2: "",
    referencecontactperson2: "",
    referencedesignation2: "",
    referencecontact2: "",
    periodofservice2: "",
    referenceorganisation3: "",
    referencecontactperson3: "",
    referencedesignation3: "",
    referencecontact3: "",
    periodofservice3: "",
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
            Add Contractor
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => router.push("/")}
        >
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Stack spacing={0}>
                <Typography variant="h5" ml={1} mt={2}>
                  General
                </Typography>
                <Grid ml={{ xs: 0, sm: 2, md: 6 }} container>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="contractorName"
                      label="Contractor Name*"
                      placeHolder="Enter the Contractor Name"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="servicedetail"
                      label="Service Detail*"
                      placeHolder="Enter Service Detail"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="supplierdetail"
                      label="Supplier Detail*"
                      placeHolder="Enter Supplier Detail"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="officeaddress"
                      label="Office Address*"
                      placeHolder="Enter Office Address"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="contactperson"
                      label="Contact Person*"
                      placeHolder="Contact Person"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="designation"
                      label="Designation*"
                      placeHolder="Enter Designation"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="telephonenumber"
                      label="Telephone Number*"
                      placeHolder="Enter Telephone Number"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="mobilenumber"
                      label="Mobile Number*"
                      placeHolder="Enter Mobile Number"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="email"
                      label="Email*"
                      placeHolder="Enter Email"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="website"
                      label="Website*"
                      placeHolder="Enter Website"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="businessdetaildocument"
                      label="Business Details Document"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
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

                <Grid ml={{ xs: 0, sm: 2, md: 6 }} mt={2} container>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="organisationType"
                      label="Organisation Type*"
                      placeHolder="Select a Organisation Type"
                      options={[
                        "Public Limited Company",
                        "Private Limited Company",
                        "Partnership Firm",
                        "Sole Proprietorship",
                        "Others",
                      ]}
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="dateofincorporation"
                      label="Date of Incorporation*"
                      placeHolder="Date of Incorporation"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="associationwithcompetitor"
                      label="Are you an associative member of any organisation?*"
                      placeHolder="Association with Competitor"
                      disabled={false}
                      options={["Yes", "No"]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="memorandamofassociate"
                      label="Memorandum of Associate"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="listofdirector"
                      label="List of Directors"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="profileofkeyperson"
                      label="Profile of Key Person"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="competitorname"
                      label="Competitor Name*"
                      placeHolder="Enter Competitor Name"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="isocertified"
                      label="ISO Certified"
                      placeHolder="ISO Certified"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="turnoverlastyear"
                      label="What is Turnover of Last Year*"
                      placeHolder="Turnover Last Year"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="turnover2ndlastyear"
                      label="What is Turnover of 2nd Last Year"
                      placeHolder="Turnover 2nd Last Year"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="uploadbranchdetail"
                      label="Branch Detail"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="uploadreturndetail"
                      label="Return Detail"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="uniquenumber"
                      label="Unique Number*"
                      placeHolder="Enter Unique Number"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="registrationnumber"
                      label="Registration Number*"
                      placeHolder="Enter your Registration Number"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="firstregistrationnumber"
                      label="Fist Registration Number*"
                      placeHolder="Enter your Fist Registration Number"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="latestMonthgst1filed"
                      label="Latest Month GST 1 Filed"
                      placeHolder="Latest Month GST 1 Filed"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="latestMonthgst2filed"
                      label="Latest Month GST 2 Filed"
                      placeHolder="Latest Month GST 2 Filed"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="complyregulatory"
                      label="Comply Regulatory"
                      placeHolder="Comply Regulatory"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload
                      name="uploadregistrationcertificate"
                      label="Registration Certificate"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload name="uploadlicense1" label="License1" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FileUpload name="uploadlicense2" label="License2" />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="codeproprietor"
                      label="Code No of Proprietor*"
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
                <Grid ml={{ xs: 0, sm: 2, md: 6 }} mt={0} container>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="listmajorproduct"
                      label="List Major Products*"
                      placeHolder="Enter the List of Major Product"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="qualitycontrolprocedure"
                      label="What are your Quality Control Procedure"
                      placeHolder="Enter your Quality Control Procedure"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="valueaddproduct"
                      label="What value add product can you provide?*"
                      placeHolder="Enter your value add product"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="fivestrengthpoints"
                      label="What are your five strength points?*"
                      placeHolder="Enter your five strength points"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="fiveweakpoints"
                      label="What are your five weakness points?*"
                      placeHolder="Enter your five weakness points"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="selectiontrainingmethod"
                      label="What is your selection and training method?*"
                      placeHolder="Enter your selection and training method"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="deliveryprocedure"
                      label="What is your delivery procedure?*"
                      placeHolder="Enter your delivery procedure"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="clientele"
                      label="What is your clientele?*"
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
                <Grid ml={{ xs: 0, sm: 2, md: 6 }} mt={2} container>
                  <Grid item xs={12}>
                    <Typography>Organisation1:</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referenceorganisation1"
                      label="Reference Organisation*"
                      placeHolder="Enter your Reference Organisation"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referencecontactperson1"
                      label="Reference Contact Person*"
                      placeHolder="Enter your Reference Contact Person"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referencedesignation1"
                      label="Reference Designation*"
                      placeHolder="Enter your Reference Designation"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referencecontact1"
                      label="Reference Contact*"
                      placeHolder="Enter your Reference Contact"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="periodofservice1"
                      label="Period of Service*"
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
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referenceorganisation2"
                      label="Reference Organisation*"
                      placeHolder="Enter your Reference Organisation"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referencecontactperson2"
                      label="Reference Contact Person*"
                      placeHolder="Enter your Reference Contact Person"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referencedesignation2"
                      label="Reference Designation*"
                      placeHolder="Enter your Reference Designation"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referencecontact2"
                      label="Reference Contact*"
                      placeHolder="Enter your Reference Contact"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="periodofservice2"
                      label="Period of Service*"
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
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referenceorganisation3"
                      label="Reference Organisation*"
                      placeHolder="Enter your Reference Organisation"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referencecontactperson3"
                      label="Reference Contact Person*"
                      placeHolder="Enter your Reference Contact Person"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referencedesignation3"
                      label="Reference Designation*"
                      placeHolder="Enter your Reference Designation"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="referencecontact3"
                      label="Reference Contact*"
                      placeHolder="Enter your Reference Contact"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="periodofservice3"
                      label="Period of Service*"
                      placeHolder="Enter your Period of Service"
                      disabled={false}
                    />
                  </Grid>
                </Grid>
              </Stack>
              <Button
                type="submit"
                variant="contained"
                sx={{ float: "right", mr: 10 }}
              >
                Submit
              </Button>
            </form>
          )}
        </Formik>
      </Paper>
    </>
  );
}
