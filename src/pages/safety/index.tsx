import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import EnhancedTableToolbar from "@/components/StoreSafety/EnhancedTableToolbar";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import Row from "@/components/StoreSafety/Row";
import { Contractor, Safety, SafetyItem, UnsafeActs } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
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
  createHeadCells(
    "chargeableItemIssued",
    "Chargeable Item Issued",
    true,
    false
  ),
  createHeadCells("division", "Division", true, false),
  createHeadCells("quantity", "Quantity", true, false),
  createHeadCells("rate", "Rate", true, false),
  createHeadCells("netchargeableamount", "Net Chargeable Amount", true, false),
  createHeadCells("remarks", "Remarks", true, false),
];

interface Props {
  contractors: Contractor[];
}

export default function Safety1({ contractors }: Props) {
  const [filter, setFilter] = React.useState("");
  const router = useRouter();
  const [selectedContractor, setSelectedContractor] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const [safety, setSafety] = React.useState<
    (Safety & {
      unsafeActs: UnsafeActs[];
      safetyItems: SafetyItem[];
    })[]
  >([]);
  const { data: session } = useSession();

  const fetchSafety = async () => {
    const res = await axios.get(
      "/api/safety?month=" + "&contractorid=" + selectedContractor?.value
    );
    setSafety(res.data || []);
  };

  React.useEffect(() => {
    fetchSafety();
  }, [selectedContractor]);

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
        "Chargeable Item Issued",
        "Division",
        "Quantity",
        "Rate",
        "Net Chargeable Amount",
        "Total Amount",
        "Remarks",
      ],
    ];

    try {
      safety
        .filter((s) => {
          if (filter)
            return s.contractorName
              .toLowerCase()
              .includes(filter.toLowerCase());
          return true;
        })
        .forEach((item) => {
          item.safetyItems.forEach((i) => {
            tableRows.push([
              item.id,
              item.contractorName,
              item.month,
              i.chargeableItemIssued,
              i.division,
              i.quantity.toString(),
              i.rate.toString(),
              i.netchargeableamount.toString(),
              item.totalAmount.toString(),
              i.remarks || "",
            ]);
          });
        });

      tableRows.push(["", "", "", "", "", "", "", "", ""]);

      tableRows.push(["", "", "", "", "", "", "", "", ""]);

      tableRows.push([
        "Store ID",
        "Contractor Name",
        "Month",
        "Unsafe Acts and Violations",
        "Division",
        "Frequency",
        "Penalty Amount",
        "Total Amount",
        "Remarks",
      ]);

      safety.forEach((item) => {
        item.unsafeActs.forEach((i) => {
          tableRows.push([
            item.id,
            item.contractorName,
            item.month,
            i.unsafeacts,
            i.division,
            i.frequency.toString(),
            i.penalty.toString(),
            item.totalAmount.toString(),
            i.remarks || "",
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
      link.setAttribute("download", "Safety.csv");
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
            rowCount={0}
          />
          <TableBody>
            {safety
              .filter((s) => {
                if (filter)
                  return s.contractorName
                    .toLowerCase()
                    .includes(filter.toLowerCase());
                return true;
              })
              .map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  items={row.safetyItems}
                  items2={row.unsafeActs}
                  headcells={headcells}
                  headcells1={headcells1}
                  handleDelete={handleDelete}
                  handleEdit={() => router.push(`/safety/${row.id}`)}
                />
              ))}

            {safety.filter((s) => {
              if (filter)
                return s.contractorName
                  .toLowerCase()
                  .includes(filter.toLowerCase());
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

  if (session.user?.role === "Stores" || session.user?.role === "TimeKeeper") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const contractors = await prisma.contractor.findMany();

  return {
    props: {
      contractors,
    },
  };
};
