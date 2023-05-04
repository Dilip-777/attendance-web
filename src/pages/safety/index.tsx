import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import EnhancedTableToolbar from "@/components/Table/EnhancedTableToolbar";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import Row from "@/components/CollapseTable/Row";
import { Safety, SafetyItem, StoreItem, Stores } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";

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
  createHeadCells("penalty", "Penalty", true, false),
  createHeadCells("netchargeableamount", "Net Chargeable Amount", true, false),
];

interface Props {
  safety: Safety[];
  safetyItem: SafetyItem[];
}

export default function Safety1({ safety, safetyItem }: Props) {
  const [filter, setFilter] = React.useState("");
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await axios
      .delete(`/api/safety`, { data: { id: id } })
      .then((res) => {
        router.replace(router.asPath);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(safetyItem, safety);

  return (
    <Paper>
      <EnhancedTableToolbar
        filtername={filter}
        setFilterName={setFilter}
        numSelected={0}
      />

      <TableContainer
        sx={{
          maxHeight: "calc(100vh - 11rem)",
          overflowY: "auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            height: 10,
            width: 10,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
        }}
        component={Paper}
      >
        <Table aria-label="collapsible table">
          <EnhancedTableHead
            headCells={headcells}
            numSelected={0}
            rowCount={0}
          />
          <TableBody>
            {safety.map((row) => (
              <Row
                key={row.id}
                row={row}
                items={safetyItem.filter((item) => item.safetyId === row.id)}
                headcells={headcells}
                headcells1={headcells1}
                handleDelete={handleDelete}
              />
            ))}

            {safety.length === 0 && (
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

  const safety = await prisma.safety.findMany();

  const safetyItem = await prisma.safetyItem.findMany();

  return {
    props: {
      safety,
      safetyItem,
    },
  };
};
