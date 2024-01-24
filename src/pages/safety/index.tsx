import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import EnhancedTableToolbar from "@/components/StoreSafety/EnhancedTableToolbar";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import Row from "@/components/StoreSafety/Row";
import {
  Contractor,
  Safety,
  SafetyItem,
  StoreItem,
  Stores,
} from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

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
  createHeadCells("id", "Safety Id", true, false),
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
  contractors: Contractor[];
}

export default function Safety1({ safety, safetyItem, contractors }: Props) {
  const [filter, setFilter] = React.useState("");
  const router = useRouter();
  const [selectedContractor, setSelectedContractor] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const [month, setMonth] = React.useState<Dayjs>(dayjs());

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

  const handleClickReport = async () => {
    const tableRows = [
      [
        "Store ID",
        "Contractor Name",
        "Month",
        "Division",
        "Chargeable Item Issued",
        "Penalty",
        "Net Chargeable Amount",
        "Total Amount",
      ],
    ];

    try {
      safety
        .filter((s) => {
          if (dayjs(month).format("MM/YYYY") !== s.month) return false;
          if (filter)
            return s.contractorName
              .toLowerCase()
              .includes(filter.toLowerCase());
          if (selectedContractor)
            return selectedContractor.value === s.contractorid;
          return true;
        })
        .forEach((item: Safety) => {
          safetyItem
            .filter((s) => s.safetyId === item.id)
            .forEach((i) => {
              tableRows.push([
                item.id,
                item.contractorName,
                item.month,
                i.division,
                i.chargeableItemIssued,
                i.penalty.toString(),
                i.netchargeableamount.toString(),
                item.totalAmount.toString(),
              ]);
            });
        });

      const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

      // Download CSV file
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "Stores.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper>
      <EnhancedTableToolbar
        filtername={filter}
        setFilterName={setFilter}
        contractors={contractors.map((c) => ({
          value: c.contractorId,
          label: c.contractorname,
        }))}
        selectedContractor={selectedContractor}
        setSelectedContractor={setSelectedContractor}
        month={month}
        setMonth={setMonth}
        handleClickReport={handleClickReport}
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
            {safety
              .filter((s) => {
                if (dayjs(month).format("MM/YYYY") !== s.month) return false;
                if (filter)
                  return s.contractorName
                    .toLowerCase()
                    .includes(filter.toLowerCase());
                if (selectedContractor)
                  return selectedContractor.value === s.contractorid;
                return true;
              })
              .map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  items={safetyItem.filter((item) => item.safetyId === row.id)}
                  headcells={headcells}
                  headcells1={headcells1}
                  handleDelete={handleDelete}
                />
              ))}

            {safety.filter((s) => {
              if (dayjs(month).format("MM/YYYY") !== s.month) return false;
              if (filter)
                return s.contractorName
                  .toLowerCase()
                  .includes(filter.toLowerCase());
              if (selectedContractor)
                return selectedContractor.value === s.contractorid;
              return true;
            }).length === 0 && (
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

  const contractors = await prisma.contractor.findMany();

  return {
    props: {
      safety,
      safetyItem,
      contractors,
    },
  };
};
