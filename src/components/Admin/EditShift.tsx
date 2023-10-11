import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { Department, Shifts, User } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

const validationSchema = Yup.object().shape({
  shift: Yup.string().required("Required"),
    totalhours: Yup.number().required("Required"),
});

export default function EditShift({
  handleClose,
  selected,
  departments,
  fetchShifts,
}: {
  handleClose: () => void;
  selected: Shifts | undefined;
  departments: Department[];
  fetchShifts: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    shift: selected?.shift || "",
    totalhours: selected?.totalhours || 0,
  };

  return (
    <>
      <Paper
        sx={{
          pt: "1rem",
          px: "2rem",
          overflow: "hidden auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            if (selected) {
              await axios
                .put("/api/admin/shifts", {
                  id: selected.id,
                  ...values,
                })
                .then((res) => {
                  handleClose();
                  fetchShifts();
                })
                .catch((err) => {
                  console.log(err);
                });
              setLoading(false);
              return;
            }
            await axios
              .post("/api/admin/shifts", values)
              .then((res) => {
                handleClose();
                fetchShifts();
              })
              .catch((err) => {
                console.log(err);
              });
            setLoading(false);
          }}
        >
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ mt: 2, ml: 1 }}>

                <FormInput
                  name="shift"
                  label="Shift Name"
                  type="text"
                  placeHolder="Enter the Shift"
                />
                <FormInput
                  name="totalhours"
                  label="Total Hours"
                  type="number"
                  placeHolder="Enter the Total Hours"
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ float: "right", mr: 10, width: 300 }}
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
              </Stack>
            </form>
          )}
        </Formik>
      </Paper>
    </>
  );
}
