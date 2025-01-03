import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {
  Contractor,
  Project,
  BOQ,
  BOQItem,
  MeasurementItem,
  Measurement,
  Workorder,
  Qcs,
  QcsBoq,
  QcsBoqItem,
  BarBendingItem,
  BarBending,
} from '@prisma/client';
import { Stack, Typography } from '@mui/material';

import _ from 'lodash';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { useRouter } from 'next/router';
import { getBoq } from '@/utils/getBoq';
import AutoComplete from '@/ui-component/Autocomplete';
import axios from 'axios';

interface BOQWithItems extends BOQ {
  BOQItems: (BOQItem & {
    measurementItems: (MeasurementItem & {
      measurement: Measurement;
    })[];
  })[];
}

interface Boq extends QcsBoq {
  BOQItems: (QcsBoqItem & {
    measurementItems: (MeasurementItem & { measurement: Measurement })[];
    barBendingItems: (BarBendingItem & { barBending: BarBending })[];
  })[];
}

interface contractor extends Contractor {
  Qcs: (Qcs & { project: Project & { workorder: Workorder } })[];
}

export default function Measurements({
  contractors,
  workorder,
  projectId,
  contractorId,
}: {
  contractors: contractor[];
  workorder: Workorder | null;
  projectId: string;
  contractorId: string;
}) {
  const [contractor, setContractor] = React.useState<string | undefined>(
    contractors.length > 0 ? contractors[0].contractorId : undefined
  );
  const [boqs, setBoqs] = React.useState<Boq[]>([]);

  const fetchBoqs = async () => {
    const res = await axios.get(
      '/api/civil/abstract?contractorId=' +
        contractorId +
        '&projectId=' +
        projectId
    );
    setBoqs(res.data?.BOQ ?? []);
  };

  React.useEffect(() => {
    fetchBoqs();
  }, [contractorId, projectId]);

  const router = useRouter();

  const { rows, headcells2, headcells } = React.useMemo(
    () => getBoq({ boq: boqs, workorder }),
    [boqs]
  );

  const contractor1 = contractors.find((v) => v.contractorId === contractor);
  const qcs =
    contractor1 && contractor1?.Qcs.length > 0
      ? contractor1?.Qcs.find((v) => v.projectId === projectId)
      : undefined;
  const info = [
    { value: contractor1?.contractorname, label: 'Name of Contractor' },
    { value: qcs?.project?.name, label: 'Nature of Work' },
    { value: qcs?.project?.place, label: 'Location' },
  ];

  console.log(rows, 'rows');

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        sx={{
          width: '100%',
          mb: 2,
          maxHeight: 'calc(100vh - 6rem)',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            height: 10,
            width: 9,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: 2,
          },
          p: 2,
        }}
      >
        <Stack
          direction='column'
          spacing={3}
          sx={{
            p: '1rem',
          }}
        >
          <Stack direction='row' spacing={3}>
            <AutoComplete
              setValue={(v) => {
                const c = contractors.find((c) => c.contractorId === v);
                router.push(
                  `/civil/boq/boqformat?contractorId=${v}&projectId=${c?.Qcs[0].projectId}`
                );
              }}
              options={contractors.map((v) => ({
                label: v.contractorname,
                value: v.contractorId,
              }))}
              label='Contractor'
              value={contractorId}
            />
            <AutoComplete
              setValue={(v) =>
                router.push(
                  `/civil/boq/boqformat?contractorId=${contractorId}&projectId=${v}`
                )
              }
              options={
                contractor1?.Qcs.map((v) => ({
                  label: v.project.name,
                  value: v.projectId,
                })) ?? []
              }
              label='Project'
              value={projectId}
            />
          </Stack>
          {contractor1 && contractor1?.Qcs.length > 0 && (
            <Stack direction='column' spacing={2}>
              {info.map((v) => (
                <Stack direction='row' spacing={2}>
                  <Typography
                    sx={{
                      fontWeight: '700',
                      fontSize: '1rem',
                      minWidth: '12rem',
                    }}
                  >
                    {v.label}:
                  </Typography>
                  <Typography sx={{ fontSize: '1rem' }}>{v.value}</Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
        <TableContainer component={Paper} sx={{}}>
          <Table aria-label='collapsible table'>
            <TableHead sx={{ bgcolor: '#eeeeee' }}>
              <TableRow sx={{ bgcolor: '#eeeeee' }}>
                {headcells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    colSpan={headCell.colspan || 1}
                    align={'center'}
                    sx={{
                      fontWeight: '600',
                      bgcolor: '#eeeeee',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {headcells2.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={'center'}
                    sx={{
                      fontWeight: '600',
                      bgcolor: '#eeeeee',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    {headcells2.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={'center'}
                        sx={{ px: '0px' }}
                      >
                        {headCell.cell(row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align='left' colSpan={6}>
                    Nothing found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  let { contractorId, projectId } = context.query;

  if (session?.user?.role !== 'Civil') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  let contractors = await prisma.contractor.findMany({
    include: {
      Qcs: {
        include: {
          project: {
            include: {
              workorder: true,
            },
          },
        },
      },
    },
  });

  const projects = await prisma.project.findMany();

  contractors = contractors.filter((v) => v.Qcs.length > 0);

  const contractor =
    contractors.find((v) => v.contractorId === contractorId) || contractors[0];
  if (!projectId) projectId = projects[0].id;

  if (!projectId) {
    return {
      redirect: {
        destination: '/civil/project',
        permanent: false,
      },
    };
  }

  // const boq = await prisma.bOQ.findMany({
  //   where: {
  //     projectId: projectId as string,
  //   },
  //   include: {
  //     BOQItems: {
  //       include: {
  //         measurementItems: {
  //           include: {
  //             measurement: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  const workorder = await prisma.workorder.findFirst({
    where: {
      contractorId: contractorId as string,
      projectId: projectId as string,
    },
  });

  return {
    props: {
      contractors,
      // boq,
      workorder,
      projectId,
      contractorId: contractor.contractorId,
      projects,
    },
  };
};
