import * as React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Hsd } from "@prisma/client";
import _ from "lodash";
import CustomTable from "@/components/Table/Table";

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
  createHeadCells("contractorId", "Contractor Code", false, false),
  createHeadCells("contractor.contractorname", "Contractor Name", false, false),
  createHeadCells("month", "Month", false, false),
  createHeadCells("recoverableRate", "Recoverable Rate", true, false),
  createHeadCells("payableRate", "Payable Rate", true, false),
];

export default function HsdEntries({ hsds }: { hsds: Hsd[] }) {
  const [filterName, setFilterName] = React.useState("");
  const [orderby, setOrderby] = React.useState("month");

  return (
    <CustomTable
      headcells={headCells1}
      rows={hsds.filter((hsd) =>
        _.get(hsd, orderby, "month")
          .toString()
          .toLowerCase()
          .includes(filterName.toLowerCase())
      )}
      filterName={filterName}
      setFilterName={setFilterName}
      editLink="/hsd"
      orderby={orderby}
      setOrderby={setOrderby}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

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
