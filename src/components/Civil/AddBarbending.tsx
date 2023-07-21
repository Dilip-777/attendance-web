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
import { BarBending } from "@prisma/client";
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
  barbending: BarBending[];
  contractor: string;
  selectedWork: string;
  fetchBarBending: () => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function AddBarBending({
  open,
  handleClose,
  selected,
  barbending,
  contractor,
  selectedWork,
  fetchBarBending,
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
              Add BarBending Item
            </Typography>
            <Divider />
            <Box sx={{ borderBottom: 1, borderColor: "divider", pl: 5 }}>
              <AddBarBendingItem
                barbending={barbending}
                handleClose={handleClose}
                selectedWork={selectedWork}
                fetchBarBending={fetchBarBending}
              />
              {/* <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Add Work" {...a11yProps(0)} />
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
              <AddBarBendingItem barbending={barbending} handleClose={handleClose} />
            </TabPanel> */}
          </Stack>
        </Box>
      </Slide>
    </Modal>
  );
}

const AddBarBendingItem = ({
  barbending,
  handleClose,
  selectedWork,
  fetchBarBending,
}: {
  barbending: BarBending[];
  handleClose: () => void;
  selectedWork: string;
  fetchBarBending: () => Promise<void>;
}) => {
  const validationSchema = Yup.object().shape({
    barBendingId: Yup.string().required("Required"),
    diamark: Yup.number(),
    description: Yup.string().required("Required"),
    noofequipments: Yup.number(),
    costperequipment: Yup.number(),
    a: Yup.number(),
    b: Yup.number(),
    c: Yup.number(),
    d: Yup.number(),
    e: Yup.number(),
    f: Yup.number(),
    g: Yup.number(),
    h: Yup.number(),
    remarks: Yup.string(),
  });

  const initialValues = {
    barBendingId: selectedWork || "",
    diamark: 0,
    description: "",
    noofequipments: 0,
    costperequipment: 0,
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
    h: 0,
    remarks: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const totalcost = parseFloat(
          (values.noofequipments * values.costperequipment).toFixed(3)
        );
        const cuttinglength = parseFloat(
          (
            values.a +
            values.b +
            values.c +
            values.d +
            values.e +
            values.f +
            values.g +
            values.h
          ).toFixed(3)
        );
        const totalLength = parseFloat((totalcost * cuttinglength).toFixed(3));
        const unitweight = parseFloat(
          ((values.diamark * values.diamark) / 162.2).toFixed(3)
        );
        const totalweight = parseFloat((totalLength * unitweight).toFixed(3));

        const barBendingItem = {
          ...values,
          totalcost,
          cuttinglength,
          totalLength,
          unitweight,
          totalweight,
        };
        setSubmitting(true);
        await axios.post("/api/barbendingitem", {
          barBendingItem,
          totalAmount: totalweight,
        });
        await fetchBarBending();
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
                  name="barBendingId"
                  label="Select Work"
                  type="text"
                  placeHolder="Work"
                  sx={{ width: "100%", maxWidth: "100%" }}
                  options={barbending.map((work) => ({
                    value: work.id,
                    label: work.description,
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={5}>
                <FormInput
                  name={`diamark`}
                  label="Dia Mark"
                  placeHolder="Dia Mark"
                  sx={{ width: "100%", maxWidth: "100%" }}
                  type="number"
                />
              </Grid>

              <Grid item xs={12} sm={5} md={4} lg={5}>
                <FormInput
                  name={`noofequipments`}
                  label="noofequipments"
                  type="number"
                  placeHolder="noofequipments"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={5}>
                <FormInput
                  name={`costperequipment`}
                  label="costperequipment"
                  type="number"
                  placeHolder="costperequipment"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={2}>
                <FormInput
                  name={`a`}
                  label="A(M)"
                  type="number"
                  placeHolder="A(M)"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={2}>
                <FormInput
                  name={`b`}
                  label="B(M)"
                  type="number"
                  placeHolder="B(M)"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={2}>
                <FormInput
                  name={`c`}
                  label="C(M)"
                  type="number"
                  placeHolder="C(M)"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={2}>
                <FormInput
                  name={`d`}
                  label="D(M)"
                  type="number"
                  placeHolder="D(M)"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={2}>
                <FormInput
                  name={`e`}
                  label="E(M)"
                  type="number"
                  placeHolder="E(M)"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={2}>
                <FormInput
                  name={`f`}
                  label="F(M)"
                  type="number"
                  placeHolder="F(M)"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={2}>
                <FormInput
                  name={`g`}
                  label="G(M)"
                  type="number"
                  placeHolder="G(M)"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={2}>
                <FormInput
                  name={`h`}
                  label="H(M)"
                  type="number"
                  placeHolder="H(M)"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={3}>
                <FormInput
                  name={`remarks`}
                  label="Remarks"
                  type="text"
                  placeHolder="Enter Remarks"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 3 }} />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Submit {isSubmitting && <CircularProgress size={20} />}
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
};
