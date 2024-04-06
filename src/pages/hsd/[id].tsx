import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Hsd } from "@prisma/client";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import FormSelect from "@/components/FormikComponents/FormSelect";
import SelectMonth from "@/components/FormikComponents/FormMonth";
import dayjs from "dayjs";

// Define validation schema
const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required("Required"),
  month: Yup.string().required("Required"),
  recoverableRate: Yup.number().required("Required"),
  payableRate: Yup.number().required("Required"),
});

export default function AddHsd({
  contractors,
  hsd,
}: {
  contractors: Contractor[];
  hsd: Hsd | null;
}) {
  const router = useRouter();

  // Initial form values
  const initialValues = {
    contractorId: hsd?.contractorId || "",
    month: hsd?.month || dayjs().format("MM/YYYY"),
    recoverableRate: hsd?.recoverableRate || 0,
    payableRate: hsd?.payableRate || 0,
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
            Add Hsd Entry
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setErrors, setSubmitting }) => {
            setSubmitting(true);
            let body: any = {
              contractorId: values.contractorId,
              month: values.month,
              recoverableRate: values.recoverableRate,
              payableRate: values.payableRate,
            };
            if (hsd) {
              body.id = hsd.id;
            }
            axios
              .post("/api/hsd", body)
              .then((res) => {
                router.push("/hsd");
              })
              .catch((err) => {
                console.error("Error adding Hsd entry:", err);
                // Handle error messages if needed
              });
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid ml={3} mt={2} container>
                <Grid item xs={12} sm={6} xl={4}>
                  <FormSelect
                    name="contractorId"
                    label="Contractor ID*"
                    placeHolder="Enter Contractor ID"
                    disabled={false}
                    options={contractors.map((contractor) => ({
                      value: contractor.contractorId,
                      label: contractor.contractorname,
                    }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={4}>
                  <SelectMonth
                    name="month"
                    label="Month*"
                    placeHolder="Enter Month"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={4}>
                  <FormInput
                    name="recoverableRate"
                    label="Recoverable Rate*"
                    placeHolder="Enter Recoverable Rate"
                    disabled={false}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={4}>
                  <FormInput
                    name="payableRate"
                    label="Payable Rate*"
                    placeHolder="Enter Payable Rate"
                    disabled={false}
                    type="number"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{ float: "right", mr: 10 }}
                disabled={isSubmitting}
                color="secondary"
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
          )}
        </Formik>
      </Paper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const id = context.params?.id;
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (session.user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const contractors = await prisma.contractor.findMany();
  if (id != "add") {
    const hsd = await prisma.hsd.findUnique({
      where: {
        id: id as string,
      },
    });
    return {
      props: {
        hsd,
        contractors,
      },
    };
  }

  return {
    props: {
      contractors,
    },
  };
};
