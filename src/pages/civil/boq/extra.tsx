import {
  Button,
  Grid,
  CircularProgress,
  Box,
  Divider,
  Paper,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import FormInput from '@/components/FormikComponents/FormInput';
import { Contractor, Project, BOQ, BOQItem, Qcs } from '@prisma/client';
import FormSelect from '@/components/FormikComponents/FormSelect';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { useRouter } from 'next/router';
import AutoCompleteSelect from '@/components/FormikComponents/AutoCompleteSelect';
import { start } from 'nprogress';
import dayjs from 'dayjs';
import FormDate from '@/components/FormikComponents/FormDate';

const boqItemSchema = Yup.object().shape({
  id: Yup.string().optional(),
  unit: Yup.string(),
  description: Yup.string().required('Required'),
  nos: Yup.number().required('Required'),
  length: Yup.number().required('Required'),
  breadth: Yup.number().required('Required'),
  height: Yup.number().required('Required'),

  remarks: Yup.string().optional(),
});

const validationSchema = Yup.object().shape({
  boqId: Yup.string().required('Required'),
  projectId: Yup.string().required('Required'),
  BOQItems: Yup.array().of(boqItemSchema).required('Required'),
});

interface BOQWithItems extends BOQ {
  BOQItems: BOQItem[];
  contractor: Contractor;
}

const Addworkitem = ({
  projects,
}: {
  projects: (Project & {
    BOQ: BOQ[];
  })[];
}) => {
  const router = useRouter();

  const initialValues = {
    description: '',
    projectId: '',
    boqId: '',

    BOQItems: [
      {
        unit: '',
        description: '',
        nos: 0,
        length: 0,
        breadth: 0,
        height: 0,
        remarks: '',
      },
    ],
  };

  return (
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
          Add Extra BOQ Sheet
        </Typography>
      </Box>
      <Divider />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          let BOQItems: any[] = [];
          values.BOQItems.forEach((workItem) => {
            let quantity =
              workItem.nos *
              workItem.length *
              workItem.breadth *
              (workItem?.height || 1);

            const totalQuantity = quantity;
            BOQItems.push({
              ...workItem,
              quantity: parseFloat(quantity.toFixed(3)),
              totalQuantity: parseFloat(totalQuantity.toFixed(3)),
            });
          });

          console.log(BOQItems, values);

          setSubmitting(true);
          await axios.post('/api/civil/extraboq', {
            projectId: values.projectId,
            boqId: values.boqId,
            BOQItems,
          });

          setSubmitting(false);
          //   router.push("/civil/boq");
        }}
      >
        {({ errors, isSubmitting, handleSubmit, values, setFieldError }) => {
          const boqs =
            projects.find((project) => project.id === values.projectId)?.BOQ ||
            [];
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Box sx={{ px: '2rem' }}>
                <Stack direction='row' columnGap={5}>
                  <AutoCompleteSelect
                    name='projectId'
                    label='Select project'
                    placeHolder='Work Order'
                    sx={{ width: '100%', maxWidth: '100%' }}
                    options={projects.map((project) => ({
                      label: project.name,
                      value: project.id,
                    }))}
                  />
                  {/* <FormInput
                    name="description"
                    label="Description"
                    placeHolder="Description"
                    sx={{ width: "100%", maxWidth: "100%" }}
                  /> */}
                  <FormSelect
                    name='boqId'
                    label='Select BOQ'
                    placeHolder='Select BOQ'
                    options={boqs.map((boq) => ({
                      label: boq.description,
                      value: boq.id,
                    }))}
                    sx={{ width: '100%', maxWidth: '100%' }}
                  />
                </Stack>

                <Divider sx={{ my: 3 }} />
                <FieldArray
                  name='BOQItems'
                  render={({ form, push, remove }) => {
                    const { BOQItems } = form.values;
                    return (
                      <Stack>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            sx={{ fontSize: '1rem', fontWeight: '600' }}
                          >
                            Work Items
                          </Typography>
                          <Button
                            color='secondary'
                            variant='contained'
                            onClick={() =>
                              push({
                                description: '',
                                unit: '',
                                unitrate: 0,
                                nos: 0,
                                length: 0,
                                breadth: 0,
                                height: 0,
                                remarks: '',
                              })
                            }
                          >
                            Add
                          </Button>
                        </Box>
                        {BOQItems.map((workItem: any, index: number) => (
                          <Grid container columnGap={8}>
                            <Grid item xs={12} sm={10}>
                              <FormInput
                                name={`BOQItems.${index}.description`}
                                label='Description'
                                placeHolder='Description'
                                sx={{ width: '100%', maxWidth: '100%' }}
                              />
                            </Grid>
                            {BOQItems.length > 1 && (
                              <Grid item xs={12} sm={1}>
                                <IconButton
                                  sx={{
                                    mt: '2rem',
                                    ml: '1rem',
                                    color: 'white',
                                    bgcolor: 'red',
                                    ':hover': {
                                      bgcolor: '#e53935',
                                    },
                                  }}
                                  onClick={() => remove(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            )}

                            <Grid item xs={12} sm={5} md={4} lg={3}>
                              <FormInput
                                name={`BOQItems.${index}.unit`}
                                label='Unit'
                                type='text'
                                placeHolder='Unit'
                                sx={{ width: '100%', maxWidth: '100%' }}
                              />
                            </Grid>

                            <Grid item xs={12} sm={5} md={4} lg={3}>
                              <FormInput
                                name={`BOQItems.${index}.nos`}
                                label='Nos'
                                type='number'
                                placeHolder='Nos'
                                sx={{ width: '100%', maxWidth: '100%' }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5} md={4} lg={3}>
                              <FormInput
                                name={`BOQItems.${index}.length`}
                                label='Length'
                                type='number'
                                placeHolder='Length'
                                sx={{ width: '100%', maxWidth: '100%' }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5} md={4} lg={3}>
                              <FormInput
                                name={`BOQItems.${index}.breadth`}
                                label='Breadth'
                                type='number'
                                placeHolder='Breadth'
                                sx={{ width: '100%', maxWidth: '100%' }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5} md={4} lg={3}>
                              <FormInput
                                name={`BOQItems.${index}.height`}
                                label='Height'
                                type='number'
                                placeHolder='Height'
                                sx={{ width: '100%', maxWidth: '100%' }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5} md={4} lg={3}>
                              <FormInput
                                name={`BOQItems.${index}.remarks`}
                                label='Remarks'
                                placeHolder='Remarks'
                                sx={{ width: '100%', maxWidth: '100%' }}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Divider sx={{ my: 3 }} />
                            </Grid>
                          </Grid>
                        ))}
                      </Stack>
                    );
                  }}
                />
                <Button
                  type='submit'
                  variant='contained'
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
                  color='secondary'
                >
                  Submit {isSubmitting && <CircularProgress size={20} />}
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Paper>
  );
};

export default Addworkitem;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session?.user?.role !== 'Civil') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const projects = await prisma.project.findMany({
    include: {
      BOQ: true,
    },
  });
  return {
    props: {
      projects,
    },
  };
};
