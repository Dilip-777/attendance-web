import * as React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { Contractor, Hsd } from '@prisma/client';
import _ from 'lodash';
import CustomTable from '@/components/Table/Table';
import DeleteModal from '@/ui-component/DeleteModal';
import { useRouter } from 'next/router';

const createHeadCells = (
  id: string,
  label: string,
  numeric: boolean,
  included: boolean
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
  };
};

const headCells1 = [
  createHeadCells('contractorId', 'Contractor Code', false, false),
  createHeadCells('contractor.contractorname', 'Contractor Name', false, false),
  createHeadCells('month', 'Month', false, false),
  createHeadCells('recoverableRate', 'Recoverable Rate', true, false),
  createHeadCells('payableRate', 'Payable Rate', true, false),
];

export default function HsdEntries({
  hsds,
}: {
  hsds: (Hsd & {
    contractor: Contractor;
  })[];
}) {
  const [filterName, setFilterName] = React.useState('');
  const [orderby, setOrderby] = React.useState('contractorname');
  const [hsdId, setHsdId] = React.useState<string>('');
  const router = useRouter();

  return (
    <>
      <CustomTable
        headcells={headCells1}
        rows={hsds.filter(
          (hsd) =>
            hsd.contractor.contractorname
              ?.toString()
              .toLowerCase()
              .includes(filterName.toLowerCase())
        )}
        filterName={filterName}
        setFilterName={setFilterName}
        editLink='/hsd'
        handleDelete={(row) => setHsdId(row.id)}
        orderby={orderby}
        setOrderby={setOrderby}
      />
      <DeleteModal
        openModal={hsdId ? true : false}
        title='Delete HSD'
        message={`Are you sure you want to delete selected HSD?`}
        cancelText='Cancel'
        confirmText='Delete'
        deleteApi={`/api/hsd?id=${hsdId}`}
        snackbarMessage='HSD Deleted Successfully'
        onClose={() => setHsdId('')}
        fetchData={() => router.replace(router.asPath)}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

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

  const hsds = await prisma.hsd.findMany({
    include: {
      contractor: true,
    },
  });

  return {
    props: {
      hsds,
    },
  };
};
