import {
  Box,
  Button,
  CircularProgress,
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
import { useEffect, useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import { Role, TimeKeeper } from "@prisma/client";
import axios from "axios";
import FormSelect from "@/components/FormikComponents/FormSelect";
import FileUpload from "@/components/FormikComponents/FileUpload";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(
  ({ theme }) => ({
    width: 350,
    // marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    "& input": {
      background: "transparent !important",
      paddingLeft: "4px !important",
    },
    [theme.breakpoints.down("lg")]: {
      width: 250,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff",
    },
  })
);

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required("Required"),
  contractorName: Yup.string().required("Required"),
  employeeid: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  attendance: Yup.number().required("Required"),
  machineInTime: Yup.string().required("Required"),
  machineOutTime: Yup.string().required("Required"),
  machineshift: Yup.string().required("Required"),
  overtime: Yup.number().required("Required"),
  eleave: Yup.number().required("Required"),
  manualintime: Yup.string().required("Required"),
  manualouttime: Yup.string().required("Required"),
  manualshift: Yup.string().required("Required"),
  manualovertime: Yup.number().required("Required"),
  mleave: Yup.number().required("Required"),
  department: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  comment: Yup.string().required("Required"),
  uploadDocument: Yup.object().required("Required"),
});

export default function Edit({ role }: { role: Role | undefined }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [timekeeper, setTimeKepeer] = useState<TimeKeeper>();

  const { data: session } = useSession();
  console.log(session, role);

  const fetchTimeKeeper = async () => {
    setLoading(true);
    await axios
      .get(`/api/timekeeper/${id}`)
      .then((res) => {
        setTimeKepeer(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTimeKeeper();
  }, [id]);

  console.log(loading, timekeeper, id);

  const initialValues = {
    contractorId: "21soidfj",
    contractorName: "John Doe",
    employeeid: timekeeper?.employeeid || "",
    designation: timekeeper?.designation || "Manager",
    // attendance: 3,
    machineInTime: timekeeper?.machineInTime || "10:00",
    machineOutTime: timekeeper?.machineOutTime || "18:00",
    machineshift: timekeeper?.machineshift || "Day",
    attendance: timekeeper?.attendance || 5,
    overtime: timekeeper?.overtime || 2,
    eleave: timekeeper?.eleave || 0,
    manualintime: timekeeper?.manualintime || "",
    manualouttime: timekeeper?.manualouttime || "",
    manualshift: timekeeper?.manualshift || "",
    manualovertime: timekeeper?.manualovertime || "",
    mleave: timekeeper?.mleave || "",
    department: timekeeper?.department || "Production",
    gender: timekeeper?.gender || "",
    comment: "",
    uploadDocument: undefined,
  };

  return loading ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="90vh"
    >
      <CircularProgress />
    </Box>
  ) : (
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
            Edit {id}
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const {
              comment,
              uploadDocument,
              contractorId,
              contractorName,
              ...others
            } = values;
            await axios
              .put("/api/timekeeper", {
                id: id,
                uploadDocument: uploadDocument,
                comment,
                userId: session?.user?.id,
                userName: session?.user?.name,
                role: role,
                ...others,
              })
              .then((res) => {
                router.push("/");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid ml={6} mt={2} container>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="contractorId"
                    label="Contractor ID"
                    placeHolder="Contractor ID"
                    disabled={true}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="contractorName"
                    label="Contractor Name"
                    placeHolder="Contractor Name"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="employeeid"
                    label="Employee ID"
                    placeHolder="Employee ID"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="designation"
                    label="Designation"
                    placeHolder="Designation"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="machineInTime"
                    label="Machine In Time"
                    placeHolder="Machine In Time"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="machineOutTime"
                    label="Machine Out Time"
                    placeHolder="Machine Out Time"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="machineshift"
                    label="Machine Shift"
                    placeHolder="Machine Shift"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="overtime"
                    label="Overtime"
                    placeHolder="Overtime"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="eleave"
                    label="Leave"
                    placeHolder="Leave"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="attendance"
                    label="Attendance"
                    placeHolder="Attendance"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="manualintime"
                    label="Manual In Time"
                    placeHolder="Manual In Time"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="manualouttime"
                    label="Manual Out Time"
                    placeHolder="Manual Out Time"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="manualshift"
                    label="Manual Shift"
                    placeHolder="Manual Shift"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="manualovertime"
                    label="Manual Overtime"
                    placeHolder="Manual Overtime"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="mleave"
                    label="Manual Leave"
                    placeHolder="Manual Leave"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="department"
                    label="Department"
                    placeHolder="Department"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormSelect
                    name="gender"
                    label="Gender"
                    placeHolder="Gender"
                    disabled={false}
                    options={["Male", "Female", "Other"]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="comment"
                    label="Comment"
                    placeHolder="Enter the Comment"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FileUpload
                    name="uploadDocument"
                    label="Upload Document"
                    placeholder="Upload Document"
                  />
                </Grid>
              </Grid>
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });
  return {
    props: {
      role: user?.role,
    },
  };
};
