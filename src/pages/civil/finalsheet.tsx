import prisma from "@/lib/prisma";
import MonthSelect from "@/ui-component/MonthSelect";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Automobile,
  BOQ,
  BOQItem,
  BarBending,
  BarBendingItem,
  Contractor,
  Deductions,
  Department,
  Designations,
  Employee,
  HOAuditor,
  HiredFixedWork,
  Hsd,
  Measurement,
  MeasurementItem,
  Project,
  Qcs,
  QcsBoq,
  QcsBoqItem,
  Safety,
  SeperateSalary,
  Stores,
  Workorder,
} from "@prisma/client";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Details from "@/components/Table/details";
import AutoComplete from "@/ui-component/Autocomplete";
import { useRouter } from "next/router";

import { getBoqFinalSheet } from "@/utils/getboqfinalsheet";
import FinalsheetTable from "@/components/Civil/finalsheettable";
import { handleCivilPrint } from "@/components/PrintFinalSheet/printcivil";

const headcells1 = [
  {
    id: "code",
    label: "Item Code",
    cell: (row: any, index: number) => row.code,
    colspan: 1,
  },
  {
    id: "description",
    label: "Description",
    cell: (row: any) => row.description,
    colspan: 1,
  },

  {
    id: "taxable",
    label: "Taxable",
    cell: (row: any) => row.taxable,
  },
  {
    id: "gst",
    label: "GST",
    cell: (row: any) => row.gst,
  },
  {
    id: "billamount",
    label: "Bill Amount",
    cell: (row: any) => row.billamount,
  },
  {
    id: "tds",
    label: "TDS",
    cell: (row: any) => row.tds,
  },
  {
    id: "netPayable",
    label: "Net Payable",
    cell: (row: any) => row.netPayable,
  },
];
const headcells2 = [
  {
    id: "code",
    label: "Item Code",
    cell: (row: any, index: number) => index + 1,
    colspan: 1,
  },
  {
    id: "description",
    label: "Description",
    cell: (row: any) => row.description,
    colspan: 1,
  },
  {
    id: "unit",
    label: "Unit",
    cell: (row: any) => row.unit,
    colspan: 1,
  },
  {
    id: "quantity",
    label: "Quantity",
    cell: (row: any) => row.quantity,
    colspan: 1,
  },

  {
    id: "rate",
    label: "Rate",
    cell: (row: any) => row.rate,
    colspan: 1,
  },
  {
    id: "taxable",
    label: "Taxable",
    cell: (row: any) => row.taxable,
  },
  {
    id: "gst",
    label: "GST",
    cell: (row: any) => row.gst,
  },
  {
    id: "billamount",
    label: "Bill Amount",
    cell: (row: any) => row.billamount,
  },
  {
    id: "tds",
    label: "TDS",
    cell: (row: any) => row.tds,
  },
  {
    id: "netPayable",
    label: "Net Payable",
    cell: (row: any) => row.netPayable,
  },
];

interface Boq extends QcsBoq {
  BOQItems: (QcsBoqItem & {
    measurementItems: (MeasurementItem & { measurement: Measurement })[];
    barBendingItems: (BarBendingItem & { barBending: BarBending })[];
  })[];
}

export default function FinalSheet({
  contractors,
  workorder,
  contractor,
  // boqs,
  safety,
  project,
  hoCommercial,
}: {
  contractors: Contractor[];
  workorder: Workorder | null;
  contractor: Contractor & {
    Qcs: (Qcs & { project: Project })[];
  };
  safety: Safety | null;

  project: Project;
  hoCommercial: HOAuditor | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<any>(null);
  // const [total, setTotal] = useState(0);
  const [boqs, setBoqs] = useState<Boq[]>([]);

  const [store, setStore] = useState<Stores | null>(null);
  const [deduction, setDeduction] = useState<Deductions | null>(null);

  const router = useRouter();
  const [month, setMonth] = useState<string | null>(dayjs().format("MM/YYYY"));

  const fetchBoqs = async () => {
    const res = await axios.get(
      "/api/civil/abstract?contractorId=" +
        contractor?.contractorId +
        "&projectId=" +
        project.id +
        "&month=" +
        month
    );
    setBoqs(res.data?.BOQ || []);
  };

  useEffect(() => {
    fetchBoqs();
  }, [contractor, project]);

  const fetchDeductions = async () => {
    const res = await axios.get(
      `/api/deductions?contractorId=${contractor.contractorId}&date=${
        month || dayjs().format("MM/YYYY")
      }`
    );
    setDeduction(res.data);
  };

  useEffect(() => {
    fetchDeductions();
  }, [contractor, month]);

  const { tables, totalsRow, total, totalcostupto, prevMonthTotal } = useMemo(
    () => getBoqFinalSheet({ boq: boqs, month: month as string, contractor }),
    [boqs, month]
  );

  const fetchStoreAndSafety = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/stores?contractorid=${contractor.contractorId}&month=${
        month || dayjs().format("MM/YYYY")
      }`
    );
    setStore(res.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchStoreAndSafety();
  }, []);

  return loading ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="90vh"
    >
      <CircularProgress sx={{ color: "#673ab7" }} />
    </Box>
  ) : (
    <Paper
      sx={{
        overflow: "auto",
        p: 3,
        maxHeight: "calc(100vh - 6rem)",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          height: 10,
          width: 9,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bdbdbd",
          borderRadius: 2,
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <AutoComplete
              label="Select Contractor"
              value={contractor.contractorId}
              setValue={(value) =>
                router.push(`/civil/finalsheet?contractorId=${value}`)
              }
              options={contractors.map((c) => ({
                value: c.contractorId || "",
                label: c.contractorname,
              }))}
            />
            <AutoComplete
              label="Select Project"
              value={project.id}
              setValue={(value) =>
                router.push(
                  `/civil/finalsheet?contractorId=${contractor.contractorId}&projectId=${value}`
                )
              }
              options={contractor.Qcs.map((c) => ({
                value: c.projectId || "",
                label: c.project.name,
              }))}
            />
            <MonthSelect
              label="Select Date"
              value={dayjs(month as string, "MM/YYYY")}
              onChange={(value: Dayjs | null) => {
                if (value) setMonth(value?.format("MM/YYYY"));
              }}
            />
          </Stack>

          <Button
            variant="contained"
            onClick={() =>
              handleCivilPrint({
                calRows: tables,
                contractor: contractor as Contractor,
                month: "value",
                total: total,
                workorder: workorder as Workorder,
                safetAmount: safety?.totalAmount || 0,
                storesAmount: store?.totalAmount || 0,
                deduction,
                headcells1,
                headcells2,
                totals: totalsRow,
                hoCommercial: hoCommercial,
              })
            }
            color="secondary"
          >
            Print
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h4" sx={{ mb: 4, my: 2 }}>
          Contractor Details :
        </Typography>
        <Details
          rows={[
            { label: "Contractor Id", value: contractor.contractorId },
            {
              label: "Contractor Name",
              value: contractor?.contractorname as string,
            },
            {
              label: "Mobile Number",
              value: contractor?.mobilenumber as string,
            },
            {
              label: "Office Address",
              value: contractor?.officeaddress as string,
            },
            { label: "Pan Number", value: contractor?.pancardno as string },
            { label: "Area of Work", value: contractor?.areaofwork as string },
            {
              label: "Type of Contractor",
              value: contractor?.typeofcontractor as string,
            },
          ]}
        />
        <Divider sx={{ my: 2 }} />
        <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
          Service Details :
        </Typography>
        <Details
          rows={[
            { label: "Work Order Id", value: workorder?.id as string },
            { label: "Nature of Work", value: workorder?.nature as string },
            { label: "Location", value: workorder?.location as string },
            { label: "Start Date", value: workorder?.startDate as string },
            { label: "End Date", value: workorder?.endDate as string },
          ]}
        />
      </Box>
      <Divider sx={{ my: 2 }} />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="90vh"
        >
          <CircularProgress sx={{ color: "#673ab7" }} />
        </Box>
      ) : (
        <Stack spacing={2}>
          <FinalsheetTable
            rows={totalsRow}
            title="Total"
            headcells={headcells1}
          />
          {tables.map((table, index) => (
            <FinalsheetTable
              rows={table.rows}
              title={table.description}
              headcells={headcells2}
              lastIndex={index === tables.length - 1}
              total={total}
              deduction={deduction}
              safetydeduction={safety?.totalAmount}
              storededuction={store?.totalAmount}
            />
          ))}
        </Stack>
      )}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
        Contractors Monthly Cost Charged in Profit & Loss for a Financial Year :
      </Typography>
      <Details
        rows={[
          {
            label: "Cost of Previous Month",
            value: prevMonthTotal.toString(),
          },
          {
            label: "Cost of the Month",
            value: total.toString(),
          },
          {
            label: "Cost Upto This Month",
            value: totalcostupto.toString(),
          },
          {
            label: "Cost Of the Previous Year",
            value: "0",
          },
          {
            label: "Cost Of the Project",
            value: contractor.Qcs[0].description,
          },
        ]}
      />
      <Divider sx={{ my: 2 }} />
      <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
        Bank Account Information :
      </Typography>
      <Details
        rows={[
          {
            label: "Beneficial Name",
            value: contractor?.beneficialname as string,
          },
          {
            label: "Account Number",
            value: contractor?.bankaccountnumber as string,
          },
          { label: "IFSC Code", value: contractor?.ifscno as string },
          {
            label: "Payment Date",
            value: details?.payoutracker?.month || ("-" as string),
          },
          {
            label: "Payment Reference Number",
            value: details?.payoutracker?.id || "-",
          },
          {
            label: "Paid Amount",
            value: Math.ceil(details?.payoutracker?.actualpaidoutmoney) || "-",
          },
        ]}
      />
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { projectId, contractorId } = context.query;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const contractors = (
    await prisma.contractor.findMany({
      orderBy: { contractorname: "asc" },
      include: {
        Qcs: {
          include: {
            project: true,
          },
        },
      },

      where: {
        servicedetail: "Civil",
      },
    })
  ).filter((c) => c.Qcs.length > 0);

  let contractor = contractors.find((c) => c.contractorId === contractorId);

  if (!contractor) {
    contractor = contractors[0];
  }

  let project = contractor.Qcs.find((p) => p.projectId === projectId)?.project;

  if (!project) {
    project = contractor.Qcs[0].project;
  }

  const safety = await prisma.safety.findFirst({
    where: {
      contractorid: contractor?.contractorId,
    },
  });

  const workorder = await prisma.workorder.findFirst({
    where: {
      contractorId: contractor?.contractorId,
    },
  });

  const hoCommercial = await prisma.hOAuditor.findFirst({
    where: {
      contractorId: contractor?.id,
    },
  });

  return {
    props: {
      contractors,
      workorder,
      contractor: contractor,
      safety,
      project,
      hoCommercial,
    },
  };
};
