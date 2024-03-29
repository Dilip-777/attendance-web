import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import { Department, Role, TimeKeeper } from "@prisma/client";
import axios from "axios";
import FormSelect from "@/components/FormikComponents/FormSelect";
import FileUpload from "@/components/FormikComponents/FileUpload";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import FormDate from "@/components/FormikComponents/FormDate";

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().optional(),
  contractorName: Yup.string().optional(),
  employeeid: Yup.string().optional(),
  designation: Yup.string().optional(),
  attendance: Yup.number().min(0).max(1),
  attendancedate: Yup.string().optional(),
  machineInTime: Yup.string().optional(),
  machineOutTime: Yup.string().optional(),
  machineduration: Yup.string().optional(),
  machineshift: Yup.string().optional(),
  overtime: Yup.number().optional(),
  eleave: Yup.number().optional(),
  manualintime: Yup.string().optional().nullable(),
  manualouttime: Yup.string().optional().nullable(),
  manualshift: Yup.string().optional().nullable(),
  manualovertime: Yup.number().optional().nullable(),
  manualduration: Yup.string().optional().nullable(),
  mleave: Yup.string().optional().nullable(),
  department: Yup.string().optional().nullable(),
  gender: Yup.string().required("Required"),
  comment: Yup.string().required("Required"),
  uploadDocument: Yup.string().optional(),
});

export default function EditTimkeeper({
  role,
  departments,
}: {
  role: Role | undefined;
  departments: Department[];
}) {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [timekeeper, setTimeKepeer] = useState<TimeKeeper>();

  const { data: session } = useSession();

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

  const initialValues = {
    contractorId: timekeeper?.contractorid || "",
    contractorName: timekeeper?.contractorname || "John Doe",
    employeeid: timekeeper?.employeeid || "",
    designation: timekeeper?.designation || "",

    machineInTime: timekeeper?.machineInTime || "",
    machineOutTime: timekeeper?.machineOutTime || "",
    machineduration: timekeeper?.machineduration || "",
    machineshift: timekeeper?.machineshift || "Day",
    attendance: timekeeper?.attendance || 0,
    attendancedate: timekeeper?.attendancedate || "",
    overtime: timekeeper?.overtime || 2,
    eleave: timekeeper?.eleave || 0,
    manualintime: timekeeper?.manualintime || null,
    manualouttime: timekeeper?.manualouttime || null,
    manualshift: timekeeper?.manualshift || null,
    manualovertime: timekeeper?.manualovertime ?? null,
    manualduration: timekeeper?.manualduration || null,
    mleave: timekeeper?.mleave || null,
    department: timekeeper?.department || "",
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
      <CircularProgress sx={{ color: "#673ab7" }} />
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
            width: 9,
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
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            const {
              comment,
              uploadDocument,
              contractorId,
              contractorName,
              attendance,
              mleave,
              manualovertime,
              ...others
            } = values;
            setSubmitting(true);
            let changestr = "";
            console.log(
              values.manualduration,
              timekeeper?.manualduration,
              "malkdjflk"
            );

            if (values.manualduration !== timekeeper?.manualduration) {
              changestr += `Manual Duration changed from ${
                timekeeper?.manualduration || timekeeper?.machineduration
              } to ${values.manualduration}, `;
            }
            if (values.manualintime !== timekeeper?.manualintime) {
              changestr += `Manual In Time changed from ${
                timekeeper?.manualintime || timekeeper?.machineInTime
              } to ${values.manualintime}, `;
            }

            if (values.manualouttime !== timekeeper?.manualouttime) {
              changestr += `Manual Out Time changed from ${
                timekeeper?.manualouttime || timekeeper?.machineOutTime
              } to ${values.manualouttime}, `;
            }

            if (values.manualshift !== timekeeper?.manualshift) {
              changestr += `Manual Shift changed from ${
                timekeeper?.manualshift || timekeeper?.machineshift
              } to ${values.manualshift}, `;
            }

            if (values.manualovertime !== timekeeper?.manualovertime) {
              changestr += `Manual Overtime changed from ${
                timekeeper?.manualovertime || timekeeper?.overtime
              } to ${values.manualovertime}, `;
            }

            if (values.mleave !== timekeeper?.mleave) {
              changestr += `Manual Leave changed from ${
                timekeeper?.mleave || timekeeper?.eleave
              } to ${values.mleave}, `;
            }

            if (values.attendance !== timekeeper?.attendance) {
              changestr += `Attendance changed from ${
                timekeeper?.attendance || 0
              } to ${values.attendance}, `;
            }
            console.log(changestr);

            if (
              values.attendance === "1" &&
              values.mleave &&
              values.mleave !== "0"
            ) {
              setErrors({ mleave: "Manual Leave should be 0" });
              return;
            }
            await axios
              .put("/api/timekeeper", {
                id: id,
                uploadDocument: uploadDocument,
                comment,
                userId: session?.user?.id,
                userName: session?.user?.name,
                attendance: values.attendance.toString(),
                mleave: values.mleave?.toString(),
                manualovertime:
                  parseFloat(values.manualovertime?.toString() ?? "") ?? null,
                role: role,
                changes: changestr,
                ...others,
              })
              .then((res) => {
                router.push("/");
              })
              .catch((err) => {
                console.log(err);
              });
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, values, initialValues, isSubmitting }) => {
            return (
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
                      name="machineduration"
                      label="Machine Total Duration "
                      placeHolder="Machine Total Duration"
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
                    <FormDate
                      name="attendancedate"
                      label="Attendance Date"
                      placeHolder="Attendance Date"
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="attendance"
                      label="Attendance"
                      placeHolder="Attendance"
                      disabled={false}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormInput
                      name="designation"
                      label="Designation"
                      placeHolder="Designation"
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
                      name="manualduration"
                      label="Manual Total Duration"
                      placeHolder="Manual Total Duration"
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
                    <FormSelect
                      name="department"
                      label="Department"
                      placeHolder="Department"
                      disabled={false}
                      options={departments.map((d) => ({
                        value: d.department,
                        label: d.department,
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormSelect
                      name="gender"
                      label="Gender"
                      placeHolder="Gender"
                      disabled={false}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                      ]}
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
                  disabled={isSubmitting}
                >
                  Submit
                  {isSubmitting && (
                    <CircularProgress
                      size={15}
                      sx={{ ml: 1, color: "#364152" }}
                    />
                  )}
                </Button>
              </form>
            );
          }}
        </Formik>
      </Paper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const departments = await prisma.department.findMany();
  return {
    props: {
      role: session?.user?.role,
      departments,
    },
  };
};
