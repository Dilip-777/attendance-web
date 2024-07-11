import { Button, Grid, CircularProgress } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../FormikComponents/FormInput";
import { MeasurementItem, Measurement } from "@prisma/client";
import FormSelect from "../FormikComponents/FormSelect";
import axios from "axios";

const Addworkitem = ({
  works,
  handleClose,
  workItem,
}: {
  works: Measurement[];
  handleClose: () => void;
  workItem?: MeasurementItem;
}) => {
  const validationSchema = Yup.object().shape({
    workId: Yup.string().required("Required"),
    unit: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    nos: Yup.number().required("Required"),
    length: Yup.number().required("Required"),
    breadth: Yup.number().required("Required"),
    height: Yup.number().required("Required"),
  });

  const initialValues = {
    workId: workItem?.measurementId || "",
    unit: workItem?.unit || "",
    description: workItem?.description || "",
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
        const workItem = {
          ...values,
          quantity: parseFloat(quantity.toFixed(3)),
        };
        setSubmitting(true);
        await axios.post("/api/works", {
          workItem,
        });
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
                  name="workId"
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

export default Addworkitem;
