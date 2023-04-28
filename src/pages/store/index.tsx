import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import EnhancedTableToolbar from "@/components/Table/EnhancedTableToolbar";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import Row from "@/components/CollapseTable/Row";
import { StoreItem, Stores } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { TableCell, TableRow } from "@mui/material";

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

const headcells = [
  createHeadCells("id", "Store Id", true, false),
  createHeadCells("contractorName", "Contractor Name", true, false),
  createHeadCells("month", "Month", true, false),
  createHeadCells("totalAmount", "Total Amount", true, false),
];

const headcells1 = [
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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
  };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, 4.99),
  createData("Eclair", 262, 16.0, 24, 6.0, 3.79),
  createData("Cupcake", 305, 3.7, 67, 4.3, 2.5),
  createData("Gingerbread", 356, 16.0, 49, 3.9, 1.5),
];

interface Props {
  stores: Stores[];
  storeItems: StoreItem[];
}

export default function CollapsibleTable({ stores, storeItems }: Props) {
  const [filter, setFilter] = React.useState("");
  return (
    <Paper>
      <EnhancedTableToolbar
        filtername={filter}
        setFilterName={setFilter}
        numSelected={0}
      />

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <EnhancedTableHead
            headCells={headcells}
            numSelected={0}
            rowCount={rows.length}
          />
          <TableBody>
            {stores.map((row) => (
              <Row
                key={row.id}
                row={row}
                items={storeItems.filter((item) => item.storeId === row.id)}
                headcells={headcells}
                headcells1={headcells1}
              />
            ))}

            {stores.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>No Data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
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

  const stores = await prisma.stores.findMany();

  const storeItems = await prisma.storeItem.findMany();

  return {
    props: {
      stores,
      storeItems,
    },
  };
};
