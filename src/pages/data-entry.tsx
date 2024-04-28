import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
// import {  useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { FieldArray, Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  Contractor,
  Employee,
  FixedWork,
  HiredFixedWork,
  SaveHiredFixedWork,
  StoreItem,
  Stores,
} from "@prisma/client";
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
} from "@mui/material";
import AutoComplete from "@/ui-component/Autocomplete";
import axios from "axios";
import MonthSelect from "@/ui-component/MonthSelect";
import dayjs from "dayjs";
import Done from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";
import { get } from "lodash";

const numberType = Yup.number().required("Required");

const WorkItem = Yup.object().shape({
  description: Yup.string().required("Required"),
  rate: numberType,
  quantity: numberType,
  totalAmount: numberType,
  status: Yup.string(),
});

const validationSchema = Yup.object().shape({
  fixedworks: Yup.array().of(WorkItem),
});

interface ContractorWithFixedWorks extends Contractor {
  fixedworks: FixedWork[];
  hiredFixedWork: HiredFixedWork[];
  saveHiredFixedWork: SaveHiredFixedWork[];
}

export default function DataEntry({
  contractors,
  contractor,
}: {
  contractors: Contractor[];
  contractor: ContractorWithFixedWorks;
}) {
  const router = useRouter();
  const { month, contractorId } = router.query;

  const getFixedWorks = (
    work: FixedWork,
    contractor: ContractorWithFixedWorks
  ) => {
    const saveHiredFixedWork = contractor.saveHiredFixedWork.find(
      (hiredWork) => hiredWork.description === work.description
    );

    const hiredWork = contractor.hiredFixedWork.find(
      (hiredWork) => hiredWork.description === work.description
    );
    return {
      description: work.description,
      rate: work.rate,
      quantity: saveHiredFixedWork?.quantity ?? hiredWork?.quantity ?? 0,
      totalAmount:
        saveHiredFixedWork?.totalAmount ?? hiredWork?.totalAmount ?? 0,
      status: saveHiredFixedWork?.status ?? hiredWork?.status ?? "",
    };
  };

  const initialValues = {
    fixedworks:
      contractor.fixedworks.length > 0
        ? contractor.fixedworks.map((work) => getFixedWorks(work, contractor))
        : [],
  };

  console.log(contractor);

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
            width: 9,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ height: "3rem", display: "flex", alignItems: "center" }}>
          <Typography variant="h4" ml={3} my="auto">
            Data Entry
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const { fixedworks } = values;
            const hiredFixedWorks = fixedworks.filter((work) => {
              const h = contractor.hiredFixedWork.find(
                (hiredWork) =>
                  hiredWork.description === work.description &&
                  hiredWork.month === month &&
                  hiredWork.rate === work.rate
              );
              if (h?.quantity !== work.quantity) {
                return true;
              }
              return false;
            });
            try {
              await axios.put("/api/fixedworks", {
                contractorId: contractor.contractorId,
                month: (month as string) || dayjs().format("MM/YYYY"),
                fixedworks: hiredFixedWorks,
              });
            } catch (error) {
              console.error(error);
            }
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, values, setFieldValue, errors }) => {
            console.log(errors);

            console.log(values);

            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={3} mt={2} container>
                  <Grid item xs={12} sm={6} lg={4}>
                    <AutoComplete
                      value={contractor.contractorId}
                      setValue={(value) => {
                        router.push(
                          `/data-entry?month=${
                            month || dayjs().format("MM/YYYY")
                          }&contractorId=${value}`
                        );
                      }}
                      label="Contractor Name*"
                      options={
                        contractors?.map((contractor) => ({
                          value: contractor.contractorId,
                          label: contractor.contractorname,
                        })) || []
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <MonthSelect
                      label="Select Date"
                      value={
                        month && month !== "undefined"
                          ? dayjs(month as string, "MM/YYYY")
                          : dayjs()
                      }
                      onChange={(value) =>
                        router.push(
                          `/data-entry?month=${value?.format(
                            "MM/YYYY"
                          )}&contractorId=${contractor.contractorId}`
                        )
                      }
                    />
                  </Grid>
                </Grid>
                <FieldArray1
                  setFieldValue={setFieldValue}
                  contractorId={contractor.contractorId}
                  month={(month as string) || dayjs().format("MM/YYYY")}
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ float: "right", mr: 10 }}
                  color="secondary"
                >
                  Submit
                </Button>
              </form>
            );
          }}
        </Formik>
      </Paper>
    </>
  );
}

function FieldArray1({
  setFieldValue,
  contractorId,
  month,
}: {
  setFieldValue: (field: string, value: any) => void;
  contractorId?: string;
  month?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleApprove = async (work: HiredFixedWork) => {
    try {
      await axios.post("/api/fixedworks/approval", {
        month: (month as string) || dayjs().format("MM/YYYY"),
        contractorId: contractorId,
        description: work.description,
        status: "Approved",
      });
      router.replace(router.asPath);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FieldArray
      name="fixedworks"
      render={({ form }) => {
        const { fixedworks } = form.values;

        return (
          <>
            <TableContainer sx={{ my: 2, ml: 3, width: "100%", pr: 5 }}>
              <Table sx={{ minWidth: 750 }}>
                <TableHead sx={{ width: "100%" }}>
                  <TableRow sx={{ bgcolor: "#eeeeee" }}>
                    <TableCell>Description</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Status</TableCell>
                    {session?.user?.role === "PlantCommercial" && (
                      <TableCell>Action</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fixedworks?.map((value: HiredFixedWork, index: number) => {
                    const totalAmount = value.rate * value.quantity;
                    if (totalAmount !== value.totalAmount) {
                      setFieldValue(
                        `fixedworks.${index}.totalAmount`,
                        totalAmount
                      );
                    }
                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ py: 0 }}>
                          <FormInput
                            name={`fixedworks.${index}.description`}
                            placeHolder="Enter the Description"
                            // disabled={true}
                            onChange={() => {}}
                            sx={{ maxWidth: 550, width: 300 }}
                            multiline
                            maxRows={4}
                          />
                          {/* <TextareaAutosize value={value.description} /> */}
                        </TableCell>
                        <TableCell sx={{ py: 0 }}>
                          <FormInput
                            name={`fixedworks.${index}.rate`}
                            placeHolder="Enter the Rate"
                            type="number"
                            sx={{ maxWidth: 150 }}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 0 }}>
                          <FormInput
                            name={`fixedworks.${index}.quantity`}
                            placeHolder="Enter the Quantity"
                            type="number"
                            sx={{ maxWidth: 150 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 0 }}>
                          <FormInput
                            name={`fixedworks.${index}.totalAmount`}
                            placeHolder="Enter the Total Amount"
                            type="number"
                            sx={{ maxWidth: 150 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 0 }}>{value.status}</TableCell>
                        {session?.user?.role === "PlantCommercial" &&
                          value.status === "Pending" && (
                            <TableCell>
                              <IconButton onClick={() => handleApprove(value)}>
                                <Done sx={{ color: "#673AB7" }} />
                              </IconButton>
                              <IconButton>
                                <Close sx={{ color: "#673AB7" }} />
                              </IconButton>
                            </TableCell>
                          )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );
      }}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  let { contractorId, month } = context.query;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (
    !(
      session.user?.role === "Fixed" || session.user?.role === "PlantCommercial"
    )
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const contractors = await prisma.contractor.findMany({
    where: {
      servicedetail: "Fixed",
    },
  });

  if (!contractorId) {
    contractorId = contractors[0]?.contractorId;
  }

  const contractor = await prisma.contractor.findUnique({
    where: {
      contractorId: contractorId as string,
    },
    include: {
      fixedworks: {
        select: {
          description: true,
          rate: true,
        },
      },
      hiredFixedWork: {
        where: {
          month: (month as string) || dayjs().format("MM/YYYY"),
        },
        select: {
          description: true,
          rate: true,
          quantity: true,
          totalAmount: true,
          status: true,
        },
      },
      saveHiredFixedWork: {
        where: {
          month: (month as string) || dayjs().format("MM/YYYY"),
        },
        select: {
          description: true,
          rate: true,
          quantity: true,
          totalAmount: true,
          status: true,
        },
      },
    },
  });

  if (!contractor) {
    return {
      redirect: {
        destination: "/data-entry",
        permanent: false,
      },
    };
  }

  return {
    props: {
      contractors,
      contractor,
    },
  };
};
