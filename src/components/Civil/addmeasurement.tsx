import resetPassword from "@/pages/api/admin/resetpassword";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import {
  Modal,
  Backdrop,
  Slide,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Button,
  useMediaQuery,
  Grid,
  styled,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { shouldForwardProp } from "@mui/system";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../FormikComponents/FormInput";
import { useState } from "react";
import { Measurement } from "@prisma/client";
import FormSelect from "../FormikComponents/FormSelect";
import axios from "axios";

const style = {
  position: "absolute",
  overflowY: "auto",
  borderRadius: "15px",
  bgcolor: "background.paper",
  boxShadow: 24,
};

interface Props {
  open: boolean;
  handleClose: () => void;
  selected: any;
  works: Measurement[];
  contractor: string;
  selectedWork: string;
  fetchWorks: () => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function AddMeasurement({
  open,
  handleClose,
  selected,
  works,
  contractor,
  selectedWork,
  fetchWorks,
}: Props) {
  const [value, setValue] = useState(0);
  const matches = useMediaQuery("(min-width:600px)");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{ display: "flex", justifyContent: " flex-end" }}
    >
      <Slide
        direction={matches ? "left" : "up"}
        timeout={500}
        in={open}
        mountOnEnter
        unmountOnExit
      >
        <Box
          p={{ xs: 0, sm: 2 }}
          width={{ xs: "100%", sm: 400, md: 600, lg: 800 }}
          height={{ xs: "70%", sm: "100%" }}
          top={{ xs: "30%", sm: "0" }}
          sx={style}
        >
          <Stack sx={{ overflowY: "auto" }} p={1}>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
              <IconButton
                onClick={handleClose}
                sx={{
                  // zIndex: 2,
                  padding: "5px",

                  marginRight: "1rem",
                  background: "white",
                  ":hover": { background: "white" },
                }}
              >
                <NavigateBefore fontSize="large" />
              </IconButton>
              Add Measurement Item
            </Typography>
            <Divider />
            <Box sx={{ borderBottom: 1, borderColor: "divider", pl: 5 }}>
              <Addworkitem
                works={works}
                handleClose={handleClose}
                selectedWork={selectedWork}
                fetchWorks={fetchWorks}
              />
              {/* <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Add Measurement" {...a11yProps(0)} />
                <Tab label="Add Work Item" {...a11yProps(1)} />
              </Tabs> */}
            </Box>
            {/* <TabPanel value={value} index={0}>
              <AddWork
                contractor={contractor}
                work={selected}
                handleClose={handleClose}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Addworkitem works={works} handleClose={handleClose} />
            </TabPanel> */}
          </Stack>
        </Box>
      </Slide>
    </Modal>
  );
}

const Addworkitem = ({
  works,
  handleClose,
  selectedWork,
  fetchWorks,
}: {
  works: Measurement[];
  handleClose: () => void;
  selectedWork: string;
  fetchWorks: () => Promise<void>;
}) => {
  const validationSchema = Yup.object().shape({
    measurementId: Yup.string().required("Required"),
    unit: Yup.string().required("Required"),
    unitrate: Yup.number().required("Required"),
    description: Yup.string().required("Required"),
    nos: Yup.number().required("Required"),
    length: Yup.number().required("Required"),
    breadth: Yup.number().required("Required"),
    height: Yup.number().required("Required"),
  });

  const initialValues = {
    measurementId: selectedWork || "",
    unit: "",
    unitrate: 0,
    description: "",
    nos: 0,
    length: 0,
    breadth: 0,
    height: 0,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const quantity =
          values.nos * values.length * values.breadth * values.height;
        const valueofcurrentBill = quantity * values.unitrate;
        const totalQuantity = quantity;
        const valueofTotalBill = valueofcurrentBill;

        const totalAmount = valueofcurrentBill;

        const measurementItem = {
          ...values,
          quantity: parseFloat(quantity.toFixed(3)),
          valueofcurrentBill: parseFloat(valueofcurrentBill.toFixed(3)),
          totalQuantity: parseFloat(totalQuantity.toFixed(3)),
          valueofTotalBill: parseFloat(valueofTotalBill.toFixed(3)),
        };
        setSubmitting(true);
        await axios.post("/api/measurementItem", {
          measurementItem,
          totalAmount,
        });
        await fetchWorks();
        handleClose();
        setSubmitting(false);
      }}
    >
      {({ errors, touched, isSubmitting, handleSubmit }) => {
        return (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container columnGap={8}>
              <Grid item xs={12} sm={11}>
                <FormInput
                  name="description"
                  label="Description"
                  placeHolder="Description"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormSelect
                  name="measurementId"
                  label="Select Work"
                  type="text"
                  placeHolder="Work"
                  sx={{ width: "100%", maxWidth: "100%" }}
                  options={works.map((work) => ({
                    value: work.id,
                    label: work.description,
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormInput
                  name="unit"
                  label="Unit"
                  type="text"
                  placeHolder="Unit"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormInput
                  name="unitrate"
                  label="Unit Rate"
                  placeHolder="Unit Rate"
                  sx={{ width: "100%", maxWidth: "100%" }}
                  type="number"
                />
              </Grid>

              <Grid item xs={12} sm={5}>
                <FormInput
                  name="nos"
                  label="Nos"
                  type="number"
                  placeHolder="Nos"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormInput
                  name="length"
                  label="Length"
                  type="number"
                  placeHolder="Length"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormInput
                  name="breadth"
                  label="Breadth"
                  type="number"
                  placeHolder="Breadth"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormInput
                  name="height"
                  label="Height"
                  type="number"
                  placeHolder="Height"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
                >
                  Submit {isSubmitting && <CircularProgress size={20} />}
                </Button>
              </Grid>
            </Grid>
          </form>
          // <Stack direction="row" flexWrap="wrap" spacing="6px">
          //   <FormInput
          //     name="description"
          //     label="Description"
          //     type="text"
          //     placeHolder="Description"
          //   />
          //   <FormInput name="unit" label="Unit" type="text" placeHolder="Unit" />
          //   <FormInput name="nos" label="Nos" type="number" placeHolder="Nos" />
          //   <FormInput
          //     name="length"
          //     label="Length"
          //     type="number"
          //     placeHolder="Length"
          //   />
          //   <FormInput
          //     name="breadth"
          //     label="Breadth"
          //     type="number"
          //     placeHolder="Breadth"
          //   />
          //   <FormInput
          //     name="height"
          //     label="Height"
          //     type="number"
          //     placeHolder="Height"
          //   />
          // </Stack>
        );
      }}
    </Formik>
  );
};
