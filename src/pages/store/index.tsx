import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import Row from "@/components/StoreSafety/Row";
import { Contractor, StoreItem, Stores } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { TableCell, TableRow } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import dayjs, { Dayjs } from "dayjs";
import EnhancedTableToolbar from "@/components/StoreSafety/EnhancedTableToolbar";

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
  createHeadCells("remarks", "Remarks", true, false),
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
  contractors: Contractor[];
}

export default function Store({ stores, storeItems, contractors }: Props) {
  const [filter, setFilter] = React.useState("");
  const router = useRouter();
  const [selectedContractor, setSelectedContractor] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const [month, setMonth] = React.useState<Dayjs>(dayjs());
  const { data: session } = useSession();

  const handleDelete = async (id: string) => {
    const res = await axios
      .delete("api/stores", {
        data: {
          id,
        },
      })
      .then((res) => {
        router.replace(router.asPath);
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
        "Quantity",
        "Units",
        "Rate",
        "Chargeable Amount",
        "Total Amount",
      ],
    ];

    try {
      stores
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
        .forEach((item: Stores) => {
          storeItems
            .filter((s) => s.storeId === item.id)
            .forEach((i) => {
              tableRows.push([
                item.id,
                item.contractorName,
                item.month,
                i.division,
                i.chargeableItemIssued,
                i.quantity.toString(),
                i.units,
                i.rate.toString(),
                i.chargeableamount.toString(),
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

  const extraheadcells = [...headcells];
  if (
    !(
      session?.user?.role === "PlantCommercial" ||
      session?.user?.role === "HoCommercialAuditor"
    )
  ) {
    extraheadcells.push(createHeadCells("action", "Actions", true, false));
  }

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
            headCells={extraheadcells}
            numSelected={0}
            rowCount={stores.length}
          />
          <TableBody>
            {stores
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
                  items={storeItems.filter((item) => item.storeId === row.id)}
                  headcells={headcells}
                  headcells1={headcells1}
                  handleDelete={handleDelete}
                  handleEdit={() => router.push(`/store/${row.id}`)}
                />
              ))}

            {stores.filter((s) => {
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

  if (session.user?.role === "Safety" || session.user?.role === "TimeKeeper") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const stores = await prisma.stores.findMany();

  const storeItems = await prisma.storeItem.findMany();

  const contractors = await prisma.contractor.findMany();

  return {
    props: {
      stores,
      storeItems,
      contractors,
    },
  };
};
