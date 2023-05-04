import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { Department, Designations, User } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

const validationSchema = Yup.object().shape({
  departmentname: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  basicsalary: Yup.number().required("Required"),
  allowed_wrking_hr_per_day: Yup.number().required("Required"),
  servicecharge: Yup.number().required("Required"),
});

export default function EditDesignation({
  handleClose,
  selectedDesignation,
  departments,
  fetchDesignations,
}: {
  handleClose: () => void;
  selectedDesignation: Designations | undefined;
  departments: Department[];
  fetchDesignations: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    departmentname:
      selectedDesignation?.departmentname || departments.length > 0
        ? departments[0].department
        : "",
    designation: selectedDesignation?.designation || "",
    gender: selectedDesignation?.gender || "",
    basicsalary: selectedDesignation?.basicsalary || 0,
    allowed_wrking_hr_per_day:
      selectedDesignation?.allowed_wrking_hr_per_day || 0,
    servicecharge: selectedDesignation?.servicecharge || 0,
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
            if (selectedDesignation) {
              await axios
                .put("/api/admin/designations", {
                  id: selectedDesignation.id,
                  departmentId: departments.find(
                    (d) => d.department === values.departmentname
                  )?.id,
                  ...values,
                })
                .then((res) => {
                  handleClose();
                  fetchDesignations();
                })
                .catch((err) => {
                  console.log(err);
                });
              setLoading(false);
              return;
            }
            await axios
              .post("/api/admin/designations", {
                departmentId: departments.find(
                  (d) => d.department === values.departmentname
                )?.id,
                ...values,
              })
              .then((res) => {
                handleClose();
                fetchDesignations();
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
                <FormSelect
                  name="departmentname"
                  label="Department"
                  placeHolder="Select the Department"
                  options={departments.map((department) => {
                    return {
                      value: department.department,
                      label: department.department,
                    };
                  })}
                />

                <FormInput
                  name="designation"
                  label="Designation"
                  type="text"
                  placeHolder="Enter the Designation"
                />
                <FormSelect
                  name="gender"
                  label="Gender"
                  placeHolder="Gender"
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Both", label: "Both" },
                  ]}
                />
                <FormInput
                  name="basicsalary"
                  label="Basic Salary"
                  type="number"
                  placeHolder="Enter the Basic Salary"
                />
                <FormInput
                  name="allowed_wrking_hr_per_day"
                  label="Allowed Working Hours Per Day"
                  placeHolder="Enter the Allowed Working Hours Per Day"
                  type="number"
                />
                <FormInput
                  name="servicecharge"
                  label="Service Charge"
                  placeHolder="Enter the Service Charge"
                  type="number"
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
