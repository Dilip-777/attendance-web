import * as React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Employee, Stores } from "@prisma/client";
import _ from "lodash";
import CustomTable from "@/components/Table/TablePagination";

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
  createHeadCells("id", "Store Id", true, false),
  createHeadCells("contractorName", "Contractor Name", true, false),
  createHeadCells("month", "Month", true, false),
  createHeadCells("division", "Division", true, false),
  createHeadCells(
    "chargeableItemIssued",
    "Chargeable Item Issued",
    true,
    false
  ),
  createHeadCells("quantity", "Quantity", true, false),
  createHeadCells("units", "Units", true, false),
  createHeadCells("rate", "Rate", true, false),
  createHeadCells("chargeableamount", "Chargeable Amount", true, false),
];

export default function Employees({ stores }: { stores: Stores[] }) {
  const [filterName, setFilterName] = React.useState("");
  return (
    <CustomTable
      headcells={headCells1}
      rows={stores.filter((employee) =>
        employee.contractorName.toLowerCase().includes(filterName.toLowerCase())
      )}
      filterName={filterName}
      setFilterName={setFilterName}
      editLink="/store"
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const stores = await prisma.stores.findMany();
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
      stores,
    },
  };
};
