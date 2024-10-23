import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
// import {  useState } from "react";
import FormInput from '@/components/FormikComponents/FormInput';
import * as Yup from 'yup';
import { Formik } from 'formik';
import FormSelect from '@/components/FormikComponents/FormSelect';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import {
  Contractor,
  Deductions,
  Department,
  Designations,
  Employee,
  FinalCalculations,
  FixedValues,
  Payments,
  Safety,
  Stores,
} from '@prisma/client';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import AutoCompleteSelect from '@/components/FormikComponents/AutoCompleteSelect';
import FormDate from '@/components/FormikComponents/FormDate';
import MonthSelect from '@/ui-component/MonthSelect';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object().shape({
  contractorId: Yup.string().required('Required'),
  month: Yup.string().required('Required'),

  paymentdate: Yup.string().required('Required'),
  paymentrefno: Yup.string().required('Required'),
  netpayable: Yup.number().required('Required'),
  paidamount: Yup.number().required('Required'),
});

export default function Edit({
  contractors,
  payment,
}: {
  contractors: (Contractor & {
    departments: Department[];
    fixedValues: FixedValues[];
  })[];
  payment: Payments | null;
}) {
  const router = useRouter();

  const initialValues = {
    contractorId: payment?.contractorId || '',
    month: payment?.month || dayjs().format('MM/YYYY'),
    paymentdate: payment?.paymentdate || '',
    paymentrefno: payment?.paymentrefno || '',
    netpayable: payment?.netpayable || 0,
    paidamount: payment?.paidamount || 0,
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
            Add Payment
          </Typography>
        </Box>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setErrors, setSubmitting }) => {
            const contractor = contractors.find(
              (contractor) => contractor.contractorId === values.contractorId
            );

            const fixedValue = contractor?.fixedValues.find(
              (fixedValue) => fixedValue.month === values.month
            );
            const netpayable = fixedValue?.total;

            setSubmitting(true);

            if (payment) {
              await axios
                .put(`/api/payments`, {
                  ...values,
                  contractorName: contractor?.contractorname,
                  id: payment.id,
                })
                .then((res) => {
                  router.push('/payments');
                })
                .catch((err) => {
                  console.log(err);
                });
              setSubmitting(false);
            } else
              await axios
                .post('/api/payments', {
                  ...values,
                  contractorName: contractor?.contractorname,
                })
                .then((res) => {
                  router.push('/payments');
                })
                .catch((err) => {
                  console.log(err);
                });
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, values, isSubmitting, setFieldValue }) => {
            const contractor = contractors.find(
              (contractor) => contractor.contractorId === values.contractorId
            );

            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid ml={3} mt={2} container>
                  <Grid item xs={12} sm={6} xl={4}>
                    <AutoCompleteSelect
                      name='contractorId'
                      label='Contractor Name*'
                      placeHolder='Contractor Name'
                      disabled={false}
                      options={
                        contractors?.map((contractor) => ({
                          value: contractor.contractorId,
                          label:
                            contractor.contractorname +
                            ' - ' +
                            contractor.contractorId,
                        })) || []
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4} sx={{ my: '16px' }}>
                    <MonthSelect
                      label='Month*'
                      value={dayjs(values.month, 'MM/YYYY')}
                      onChange={(value) => {
                        setFieldValue('month', dayjs(value).format('MM/YYYY'));
                      }}
                    />
                  </Grid>

                  <NetPayableInput
                    values={values}
                    setFieldValue={setFieldValue}
                    contractor={contractor}
                  />
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormDate
                      name='paymentdate'
                      label='Payment Date*'
                      placeHolder='Enter the Payment Date'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name='paymentrefno'
                      label='Payment Ref No*'
                      placeHolder='Enter the Payment Ref No'
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} xl={4}>
                    <FormInput
                      name='paidamount'
                      label='Paid Amount*'
                      placeHolder='Paid Amount'
                      disabled={false}
                      type='number'
                    />
                  </Grid>
                </Grid>
                <Button
                  type='submit'
                  variant='contained'
                  color='secondary'
                  sx={{ float: 'right', mr: 10 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <CircularProgress
                      size={15}
                      sx={{ mr: 1, color: '#364152' }}
                    />
                  )}
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

const NetPayableInput = ({
  values,
  setFieldValue,
  contractor,
}: {
  values: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  contractor:
    | (Contractor & {
        departments: Department[];
      })
    | undefined;
}) => {
  const [fixedData, setFixedData] = useState<{
    safety: Safety | null;
    store: Stores | null;
    deductions: Deductions | null;
    fixedvalues: FixedValues | null;
    finalCalculations: FinalCalculations | null;
  } | null>(null);

  const fetchFixedData = async () => {
    const response = await axios.get(
      `/api/paymentsFixedData?contractorId=${contractor?.contractorId}&month=${values.month}`
    );
    setFixedData(response.data);
  };

  useEffect(() => {
    fetchFixedData();
  }, [contractor, values.month]);

  useEffect(() => {
    const safetyAmount = fixedData?.safety?.totalAmount || 0;
    const storeAmount = fixedData?.store?.totalAmount || 0;
    const total =
      (fixedData?.fixedvalues?.billamount || 0) -
      (fixedData?.fixedvalues?.tds || 0);

    const deduction = fixedData?.deductions;

    const netpayable =
      fixedData?.finalCalculations?.finalPayable ||
      total -
        safetyAmount +
        ((deduction?.gstrelease || 0) - (deduction?.gsthold || 0) || 0) -
        storeAmount -
        (deduction?.advance || 0) -
        (deduction?.anyother || 0) +
        (deduction?.addition || 0);

    setFieldValue('netpayable', netpayable);
    console.log(total, deduction, netpayable, safetyAmount);
  }, [fixedData]);

  return (
    <Grid item xs={12} sm={6} xl={4}>
      <FormInput
        name='netpayable'
        label='Net Payable*'
        placeHolder='Enter the Net Payable'
        disabled={false}
        // value={netpayable}
      />
    </Grid>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { id } = context.query;
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (session.user?.role === 'Admin') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const payment = await prisma.payments.findUnique({
    where: {
      id: id as string,
    },
  });

  const contractors = await prisma.contractor.findMany({
    include: {
      departments: true,
      fixedValues: true,
    },
  });

  return {
    props: {
      contractors,
      payment,
    },
  };
};
