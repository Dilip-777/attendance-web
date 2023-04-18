import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  OutlinedInput,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { shouldForwardProp } from "@mui/system";
import { useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { User } from "@prisma/client";
import axios from "axios";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid Email").required("Required"),
  mobileNumber: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
});

export default function EditUser({
  handleClose,
  selectedUser,
}: {
  handleClose: () => void;
  selectedUser: User | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { id } = router.query;

  const initialValues = {
    name: selectedUser?.name || "",
    email: selectedUser?.email || "",
    mobileNumber: selectedUser?.mobileNumber || "",
    role: selectedUser?.role || "",
  };

  return (
    <>
      <Paper
        sx={{
          pt: "1rem",

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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await axios
              .post("/api/admin/editUser", {
                name: values.name,
                email: values.email,
                mobileNumber: values.mobileNumber,
                role: values.role,
              })
              .then((res) => {
                handleClose();
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ mt: 2, ml: 1 }}>
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
                    { value: "PlantCommercial", label: "PlantCommercial" },
                    {
                      value: "HoCommercialAuditor",
                      label: "HoCommercialAuditor",
                    },
                    { value: "Corporate", label: "Corporate" },
                  ]}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ float: "right", mr: 10 }}
                >
                  Submit
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
      </Paper>
    </>
  );
}
