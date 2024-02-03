import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import { useRouter } from "next/router";
// import {  useState } from "react";
import FormInput from "@/components/FormikComponents/FormInput";
import * as Yup from "yup";
import { FieldArray, Formik } from "formik";
import FormSelect from "@/components/FormikComponents/FormSelect";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  Contractor,
  Employee,
  Safety,
  SafetyItem,
  UnsafeActs,
} from "@prisma/client";
import axios from "axios";
import shortid from "shortid";
import FormDate from "@/components/FormikComponents/FormDate";
import dayjs from "dayjs";
import MonthSelect from "@/ui-component/MonthSelect";
import SelectMonth from "@/components/FormikComponents/FormMonth";
import AutoCompleteSelect from "@/components/FormikComponents/AutoCompleteSelect";

const numberType = Yup.number().required("Required");

const SafetyItem = Yup.object().shape({
  chargeableItemIssued: Yup.string().required("Required"),
  division: Yup.string().required("Required"),
  quantity: numberType,
  rate: numberType,
  netchargeableamount: numberType,
});

const UnsafeActs = Yup.object().shape({
  unsafeacts: Yup.string().required("Required"),
  division: Yup.string().required("Required"),
  frequency: numberType,
  penalty: numberType,
  remakrs: Yup.string().optional(),
});

const validationSchema = Yup.object().shape({
  contractorid: Yup.string().required("Required"),
  month: Yup.string().required("Required"),
  safetyItems: Yup.array().of(SafetyItem),
  unsafeActs: Yup.array().of(UnsafeActs),
  totalAmount: numberType.test(
    "sumOfChargeableAmounts",
    "Total amount should be equal to sum of chargeable amounts",
    function (value) {
      const { safetyItems, unsafeActs } = this.parent;
      const sumOfChargeableAmounts = safetyItems.reduce(
        (acc: any, item: any) => acc + Number(item.netchargeableamount || 0),
        0
      );
      const sumOfPenalties = unsafeActs.reduce(
        (acc: any, item: any) => acc + Number(item.penalty || 0),
        0
      );
      return Number(value) === sumOfChargeableAmounts + sumOfPenalties;
    }
  ),
  // division: Yup.string().required("Required"),
  // chargeableItemIssued: Yup.string().required("Required"),
  // penalty: Yup.string().required("Required"),
  // netchargeableamount: numberType,
});

export default function Edit({
  contractors,
  safety,
  safetyItems,
  unsafeActs,
}: {
  contractors: Contractor[];
  safety: Safety;
  safetyItems: SafetyItem[];
  unsafeActs: UnsafeActs[];
}) {
  const router = useRouter();

  const { id } = router.query;

  console.log("safetyItems", safetyItems);

  const initialValues = {
    contractorid: safety?.contractorid || "",
    month: safety?.month ?? dayjs().format("MM/YYYY"),
    // division: safety?.division || "",
    // chargeableItemIssued: safety?.chargeableItemIssued || "",
    // penalty: safety?.penalty || "",
    // netchargeableamount: safety?.netchargeableamount || 0,
    safetyItems:
      safetyItems.length > 0
        ? safetyItems.map((safetyItem) => ({
            chargeableItemIssued: safetyItem.chargeableItemIssued,
            division: safetyItem.division,
            quantity: safetyItem.quantity,
            rate: safetyItem.rate,
            netchargeableamount: safetyItem.netchargeableamount,
            remarks: safetyItem.remarks,
          }))
        : [
            {
              chargeableItemIssued: "",
              division: "",
              quantity: 0,
              rate: 0,
              netchargeableamount: 0,
              remarks: "",
            },
          ],
    unsafeActs:
      unsafeActs.length > 0
        ? unsafeActs.map((unsafeActsItem) => ({
            unsafeacts: unsafeActsItem.unsafeacts,
            division: unsafeActsItem.division,
            frequency: unsafeActsItem.frequency,
            penalty: unsafeActsItem.penalty,
            remarks: unsafeActsItem.remarks,
          }))
        : [
            {
              unsafeacts: "",
              division: "",
              frequency: 0,
              penalty: 0,
              remarks: "",
            },
          ],
    totalAmount: safety?.totalAmount || 0,
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
            Add Safety
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const id = safety ? safety.id : shortid.generate();
            axios
              .post("/api/safety", {
                id: id,
                contractorid: values.contractorid,
                contractorName: contractors.find(
                  (c) => c.contractorId === values.contractorid
                )?.contractorname,
                month: values.month,
                totalAmount: values.totalAmount,
                safetyItems: values.safetyItems.map((safetyItem) => ({
                  id: shortid.generate(),
                  safetyId: id,
                  chargeableItemIssued: safetyItem.chargeableItemIssued,
                  division: safetyItem.division,
                  quantity: safetyItem.quantity,
                  rate: safetyItem.rate,
                  netchargeableamount: safetyItem.netchargeableamount,
                  remarks: safetyItem.remarks,
                })),
                unsafeActs: values.unsafeActs.map((unsafeActsItem) => ({
                  id: shortid.generate(),
                  safetyId: id,
                  unsafeacts: unsafeActsItem.unsafeacts,
                  division: unsafeActsItem.division,
                  frequency: unsafeActsItem.frequency,
                  penalty: unsafeActsItem.penalty,
                  remarks: unsafeActsItem.remarks,
                })),
              })
              .then((res) => {
                router.push("/safety");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {({ handleSubmit, values, errors, setFieldValue, isSubmitting }) => {
            // if (!errors.division) {
            //   const options1 = options.filter((option) =>
            //     option.chargeableItemIssued.includes(values.division)
            //   );
            //   setOptions(options1);
            // }

            console.log("values", values);

            const itemsamount = values.safetyItems.reduce(
              (acc: any, item: any) =>
                acc + Number(item.netchargeableamount || 0),
              0
            );

            const unsafeamount = values.unsafeActs.reduce(
              (acc: any, item: any) => acc + Number(item.penalty || 0),
              0
            );

            const totalAmount = itemsamount + unsafeamount;

            if (totalAmount !== values.totalAmount) {
              setFieldValue("totalAmount", totalAmount);
            }

            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={3} mt={2} container>
                  <Grid item xs={12} sm={6} lg={4}>
                    <AutoCompleteSelect
                      name="contractorid"
                      label="Contractor Name*"
                      placeHolder="Contractor Name"
                      disabled={false}
                      options={
                        contractors?.map((contractor) => ({
                          value: contractor.contractorId,
                          label: contractor.contractorname,
                        })) || []
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <SelectMonth
                      name="month"
                      label="Month*"
                      placeHolder="Select a month"
                      disabled={false}
                      format="MM/YYYY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <FormInput
                      name="totalAmount"
                      label="Total Amount*"
                      placeHolder="Enter the Total Amount"
                      disabled={false}
                    />
                  </Grid>

                  <FieldArray1 setFieldValue={setFieldValue} values={values} />
                  <FieldArray2 setFieldValue={setFieldValue} values={values} />

                  {/* <Grid item xs={12} sm={6} lg={4}>
                    <FormInput
                      name="division"
                      label="Division*"
                      placeHolder="Enter the Division"
                      disabled={false}
                    />
                   
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <FormInput
                      name="penalty"
                      label="Chargeable Voilation*"
                      placeHolder="Enter the Chargeable Voilation"
                      disabled={false}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} lg={4}>
                    <FormInput
                      name="netchargeableamount"
                      label="Net Chargeable Amount*"
                      placeHolder="Enter the Net Chargeable Amount"
                      disabled={false}
                      type="number"
                    />
                  </Grid> */}
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  // disabled={isSubmitting}
                  sx={{ float: "right", mr: 10 }}
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
  values,
  setFieldValue,
}: {
  values: any;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}) {
  return (
    <FieldArray
      name="safetyItems"
      render={({ form, push, remove }) => {
        const { safetyItems } = form.values;

        return (
          <>
            <Stack my={4} spacing={0}>
              <Stack justifyContent="space-between" direction="row">
                <Typography variant="h4">
                  Chargeable Items : {safetyItems?.length || 0}
                </Typography>
              </Stack>
              {safetyItems?.map((value: any, index: number) => {
                if (value.quantity * value.rate !== value.netchargeableamount) {
                  setFieldValue(
                    `safetyItems.${index}.netchargeableamount`,
                    value.quantity * value.rate
                  );
                }
                return (
                  <Box key={index} p={2} borderRadius={8}>
                    <Grid
                      container
                      columns={12}
                      // spacing={{ xs: 1, sm: 1 }}
                    >
                      <Grid item xs={12} sm={6} lg={4}>
                        {/* <FormInput
                          name={`safetyItems.${index}.chargeableItemIssued`}
                          label="Chargeable Item Issued*"
                          placeHolder="Chargeable Item Issued"
                        /> */}
                        <AutoCompleteSelect
                          name={`safetyItems.${index}.chargeableItemIssued`}
                          label="Chargeable Item Issued*"
                          placeHolder="Chargeable Item Issued"
                          disabled={false}
                          options={[
                            { value: "Safety Shoes", label: "Safety Shoes" },
                            { value: "PPE Kit", label: "PPE Kit" },
                            { value: "Helmet", label: "Helmet" },
                            { value: "Safety Belt", label: "Safety Belt" },
                            {
                              value: "Safety Googles",
                              label: "Safety Googles",
                            },
                            { value: "Others", label: "Others" },
                          ]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`safetyItems.${index}.division`}
                          label="Division*"
                          placeHolder="Enter the Division"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`safetyItems.${index}.quantity`}
                          label="Quantity*"
                          placeHolder="Enter the Quantity"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`safetyItems.${index}.rate`}
                          label="Rate*"
                          placeHolder="Enter the Rate"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`safetyItems.${index}.netchargeableamount`}
                          label="Chargeable Amount*"
                          placeHolder="Enter the Chargeable Amount"
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`safetyItems.${index}.remarks`}
                          label="Remarks*"
                          placeHolder="Remarks"
                        />
                      </Grid>

                      <Grid item xs={12} lg={4} mt={"auto"} pb={2}>
                        {safetyItems.length > 1 && (
                          <Button
                            onClick={() => {
                              values.safetyItems[index].chargeableItemIssued =
                                "";
                              values.safetyItems[index].penalty = 0;
                              values.safetyItems[index].division = "";
                              values.safetyItems[index].netchargeableamount = 0;
                              remove(index);
                            }}
                            variant="contained"
                            color="error"
                            sx={{ float: "left" }}
                          >
                            Remove <Delete />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                    <Stack
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={3}
                    >
                      <Box display="flex" sx={{ alignSelf: "center" }}></Box>
                    </Stack>
                    <Divider />
                  </Box>
                );
              })}
              <IconButton
                onClick={() =>
                  push({
                    chargeableItemIssued: "",
                    division: "",
                    quantity: 0,
                    units: "",
                    rate: 0,
                    netchargeableamount: 0,
                  })
                }
                size="small"
                sx={{
                  bgcolor: "#673ab7",
                  alignSelf: "flex-start",
                  color: "white",
                  ":hover": { bgcolor: "#673ab7" },
                }}
              >
                <Add sx={{ color: "white" }} />
              </IconButton>
            </Stack>
          </>
        );
      }}
    />
  );
}

const options = [
  {
    value: "Without Safety helmet or chin strap",
    label: "Without Safety helmet or chin strap",
  },
  { value: "Without Safety belt", label: "Without Safety belt" },
  { value: "Misuse of safety helmet", label: "Misuse of safety helmet" },
  {
    value: "Misuse of safety helmet color standard",
    label: "Misuse of safety helmet color standard",
  },
  {
    value: "With safety belt without proper hooking & misuse of safety belt",
    label: "With safety belt without proper hooking & misuse of safety belt",
  },
  {
    value:
      "Work carried out without safety norms in front of senior person - Senior will be penalized",
    label:
      "Work carried out without safety norms in front of senior person - Senior will be penalized",
  },
  {
    value: "Work carried out without work permit",
    label: "Work carried out without work permit",
  },
  {
    value:
      "Without safety goggles, gloves, face shield, arm sleeve, leg guard, nose mask",
    label:
      "Without safety goggles, gloves, face shield, arm sleeve, leg guard, nose mask",
  },
  {
    value: "Using Earphone during duty hours",
    label: "Using Earphone during duty hours",
  },
  { value: "Without safety shoes", label: "Without safety shoes" },
  {
    value: "Sitting above the Handrails",
    label: "Sitting above the Handrails",
  },
  { value: "Vehicle over Speed", label: "Vehicle over Speed" },
  {
    value: "Vehicle without reverse horn",
    label: "Vehicle without reverse horn",
  },
  { value: "Vehicles without seat belt", label: "Vehicles without seat belt" },
  {
    value: "Vehicle hitting any objects",
    label: "Vehicle hitting any objects",
  },
  {
    value: "Without jean jacket and pant at hot work area",
    label: "Without jean jacket and pant at hot work area",
  },
  {
    value: "Two-wheeler without cross helmet/head",
    label: "Two-wheeler without cross helmet/head",
  },
  {
    value: "Sleeping at Near Panels/head",
    label: "Sleeping at Near Panels/head",
  },
  {
    value: "Taking Photographs and Videos during any incident",
    label: "Taking Photographs and Videos during any incident",
  },
  { value: "Crossing Barricading areas", label: "Crossing Barricading areas" },
  {
    value:
      "Two or more persons traveling in tractor or ajax machine, loader, etc.",
    label:
      "Two or more persons traveling in tractor or ajax machine, loader, etc.",
  },
  {
    value: "Material handling without guide rope",
    label: "Material handling without guide rope",
  },
  {
    value: "Misbehave with any Safety officer during duty",
    label: "Misbehave with any Safety officer during duty",
  },
  {
    value:
      "Not reporting any Incident or accident by Shift in charges or HOD, Hiding actual incident and making stories",
    label:
      "Not reporting any Incident or accident by Shift in charges or HOD, Hiding actual incident and making stories",
  },
  {
    value: "Misusing any fire extinguisher",
    label: "Misusing any fire extinguisher",
  },
  {
    value: "Found in alcoholic condition during working hours",
    label: "Found in alcoholic condition during working hours",
  },
  {
    value: "Lifting Person in Loader bucket for height work",
    label: "Lifting Person in Loader bucket for height work",
  },
  {
    value:
      "Carrying O2 cylinder in loader, JCB, and Rolling at Vehicle moment area",
    label:
      "Carrying O2 cylinder in loader, JCB, and Rolling at Vehicle moment area",
  },
  {
    value: "Using Mobile phone while driving",
    label: "Using Mobile phone while driving",
  },
  {
    value: "Roaming at Unauthorised access area other division",
    label: "Roaming at Unauthorised access area other division",
  },
  { value: "Misusing fire bucket", label: "Misusing fire bucket" },
  {
    value: "Without proper Electrical Isolation/ Earthing",
    label: "Without proper Electrical Isolation/ Earthing",
  },
  {
    value: "Failed to follow SOP during Unloading of Furnace oil & diesel",
    label: "Failed to follow SOP during Unloading of Furnace oil & diesel",
  },
  {
    value:
      "Height work, hot work, Confined space, Electrical safety without proper supervision",
    label:
      "Height work, hot work, Confined space, Electrical safety without proper supervision",
  },
  {
    value: "Excavation Work without barricading",
    label: "Excavation Work without barricading",
  },
  { value: "Without proper Scaffolding", label: "Without proper Scaffolding" },
  {
    value: "Without Care on Visitors by senior persons",
    label: "Without Care on Visitors by senior persons",
  },
  {
    value: "Without proper housekeeping at working area",
    label: "Without proper housekeeping at working area",
  },
  { value: "Smoking at plant premises", label: "Smoking at plant premises" },
  {
    value: "Roaming below EOT crane while lifting any materials",
    label: "Roaming below EOT crane while lifting any materials",
  },
];

function FieldArray2({
  values,
  setFieldValue,
}: {
  values: any;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}) {
  return (
    <FieldArray
      name="unsafeActs"
      render={({ form, push, remove }) => {
        const { unsafeActs } = form.values;

        return (
          <>
            <Stack my={4} spacing={0}>
              <Stack justifyContent="space-between" direction="row">
                <Typography variant="h4">
                  UnsafeActs and Voilations : {unsafeActs?.length || 0}
                </Typography>
              </Stack>
              {unsafeActs?.map((value: any, index: number) => {
                return (
                  <Box key={index} p={2} borderRadius={8}>
                    <Grid
                      container
                      columns={12}
                      // spacing={{ xs: 1, sm: 1 }}
                    >
                      <Grid item xs={12} sm={6} lg={4}>
                        {/* <FormInput
                          name={`unsafeActs.${index}.unsafeacts`}
                          label="Unsafe Acts and Voilation*"
                          placeHolder="Unsafe Acts and Voilation"
                        /> */}
                        <AutoCompleteSelect
                          name={`unsafeActs.${index}.unsafeacts`}
                          label="Unsafe Acts and Voilation*"
                          placeHolder="Unsafe Acts and Voilation"
                          disabled={false}
                          options={options}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`unsafeActs.${index}.division`}
                          label="Division*"
                          placeHolder="Enter the Division"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <FormInput
                          name={`unsafeActs.${index}.frequency`}
                          label="Frequency*"
                          placeHolder="Enter the Frequency"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`unsafeActs.${index}.penalty`}
                          label="Penalty*"
                          placeHolder="Enter the Penalty Amount"
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`unsafeActs.${index}.remarks`}
                          label="Remarks"
                          placeHolder="Enter the Remarks"
                        />
                      </Grid>

                      <Grid item xs={12} lg={4} px={10} mt={"auto"} pb={2}>
                        {unsafeActs.length > 1 && (
                          <Button
                            onClick={() => {
                              values.unsafeActs[index].unsafeacts = "";
                              values.unsafeActs[index].division = "";
                              values.unsafeActs[index].frequency = 0;
                              values.unsafeActs[index].penalty = 0;
                              values.unsafeActs[index].remakrs = "";
                              remove(index);
                            }}
                            variant="contained"
                            color="error"
                            sx={{ float: "right" }}
                          >
                            Remove <Delete />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                    <Stack
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={3}
                    >
                      <Box display="flex" sx={{ alignSelf: "center" }}></Box>
                    </Stack>
                    <Divider />
                  </Box>
                );
              })}
              <IconButton
                onClick={() =>
                  push({
                    unsafeActs: "",
                    division: "",
                    penalty: 0,
                    frequency: 0,
                    remarks: "",
                  })
                }
                size="small"
                sx={{
                  bgcolor: "#673ab7",
                  alignSelf: "flex-start",
                  color: "white",
                  ":hover": { bgcolor: "#673ab7" },
                }}
              >
                <Add sx={{ color: "white" }} />
              </IconButton>
            </Stack>
          </>
        );
      }}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { id } = context.query;

  const contractors = await prisma.contractor.findMany();
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  if (user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const safety = await prisma.safety.findUnique({
    where: {
      id: id as string,
    },
  });

  const safetyItems = await prisma.safetyItem.findMany({
    where: {
      safetyId: id as string,
    },
  });

  const UnsafeActsItems = await prisma.unsafeActs.findMany({
    where: {
      safetyId: id as string,
    },
  });

  return {
    props: {
      contractors,
      safety,
      safetyItems,
      unsafeActs: UnsafeActsItems,
    },
  };
};
