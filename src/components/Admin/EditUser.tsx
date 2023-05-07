import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { User } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid Email").required("Required"),
  mobileNumber: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
  specialRole: Yup.boolean(),
});

export default function EditUser({
  handleClose,
  selectedUser,
}: {
  handleClose: () => void;
  selectedUser: User | null;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initialValues = {
    name: selectedUser?.name || "",
    email: selectedUser?.email || "",
    mobileNumber: selectedUser?.mobileNumber || "",
    role: selectedUser?.role || "",
    specialRole: selectedUser?.specialRole || false,
  };

  return (
    <>
      <Paper
        sx={{
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
            await axios
              .post("/api/admin/editUser", {
                name: values.name,
                email: values.email,
                mobileNumber: values.mobileNumber.toString(),
                role: values.role,
                specialRole: values.specialRole,
              })
              .then((res) => {
                router.replace(router.asPath);
                handleClose();
              })
              .catch((err) => {
                console.log(err);
              });
            setLoading(false);
          }}
        >
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ ml: 1 }}>
                <FormInput
                  name="name"
                  label="Name"
                  type="text"
                  placeHolder="Enter the Full Name"
                />
                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  placeHolder="Enter the Email"
                />
                <FormInput
                  name="mobileNumber"
                  label="Mobile Number"
                  type="number"
                  placeHolder="Enter the Mobile Number"
                />
                <FormSelect
                  name="role"
                  label="Role"
                  placeHolder="Select the Role"
                  options={[
                    { value: "None", label: "None" },
                    { value: "Admin", label: "Admin" },
                    { value: "TimeKeeper", label: "TimeKeeper" },
                    { value: "HR", label: "HR" },
                    { value: "Stores", label: "Store" },
                    { value: "Safety", label: "Safety" },
                    { value: "PlantCommercial", label: "PlantCommercial" },
                    {
                      value: "HoCommercialAuditor",
                      label: "HoCommercialAuditor",
                    },
                    { value: "Corporate", label: "Corporate" },
                  ]}
                />
                <FormSelect
                  name="specialRole"
                  label="Special Role"
                  placeHolder="Select the Special Role"
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                />
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
              </Stack>
            </form>
          )}
        </Formik>
      </Paper>
    </>
  );
}
