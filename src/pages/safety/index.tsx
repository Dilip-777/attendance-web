import * as React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Employee, Safety, Stores } from "@prisma/client";
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
  createHeadCells("id", "Safety Id", true, false),
  createHeadCells("contractorName", "Contractor Name", true, false),
  createHeadCells("month", "Month", true, false),
  createHeadCells("division", "Division", true, false),
  createHeadCells(
    "chargeableItemIssued",
    "Chargeable Item Issued",
    true,
    false
  ),
  createHeadCells("chargeablevoilation", "Chargeable Voilation", true, false),
  createHeadCells("netchargeableamount", "Net Chargeable Amount", true, false),
];

export default function Employees({ safety }: { safety: Safety[] }) {
  const [filterName, setFilterName] = React.useState("");
  return (
    <CustomTable
      headcells={headCells1}
      rows={safety.filter((employee) =>
        employee.contractorName.toLowerCase().includes(filterName.toLowerCase())
      )}
      filterName={filterName}
      setFilterName={setFilterName}
      editLink="/safety"
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const safety = await prisma.safety.findMany();
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
  return {
    props: {
      safety,
    },
  };
};
