import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import FormInput from '@/components/FormikComponents/FormInput';
import * as Yup from 'yup';
import { FieldArray, Form, Formik } from 'formik';
import FormSelect from '@/components/FormikComponents/FormSelect';
import FileUpload from '@/components/FormikComponents/FileUpload';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';
import {
  Contractor,
  DebitNote,
  HOAuditor,
  OtherAddition,
  OtherDeduction,
} from '@prisma/client';
import FormDate from '@/components/FormikComponents/FormDate';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Dayjs } from 'dayjs';
import hoauditor from '../api/hoauditor';
// import { Contractor } from "@prisma/client"

const fileType = Yup.string().optional();

const debitNoteSchema = Yup.object().shape({
  amount: Yup.number().required('Required'),
  gst: Yup.number().required('Required'),
  tds: Yup.number().required('Required'),
  netamount: Yup.number().required('Required'),
  remarks: Yup.string().required('Required'),
});

const otherDeductionSchema = Yup.object().shape({
  label: Yup.string().required('Required'),
  amount: Yup.number().required('Required'),
  remarks: Yup.string().required('Required'),
});

const otherAdditionSchema = Yup.object().shape({
  label: Yup.string().required('Required'),
  amount: Yup.number().required('Required'),
  remarks: Yup.string().required('Required'),
});

const validationSchema = Yup.object().shape({
  contractorname: Yup.string().required('Required'),
  workDescription: Yup.string().required('Required'),
  invoiceNo: Yup.string().required('Required'),
  uploadDoc1: fileType,
  uploadDoc2: fileType,
  date: Yup.string().required('Required'),
  monthOfInvoice: Yup.string().required('Required'),
  fromDate: Yup.string().required('Required'),
  toDate: Yup.string().required('Required'),
  dateOfReceiving: Yup.string(),
  basicbillamount: Yup.number().required('Required'),
  firstbillormonthly: Yup.string().required('Required'),
  taxableAmount: Yup.number().required('Required'),
  tds: Yup.number().required('Required'),
  serviceCharges: Yup.number().required('Required'),
  debitNotes: Yup.array().of(debitNoteSchema),
  otherDeductions: Yup.array().of(otherDeductionSchema),
  otherAdditions: Yup.array().of(otherAdditionSchema),
  // Organsiation Details
  totalbillAmount: Yup.number().required('Required'),
  gst: Yup.number().required('Required'),
  netbillAmount: Yup.number().required('Required'),
  sapstatus: Yup.string(),
  tdsstatus: Yup.string(),
  gststatus: Yup.string(),
  gstr1: Yup.string(),
  gstr3b: Yup.string(),
  wostatus: Yup.string(),
  remarks: Yup.string(),
  uploadDoc4: fileType,
  uploadDoc3: fileType,
  uploadDoc5: fileType,
  bankDetails: Yup.string().required('Required'),
  onetimeInvoice: Yup.boolean().required('Required'),
  verifiedComplainces: Yup.boolean().required('Required'),
  workOrderAvailable: Yup.boolean().required('Required'),
  licensesInPlace: Yup.boolean().required('Required'),
  previousMonthPayReceived: Yup.boolean().required('Required'),
  previousPayVerified: Yup.boolean().required('Required'),
  detailsSentToAuditAndHo: Yup.boolean().required('Required'),
  gstChallanAttached: Yup.boolean().required('Required'),
  //Service / Product Details
  deductions: Yup.string().required('Required'),
  variationsInManpower: Yup.string().required('Required'),
  manchineOrRegisterMode: Yup.string().required('Required'),
  uploadDoc6: fileType,
});

export default function HoAuditorForm({
  contractor,
  hoAuditor,
}: {
  contractor: Contractor;
  hoAuditor:
    | (HOAuditor & {
        otherAdditions: OtherAddition[];
        debitNotes: DebitNote[];
        otherDeductions: OtherDeduction[];
      })
    | null;
}) {
  const router = useRouter();

  console.log(hoAuditor, 'hoAuditor');

  const initialValues = {
    contractorname: contractor.contractorname || '',
    workDescription: hoAuditor?.workDescription || '',
    invoiceNo: hoAuditor?.invoiceNo || '',
    uploadDoc1: hoAuditor?.uploadDoc1 || undefined,
    uploadDoc2: hoAuditor?.uploadDoc2 || undefined,
    date: hoAuditor?.date || undefined,
    monthOfInvoice: hoAuditor?.monthOfInvoice || '',
    fromDate: hoAuditor?.fromDate || undefined,
    toDate: hoAuditor?.toDate || undefined,
    dateOfReceiving: hoAuditor?.dateOfReceiving || undefined,
    basicbillamount: hoAuditor?.basicbillamount || 0,
    taxableAmount: hoAuditor?.taxableAmount || 0,
    tds: hoAuditor?.tds || 0,
    serviceCharges: hoAuditor?.serviceCharges || 0,
    totalbillAmount: hoAuditor?.totalbillAmount || 0,
    gst: hoAuditor?.gst || 0,
    netbillAmount: hoAuditor?.netbillAmount || 0,
    sapstatus: hoAuditor?.sapstatus || '',
    tdsstatus: hoAuditor?.tdsstatus || '',
    gststatus: hoAuditor?.gststatus || '',
    gstr1: hoAuditor?.gstr1 || '',
    gstr3b: hoAuditor?.gstr3b || '',
    wostatus: hoAuditor?.wostatus || '',
    remarks: hoAuditor?.remarks || '',
    uploadDoc4: hoAuditor?.uploadDoc4 || undefined,
    uploadDoc3: hoAuditor?.uploadDoc3 || undefined,
    uploadDoc5: hoAuditor?.uploadDoc5 || undefined,
    bankDetails: hoAuditor?.bankDetails || '',
    onetimeInvoice: hoAuditor?.onetimeInvoice || false,
    verifiedComplainces: hoAuditor?.verifiedComplainces || false,
    workOrderAvailable: hoAuditor?.workOrderAvailable || false,
    licensesInPlace: hoAuditor?.licensesInPlace || false,
    previousMonthPayReceived: hoAuditor?.previousMonthPayReceived || false,
    previousPayVerified: hoAuditor?.previousPayVerified || false,
    detailsSentToAuditAndHo: hoAuditor?.detailsSentToAuditAndHo || false,
    gstChallanAttached: hoAuditor?.gstChallanAttached || false,
    deductions: hoAuditor?.deductions || '',
    variationsInManpower: hoAuditor?.variationsInManpower || '',
    manchineOrRegisterMode: hoAuditor?.manchineOrRegisterMode || '',
    uploadDoc6: hoAuditor?.uploadDoc6 || undefined,
    debitNotes: hoAuditor?.debitNotes || [
      {
        amount: 0,
        gst: 0,
        tds: 0,
        netamount: 0,
        remarks: '',
      },
    ],
    otherDeductions: hoAuditor?.otherDeductions || [
      {
        label: 'Other Deductions - 1',
        amount: 0,
        remarks: '',
      },
    ],
    otherAdditions: hoAuditor?.otherAdditions || [
      {
        label: 'Other Additions - 1',
        amount: 0,
        remarks: '',
      },
    ],
  };

  return (
    <>
      <Paper
        sx={{
          height: '83.7vh',
          pt: '1rem',
          pb: '8rem',
          overflow: 'hidden auto',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: 7,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ height: '3rem', display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' ml={5} my='auto'>
            HO Commercial Form
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            if (hoAuditor) {
              await axios
                .put('/api/hoauditor', {
                  ...values,
                  contractorId: contractor?.id,
                  id: hoAuditor.id,
                })
                .then((res) => {
                  router.push('/hoauditor');
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              await axios
                .post('/api/hoauditor', {
                  ...values,
                  contractorId: contractor?.id,
                })
                .then((res) => {
                  router.push('/hoauditor');
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            console.log(values, 'values');
          }}
        >
          {({ handleSubmit, errors, values, setFieldValue }) => {
            console.log(values, 'values');

            return (
              <form noValidate onSubmit={handleSubmit}>
                <Stack spacing={0}>
                  <Typography variant='h4' ml={4} my={3}>
                    Kindly Provide the details required below.
                  </Typography>
                  <Grid ml={{ xs: 0, sm: 2, md: 6 }} container>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='contractorname'
                        label='Contractor Name*'
                        placeHolder='Enter the Contractor Name'
                        disabled={false}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='workDescription'
                        label='Work Description*'
                        placeHolder='Enter Work Description'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='invoiceNo'
                        label='Invoice No*'
                        placeHolder='Enter Invoice No'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormDate
                        name='date'
                        label='Date of Invoice'
                        placeHolder='Enter the date'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormDate
                        name='monthOfInvoice'
                        label='Month Of Invoice*'
                        placeHolder='Month Of Invoice'
                        views={['month', 'year']}
                        // views={["year", "month"]}
                        format='MM/YYYY'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormDate
                        name='fromDate'
                        label='From Date*'
                        placeHolder='Enter the From Date'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormDate
                        name='toDate'
                        label='To Date'
                        placeHolder='Enter the To Date'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormDate
                        name='dateOfReceiving'
                        label='Date of Receiving'
                        placeHolder='Enter the Date of Receiving'
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='firstbillormonthly'
                        label='Whether First Bill Or Regular Monthly*'
                        placeHolder='Select First Bill Or Regular Monthly'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='basicbillamount'
                        label='Basic Bill Amount*'
                        placeHolder='Enter Basic Bill Amount'
                        disabled={false}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='serviceCharges'
                        label='Service Charges*'
                        placeHolder='Enter Service Charges'
                        disabled={false}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='taxableAmount'
                        label='Taxable Amount*'
                        placeHolder='Enter taxable Amount'
                        disabled={false}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='gst'
                        label='GST*'
                        placeHolder='GST'
                        disabled={false}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='totalbillAmount'
                        label='Total Bill Amount*'
                        placeHolder='Enter the Total Bill Amount'
                        disabled={false}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='tds'
                        label={`TDS & TDS Rate@${contractor.tds}%* `}
                        placeHolder='Enter the TDS'
                        disabled={false}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='netbillAmount'
                        label='Net Bill Amount*'
                        placeHolder='Enter the Net Bill Amount'
                        disabled={false}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='sapstatus'
                        label='SAP status'
                        placeHolder='Enter SAP status'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='tdsstatus'
                        label='TDS status'
                        placeHolder='Enter the TDS status'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='gststatus'
                        label='GST Status'
                        placeHolder='Enter the  GST status'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='gstr1'
                        label='GSTR - 1'
                        placeHolder='Enter GSTR - 1'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='gstr3b'
                        label='GSTR-3B'
                        placeHolder='Enter GSTR-3B'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='wostatus'
                        label='WO Status'
                        placeHolder='Enter WO Status'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='remarks'
                        label='Remarks'
                        placeHolder='Enter the remarks'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='bankDetails'
                        label='Bank Details Available On Bill'
                        placeHolder='Enter the Bank Details Available On Bill'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DebitNotesArray
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ mb: '24px' }} />
                    </Grid>
                    <Grid item xs={12}>
                      <OtherDeductionsArray
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ mb: '24px' }} />
                    </Grid>
                    <Grid item xs={12}>
                      <OtherAdditionArray
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ mb: '24px' }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name='uploadDoc1' label='Upload Document 1' />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name='uploadDoc2' label='Upload Document 2' />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name='uploadDoc3' label='Upload Document 3' />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name='uploadDoc4' label='Upload Document 4' />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name='uploadDoc5' label='Upload Document 5' />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />
                <Stack spacing={0}>
                  <Typography variant='h4' ml={4} my={4}>
                    Kindly Select Yes or No for the following fields
                  </Typography>

                  <Grid ml={{ xs: 0, sm: 2, md: 6 }} mt={2} container>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name='onetimeInvoice'
                        label='Whether One Time Invoice*'
                        placeHolder='Select One Time Invoice or Not'
                        disabled={false}
                        options={[
                          { value: true, label: 'Yes' },
                          { value: false, label: 'No' },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name='verifiedComplainces'
                        label='Verified for Compliances or not*'
                        placeHolder='Turnover Last Year'
                        disabled={false}
                        options={[
                          { value: true, label: 'Yes' },
                          { value: false, label: 'No' },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name='workOrderAvailable'
                        label='Word Order Available or Not*'
                        placeHolder='Word Order Available or Not'
                        disabled={false}
                        options={[
                          { value: true, label: 'Yes' },
                          { value: false, label: 'No' },
                        ]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name='licensesInPlace'
                        label='Labour Licenses & Other Licenses in Place or Not*'
                        placeHolder='Labour Licenses & Other Licenses in Place or Not'
                        disabled={false}
                        options={[
                          { value: true, label: 'Yes' },
                          { value: false, label: 'No' },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name='previousMonthPayReceived'
                        label='Previous Month Pay received or Not*'
                        placeHolder='Previous Month Pay received or Not'
                        disabled={false}
                        options={[
                          { value: true, label: 'Yes' },
                          { value: false, label: 'No' },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name='previousPayVerified'
                        label='Previous Month Pay Register Checked Or Verified With Previous Month*'
                        placeHolder='Select a option'
                        disabled={false}
                        options={[
                          { value: true, label: 'Yes' },
                          { value: false, label: 'No' },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name='detailsSentToAuditAndHo'
                        label='Details of variations sent to audit and HO*'
                        placeHolder='Details of variations sent to audit and HO'
                        disabled={false}
                        options={[
                          { value: true, label: 'Yes' },
                          { value: false, label: 'No' },
                        ]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormSelect
                        name='gstChallanAttached'
                        label='Whether GST Challa of Previous Month Attached?*'
                        placeHolder='Select a option'
                        disabled={false}
                        options={[
                          { value: true, label: 'Yes' },
                          { value: false, label: 'No' },
                        ]}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />
                <Stack spacing={0} mt={4}>
                  <Typography variant='h4' ml={4} my='auto'>
                    Kindly Provide the information required and suitable reasons
                    for the same if any.
                  </Typography>
                  <Grid ml={{ xs: 0, sm: 2, md: 6 }} mt={0} container>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='deductions'
                        label='Deductions'
                        placeHolder='Enter the Deductions'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='variationsInManpower'
                        label='Variations in Manpower'
                        placeHolder='Enter the Variations in Manpower'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormInput
                        name='manchineOrRegisterMode'
                        label='Whether Machine or Register Attendance Mode Adopted?*'
                        placeHolder='Enter whether Machine or Register Mode'
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FileUpload name='uploadDoc6' label='Upload Document 6' />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />

                <Button
                  type='submit'
                  variant='contained'
                  sx={{ float: 'right', mr: 10 }}
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

function DebitNotesArray({
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
      name='debitNotes'
      render={({ form, push, remove }) => {
        const { debitNotes } = form.values;

        return (
          <>
            <Stack mb={2} spacing={0}>
              <Stack justifyContent='space-between' direction='row'>
                <Typography variant='h4'>
                  Debit Notes : {debitNotes?.length || 0}
                </Typography>
              </Stack>
              {debitNotes?.map((value: any, index: number) => {
                // if (value.rate * value.quantity !== value.chargeableamount) {
                //   setFieldValue(
                //     `debitNotes.${index}.chargeableamount`,
                //     value.rate * value.quantity
                //   );
                // }
                return (
                  <Box key={index} p={2} borderRadius={8}>
                    <Grid
                      container
                      columns={12}
                      columnSpacing={2}
                      // spacing={{ xs: 1, sm: 1 }}
                    >
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`debitNotes.${index}.amount`}
                          label={'Debit Note - ' + (index + 1) + '*'}
                          placeHolder='Chargeable Item Issued'
                          type='number'
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`debitNotes.${index}.gst`}
                          label='GST*'
                          placeHolder='Enter the GST'
                          type='number'
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`debitNotes.${index}.tds`}
                          label='TDS*'
                          placeHolder='Enter the TDS'
                          type='number'
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`debitNotes.${index}.netamount`}
                          label='Debit Note Net Amt.*'
                          placeHolder='Enter  Debit Note Net Amt.'
                          type='number'
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`debitNotes.${index}.remarks`}
                          label='Remarks*'
                          placeHolder='Enter the Remarks'
                        />
                      </Grid>

                      <Grid item xs={12} px={10} pb={2}>
                        {debitNotes.length > 1 && (
                          <Button
                            onClick={() => {
                              values.debitNotes[index].amount = 0;
                              values.debitNotes[index].gst = 0;
                              values.debitNotes[index].tds = 0;
                              values.debitNotes[index].netamount = 0;
                              values.debitNotes[index].remarks = '';
                              remove(index);
                            }}
                            variant='contained'
                            color='error'
                            sx={{ float: 'right' }}
                          >
                            Remove <Delete />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                    <Stack
                      justifyContent='flex-start'
                      alignItems='flex-start'
                      spacing={3}
                    >
                      <Box display='flex' sx={{ alignSelf: 'center' }}></Box>
                    </Stack>
                    <Divider />
                  </Box>
                );
              })}
              <IconButton
                onClick={() =>
                  push({
                    amount: 0,
                    gst: 0,
                    tds: 0,
                    netamount: 0,
                    remarks: '',
                  })
                }
                size='small'
                sx={{
                  bgcolor: '#673ab7',
                  alignSelf: 'flex-start',
                  color: 'white',
                  ':hover': { bgcolor: '#673ab7' },
                }}
              >
                <Add sx={{ color: 'white' }} />
              </IconButton>
            </Stack>
          </>
        );
      }}
    />
  );
}

function OtherDeductionsArray({
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
      name='otherDeductions'
      render={({ form, push, remove }) => {
        const { otherDeductions } = form.values;

        return (
          <>
            <Stack my={2} spacing={0}>
              <Stack justifyContent='space-between' direction='row'>
                <Typography variant='h4'>
                  Other Deductions : {otherDeductions?.length || 0}
                </Typography>
              </Stack>
              {otherDeductions?.map((value: any, index: number) => {
                // if (value.rate * value.quantity !== value.chargeableamount) {
                //   setFieldValue(
                //     `otherDeductions.${index}.chargeableamount`,
                //     value.rate * value.quantity
                //   );
                // }
                return (
                  <Box key={index} p={2} borderRadius={8}>
                    <Grid
                      container
                      columns={12}
                      columnSpacing={2}
                      // spacing={{ xs: 1, sm: 1 }}
                    >
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`otherDeductions.${index}.amount`}
                          labelValue={value.label}
                          onChangeLabel={(v) => {
                            setFieldValue(
                              `otherDeductions.${index}.label`,
                              v.target.value
                            );
                          }}
                          placeHolder='Enter the Amount'
                          type='number'
                          editedableLabel={true}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`otherDeductions.${index}.remarks`}
                          label='Remarks*'
                          placeHolder='Enter the Remarks'
                        />
                      </Grid>

                      <Grid item xs={12} px={10} pb={2}>
                        {otherDeductions.length > 1 && (
                          <Button
                            onClick={() => {
                              value.otherDeductions[index].label =
                                'Other Deductions - ' + (index + 2);
                              values.otherDeductions[index].amount = 0;
                              values.otherDeductions[index].remarks = '';
                              remove(index);
                            }}
                            variant='contained'
                            color='error'
                            sx={{ float: 'right' }}
                          >
                            Remove <Delete />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                    <Stack
                      justifyContent='flex-start'
                      alignItems='flex-start'
                      spacing={3}
                    >
                      <Box display='flex' sx={{ alignSelf: 'center' }}></Box>
                    </Stack>
                    <Divider />
                  </Box>
                );
              })}
              <IconButton
                onClick={() =>
                  push({
                    label: 'Other Deductions - ' + (otherDeductions.length + 1),
                    amount: 0,
                    remarks: '',
                  })
                }
                size='small'
                sx={{
                  bgcolor: '#673ab7',
                  alignSelf: 'flex-start',
                  color: 'white',
                  ':hover': { bgcolor: '#673ab7' },
                }}
              >
                <Add sx={{ color: 'white' }} />
              </IconButton>
            </Stack>
          </>
        );
      }}
    />
  );
}

function OtherAdditionArray({
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
      name='otherAdditions'
      render={({ form, push, remove }) => {
        const { otherAdditions } = form.values;

        return (
          <>
            <Stack mb={2} spacing={0}>
              <Stack justifyContent='space-between' direction='row'>
                <Typography variant='h4'>
                  Other Additions : {otherAdditions?.length || 0}
                </Typography>
              </Stack>
              {otherAdditions?.map((value: any, index: number) => {
                return (
                  <Box key={index} p={2} borderRadius={8}>
                    <Grid
                      container
                      columns={12}
                      columnSpacing={2}
                      // spacing={{ xs: 1, sm: 1 }}
                    >
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`otherAdditions.${index}.amount`}
                          labelValue={value.label}
                          onChangeLabel={(v) => {
                            setFieldValue(
                              `otherAdditions.${index}.label`,
                              v.target.value
                            );
                          }}
                          placeHolder='Enter the Amount'
                          editedableLabel={true}
                          type='number'
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} lg={4}>
                        <FormInput
                          name={`otherAdditions.${index}.remarks`}
                          label='Remarks*'
                          placeHolder='Enter the Remarks'
                        />
                      </Grid>

                      <Grid item xs={12} px={10} pb={2}>
                        {otherAdditions.length > 1 && (
                          <Button
                            onClick={() => {
                              value.otherAdditions[index].label =
                                'Other Deductions - ' + (index + 2);
                              values.otherAdditions[index].amount = 0;
                              values.otherAdditions[index].remarks = '';
                              remove(index);
                            }}
                            variant='contained'
                            color='error'
                            sx={{ float: 'right' }}
                          >
                            Remove <Delete />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                    <Stack
                      justifyContent='flex-start'
                      alignItems='flex-start'
                      spacing={3}
                    >
                      <Box display='flex' sx={{ alignSelf: 'center' }}></Box>
                    </Stack>
                    <Divider />
                  </Box>
                );
              })}
              <IconButton
                onClick={() =>
                  push({
                    label: 'Other Deductions - ' + (otherAdditions.length + 1),
                    amount: 0,
                    remarks: '',
                  })
                }
                size='small'
                sx={{
                  bgcolor: '#673ab7',
                  alignSelf: 'flex-start',
                  color: 'white',
                  ':hover': { bgcolor: '#673ab7' },
                }}
              >
                <Add sx={{ color: 'white' }} />
              </IconButton>
            </Stack>
          </>
        );
      }}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, hoId } = context.query;
  const contractor = await prisma.contractor.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!contractor) {
    return {
      redirect: {
        destination: '/contractor',
        permanent: false,
      },
    };
  }
  const hoAuditor = await prisma.hOAuditor.findUnique({
    where: {
      id: (hoId as string) ?? '',
    },
    include: {
      debitNotes: true,
      otherDeductions: true,
      otherAdditions: true,
    },
  });

  return {
    props: {
      contractor,
      hoAuditor,
    },
  };
};
