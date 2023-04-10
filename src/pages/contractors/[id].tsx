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
import axios from "axios";
// import { Contractor } from "@prisma/client"

const fileType = Yup.object().required("Required");

const validationSchema = Yup.object().shape({
  contractorname: Yup.string().required("Required"),
  servicedetail: Yup.string().required("Required"),
  supplierdetail: Yup.string().required("Required"),
  businessdetaildocument: fileType,
  uploadutilitybill: fileType,
  officeaddress: Yup.string().required("Required"),
  contactperson: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  telephonenumber: Yup.number().required("Required"),
  mobilenumber: Yup.number().required("Required"),
  emailid: Yup.string().required("Required"),
  website: Yup.string().required("Required"),
  // Organsiation Details
  organisationtype: Yup.string().required("Required"),
  dateofincorporation: Yup.string().required("Required"),
  associationwithcompetitor: Yup.string().required("Required"),
  memorandam_of_associate: fileType,
  listofdirector: fileType,
  profileofkeyperson: fileType,
  competitorname: Yup.string().required("Required"),
  isocertified: Yup.string().required("Required"),
  turnoverlastyear: Yup.string().required("Required"),
  turnover2yearback: Yup.string().required("Required"),
  uploadbranchdetail: fileType,
  uploadreturndetail: fileType,
  uniquenumber: Yup.number().required("Required"),
  registration_number: Yup.number().required("Required"),
  first_registration_number: Yup.number().required("Required"),
  latest_mnth_gst1_filed: Yup.string().required("Required"),
  latest_mnth_gst2b_filed: Yup.string().required("Required"),
  comply_regulatory: Yup.string().required("Required"),
  upload_registration_cert: fileType,
  upload_licence1: fileType,
  upload_licence2: fileType,
  code_of_proprietor: Yup.string().required("Required"),
  //Service / Product Details
  list_major_product: Yup.string().required("Required"),
  qualty_control_procedure: Yup.string().required("Required"),
  valueadd_product: Yup.string().required("Required"),
  five_strength_points: Yup.string().required("Required"),
  weakness: Yup.string().required("Required"),
  selection_training_method: Yup.string().required("Required"),
  delivery_procedure: Yup.string().required("Required"),
  clientele: Yup.string().required("Required"),
  // Reference Details
  reference_organistaion_1: Yup.string().required("Required"),
  reference_contact_person_1: Yup.string().required("Required"),
  reference_designation_1: Yup.string().required("Required"),
  reference_contact_1: Yup.string().required("Required"),
  period_of_service_1: Yup.string().required("Required"),
  reference_organistaion_2: Yup.string().required("Required"),
  reference_contact_person_2: Yup.string().required("Required"),
  reference_designation_2: Yup.string().required("Required"),
  reference_contact_2: Yup.string().required("Required"),
  period_of_service_2: Yup.string().required("Required"),
  reference_organistaion_3: Yup.string().required("Required"),
  reference_contact_person_3: Yup.string().required("Required"),
  reference_designation_3: Yup.string().required("Required"),
  reference_contact_3: Yup.string().required("Required"),
  period_of_service_3: Yup.string().required("Required"),
  upload_list_ofclientele: fileType,
  upload_certificate_services: fileType,
  upload_doc1: fileType,
  upload_doc2: fileType,
});

export default function Edit() {
  const router = useRouter();
  // const [contractor, setContractor] = useState<Contractor || null>()
  const [value, setValue] = useState("");
  const { id } = router.query;

  const initialValues = {
    contractorname: "",
    servicedetail: "",
    supplierdetail: "",
    businessdetaildocument: undefined,
    uploadutilitybill: undefined,
    officeaddress: "",
    contactperson: "",
    designation: "",
    telephonenumber: null,
    mobilenumber: null,
    emailid: "",
    website: "",
    organisationtype: "",
    dateofincorporation: "",
    associationwithcompetitor: "",
    memorandam_of_associate: undefined,
    listofdirector: undefined,
    profileofkeyperson: undefined,
    competitorname: "",
    isocertified: "",
    turnoverlastyear: "",
    turnover2yearback: "",
    uploadbranchdetail: undefined,
    uploadreturndetail: undefined,
    uniquenumber: null,
    registration_number: null,
    first_registration_number: null,
    latest_mnth_gst1_filed: "",
    latest_mnth_gst2b_filed: "",
    comply_regulatory: "",
    upload_registration_cert: undefined,
    upload_licence1: undefined,
    upload_licence2: undefined,
    code_of_proprietor: "",
    list_major_product: "",
    qualty_control_procedure: "",
    valueadd_product: "",
    five_strength_points: "",
    weakness: "",
    selection_training_method: "",
    delivery_procedure: "",
    clientele: "",
    reference_organistaion_1: "",
    reference_contact_person_1: "",
    reference_designation_1: "",
    reference_contact_1: "",
    period_of_service_1: "",
    reference_organistaion_2: "",
    reference_contact_person_2: "",
    reference_designation_2: "",
    reference_contact_2: "",
    period_of_service_2: "",
    reference_organistaion_3: "",
    reference_contact_person_3: "",
    reference_designation_3: "",
    reference_contact_3: "",
    period_of_service_3: "",
    upload_list_ofclientele: undefined,
    upload_certificate_services: undefined,
    upload_doc1: undefined,
    upload_doc2: undefined,
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
          onSubmit={(values) => {
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
            axios
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
                console.log(err);
              });
          }}
        >
          {({ handleSubmit, errors, values }) => {
            console.log(errors);
            console.log(values);
            return (
              <form noValidate onSubmit={handleSubmit}>
                <Stack spacing={0}>
                  <Typography variant="h5" ml={1} mt={2}>
                    General
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
                        name="emailid"
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
                        name="organisationtype"
                        label="Organisation Type*"
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
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload
                        name="memorandam_of_associate"
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
                        name="turnover2yearback"
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
                        name="registration_number"
                        label="Registration Number*"
                        placeHolder="Enter your Registration Number"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="first_registration_number"
                        label="Fist Registration Number*"
                        placeHolder="Enter your Fist Registration Number"
                        disabled={false}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="latest_mnth_gst1_filed"
                        label="Latest Month GST 1 Filed"
                        placeHolder="Latest Month GST 1 Filed"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="latest_mnth_gst2b_filed"
                        label="Latest Month GST 2 Filed"
                        placeHolder="Latest Month GST 2 Filed"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
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
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload
                        name="upload_registration_cert"
                        label="Registration Certificate"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="upload_licence1" label="License1" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="upload_licence2" label="License2" />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="code_of_proprietor"
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
                        name="list_major_product"
                        label="List Major Products*"
                        placeHolder="Enter the List of Major Product"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="qualty_control_procedure"
                        label="What are your Quality Control Procedure"
                        placeHolder="Enter your Quality Control Procedure"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="valueadd_product"
                        label="What value add product can you provide?*"
                        placeHolder="Enter your value add product"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="five_strength_points"
                        label="What are your five strength points?*"
                        placeHolder="Enter your five strength points"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="weakness"
                        label="What are your five weakness points?*"
                        placeHolder="Enter your five weakness points"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="selection_training_method"
                        label="What is your selection and training method?*"
                        placeHolder="Enter your selection and training method"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="delivery_procedure"
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
                        name="reference_organistaion_1"
                        label="Reference Organisation*"
                        placeHolder="Enter your Reference Organisation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="reference_contact_person_1"
                        label="Reference Contact Person*"
                        placeHolder="Enter your Reference Contact Person"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="reference_designation_1"
                        label="Reference Designation*"
                        placeHolder="Enter your Reference Designation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="reference_contact_1"
                        label="Reference Contact*"
                        placeHolder="Enter your Reference Contact"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="period_of_service_1"
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
                        name="reference_organistaion_2"
                        label="Reference Organisation*"
                        placeHolder="Enter your Reference Organisation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="reference_contact_person_2"
                        label="Reference Contact Person*"
                        placeHolder="Enter your Reference Contact Person"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="reference_designation_2"
                        label="Reference Designation*"
                        placeHolder="Enter your Reference Designation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="reference_contact_2"
                        label="Reference Contact*"
                        placeHolder="Enter your Reference Contact"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="period_of_service_2"
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
                        name="reference_organistaion_3"
                        label="Reference Organisation*"
                        placeHolder="Enter your Reference Organisation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="reference_contact_person_3"
                        label="Reference Contact Person*"
                        placeHolder="Enter your Reference Contact Person"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="reference_designation_3"
                        label="Reference Designation*"
                        placeHolder="Enter your Reference Designation"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="reference_contact_3"
                        label="Reference Contact*"
                        placeHolder="Enter your Reference Contact"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name="period_of_service_3"
                        label="Period of Service*"
                        placeHolder="Enter your Period of Service"
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload
                        name="upload_list_ofclientele"
                        label="Upload List of Clientele"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload
                        name="upload_certificate_services"
                        label="Upload Certificate of Services"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="upload_doc1" label="Upload Document1" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name="upload_doc2" label="Upload Document2" />
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
            );
          }}
        </Formik>
      </Paper>
    </>
  );
}
