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
  Contractor,
  Deductions,
  Department,
  Designations,
  Employee,
  HiredFixedWork,
  Hsd,
  Safety,
  SeperateSalary,
  Stores,
  TimeKeeper,
  Vehicle,
  Workorder,
} from "@prisma/client";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import Details from "@/components/Table/details";
// import PrintModal from "@/components/PrintFinalSheet/PrintModal";
import dynamic from "next/dynamic";
import { Chip, Grid } from "@mui/material";
import { getAutomobileFinalSheet } from "@/utils/getautomobilefinalsheet";
import AutoComplete from "@/ui-component/Autocomplete";
import FinalSheetTable from "@/components/Automobile/FinalSheetTable";
import { handleAutomobileprint } from "@/components/PrintFinalSheet/printAutomobile";
import { useRouter } from "next/router";
import {
  getAttendanceCalculations,
  getHourlyCalculation,
  getWorksCalculations,
} from "@/utils/getfixedfinalsheet";
import { handleFixedPrint } from "@/components/PrintFinalSheet/printFixed";

const headcells = [
  {
    id: "id",
    label: "S.No",
    cell: (row: any) => (
      <Typography sx={{ minWidth: "6rem" }}>{row.id}</Typography>
    ),
  },
  {
    id: "description",
    label: "Description of works",
    cell: (row: any) => (
      <Typography sx={{ minWidth: "6rem" }}>{row.description}</Typography>
    ),
  },
  { id: "rate", label: "Rate", cell: (row: any) => row.rate },
  {
    id: "quantity",
    label: "Quantity",
    cell: (row: any) => row.quantity,
  },
  {
    id: "totalAmount",
    label: "Amount",
    cell: (row: any) => row.totalAmount,
  },
  {
    id: "servicechargeRate",
    label: "Service Charge Rate",
    cell: (row: any) => row.servicechargeRate,
  },
  {
    id: "servicecharge",
    label: "Service Charge",
    cell: (row: any) => row.servicecharge,
  },
  { id: "taxable", label: "Taxable", cell: (row: any) => row.taxable },
  { id: "gst", label: "GST", cell: (row: any) => row.gst },
  {
    id: "billamount",
    label: "Bill Amount",
    cell: (row: any) => row.billamount,
  },
  { id: "tds", label: "TDS", cell: (row: any) => row.tds },
  {
    id: "netPayable",
    label: "Net Payable",
    cell: (row: any) => row.netPayable,
  },
];

const headcells1 = [
  {
    id: "id",
    label: "S.No",
    cell: (row: any) => row.id,
  },
  {
    id: "name",
    label: "Manpower Deployment",
    cell: (row: any) => row.name,
  },
  {
    id: "totalManDay",
    label: "Man Days",
    cell: (row: any) => row.totalManDay,
  },
  {
    id: "rate",
    label: "Rate",
    cell: (row: any) => row.rate,
  },
  {
    id: "totalManDayAmount",
    label: "Man Days Amount",
    cell: (row: any) => row.totalManDayAmount,
  },
  {
    id: "overtime",
    label: "Overtime Hrs.",
    cell: (row: any) => row.overtime,
  },

  {
    id: "otamount",
    label: "OT Amount",
    cell: (row: any) => row.otamount,
  },
  {
    id: "servicechargeRate",
    label: "Service Charge Rate",
    cell: (row: any) => row.servicechargeRate,
  },
  {
    id: "servicechargeAmount",
    label: "Service Charge Amount",
    cell: (row: any) => row.servicechargeAmount,
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
    id: "billAmount",
    label: "Bill Amount",
    cell: (row: any) => row.billAmount,
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
    id: "manDays",
    label: "Man Days",
    cell: (row: any) => row.manDays,
  },
  {
    id: "overtime",
    label: "OT Days",
    cell: (row: any) => row.overtime,
  },
  {
    id: "totalManDays",
    label: "Total Man Days",
    cell: (row: any) => row.totalManDays,
  },
  {
    id: "noofEmployees",
    label: "No of Employees",
    cell: (row: any) => row.noofEmployees,
  },
  {
    id: "requiredManDays",
    label: "Required Man Days As Per Work Order",
    cell: (row: any) => row.requiredManDays,
  },
  {
    id: "shortage",
    label: "Shortage",
    cell: (row: any) => row.shortage,
  },
  {
    id: "rate",
    label: "Rate",
    cell: (row: any) => row.rate,
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
    id: "billAmount",
    label: "Bill Amount",
    cell: (row: any) => row.billAmount,
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

const PrintModal = dynamic(
  () => import("@/components/PrintFinalSheet/PrintModal")
);

interface d extends Department {
  designations: DesignationwithSalary[];
}

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
  employees: Employee[];
}

interface ContractorwithVehicle extends Contractor {
  vehicle: (Vehicle & {
    automobile: Automobile[];
  })[];
  hsd: Hsd[];
}

export default function FinalSheet({
  contractors,
  workorders,
  contractor,
  timekeeper,
  safety,
}: {
  contractors: Contractor[];
  workorders: Workorder[];
  contractor: Contractor & {
    employee: (Employee & {
      designation: Designations | null;
    })[];

    departments: d[];

    hiredFixedWork: HiredFixedWork[];
  };
  timekeeper: TimeKeeper[];
  safety: Safety | null;
}) {
  const [value, setValue] = useState<string>(dayjs().format("MM/YYYY"));
  const [selectedContractor, setSelectedContractor] = useState<string>(
    contractor.contractorId
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [total, setTotal] = useState(0);

  const [calRows, setCalRows] = useState<
    { heading: string; headcells: any[]; data: any[] }[]
  >([]);
  const [colSpans, setColSpans] = useState<number[]>([]);
  const [store, setStore] = useState<Stores | null>(null);
  const [deduction, setDeduction] = useState<Deductions | null>(null);

  const router = useRouter();
  const { month } = router.query;

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

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (value: Dayjs | null) =>
    router.push(
      `/fixedfinalsheet?month=${value?.format("MM/YYYY")}&contractorId=${
        contractor.contractorId
      }`
    );

  useEffect(() => {
    const { rows, totals } = getWorksCalculations(
      contractor.hiredFixedWork,
      contractor
    );

    if (contractor.deployment) {
      const data: any[] = getAttendanceCalculations(
        contractor,
        timekeeper,
        (month as string) || dayjs().format("MM/YYYY")
      );

      data.push({
        id: "",
        name: "",
        totalManDay: "",
        rate: "",
        totalManDayAmount: "",
        overtime: "",
        otRate: "",
        otamount: "",
        servicechargeRate: "",
        servicechargeAmount: "",
        taxable: "",
        gst: "",
        billAmount: "",
        tds: "",
        netPayable: "",
      });

      data.push({
        id: "Total (A+B)",
        name: "",
        totalManDay: "",
        rate: "",
        totalManDayAmount: "",
        overtime: "",
        otRate: "",
        otamount: "",
        servicechargeRate: "",
        servicechargeAmount: "",
        taxable: data[0].taxable + totals.totalAmount,
        gst: data[0].gst + totals.gst,
        billAmount: data[0].billAmount + totals.billamount,
        tds: data[0].tds + totals.tds,
        netPayable: data[0].netPayable + totals.netPayable,
      });

      setCalRows([
        {
          headcells: headcells,
          heading: "Fixed Works",
          data: rows,
        },
        {
          headcells: headcells1,
          heading: "MANPOWER DEPLOYMENT",
          data: data,
        },
      ]);
      setTotal(data[0].netPayable + totals.netPayable);
      setColSpans([9]);
    } else if (contractor.minManpower) {
      const calobj = getHourlyCalculation(
        contractor,
        timekeeper,
        (month as string) || dayjs().format("MM/YYYY")
      );
      const data = [
        calobj,
        {
          manDays: "Total(A+C)",
          rate: "",
          overtime: "",
          totalManDays: "",
          noofEmployees: "",
          requiredManDays: "",
          shortage: "",
          taxable: calobj.taxable + totals.totalAmount,
          gst: calobj.gst + totals.gst,
          billAmount: calobj.billAmount + totals.billamount,
          tds: calobj.tds + totals.tds,
          netPayable: calobj.netPayable + totals.netPayable,
        },
      ];
      setCalRows([
        {
          headcells: headcells,
          heading: "Fixed Works",
          data: rows,
        },
        {
          headcells: headcells2,
          heading: "DEDUCTION FOR SHORT FALL IN ATTENDANCE",
          data,
        },
      ]);
      setTotal(calobj.netPayable + totals.netPayable);
      setColSpans([7]);
    } else {
      setCalRows([
        {
          headcells: headcells,
          heading: "Fixed Works",
          data: rows,
        },
      ]);
      setTotal(totals.netPayable);
      setColSpans([4]);
    }

    // const data = getAttendanceCalculations(
    //   contractor,
    //   timekeeper,
    //   (month as string) || dayjs().format("MM/YYYY")
    // );

    // setCalRows([
    //   {
    //     headcells: headcells,
    //     heading: "Fixed Works",
    //     data: rows,
    //   },
    //   {
    //     headcells: headcells1,
    //     heading: "DEDUCTION FOR SHORT FALL IN ATTENDANCE",
    //     data: data,
    //   },
    // ]);
  }, [month, contractor]);

  const w = workorders.find(
    (c) =>
      c.contractorId === contractor?.contractorId && c.startDate.includes(value)
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
                router.push(
                  `/fixedfinalsheet?month=${
                    month || dayjs().format("MM/YYYY")
                  }&contractorId=${value}`
                )
              }
              options={contractors.map((c) => ({
                value: c.contractorId || "",
                label: c.contractorname,
              }))}
            />
            <MonthSelect
              label="Select Date"
              value={dayjs((month as string) || value, "MM/YYYY")}
              onChange={onChange}
            />
          </Stack>

          <Button
            variant="contained"
            onClick={() =>
              handleFixedPrint({
                calRows,
                contractor: contractor as Contractor,
                month: value,
                total: total,
                workorder: w,
                safetAmount: safety?.totalAmount || 0,
                storesAmount: store?.totalAmount || 0,
                deduction,
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
            { label: "Contractor Id", value: selectedContractor.toString() },
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
            { label: "Work Order Id", value: w?.id as string },
            { label: "Nature of Work", value: w?.nature as string },
            { label: "Location", value: w?.location as string },
            { label: "Start Date", value: w?.startDate as string },
            { label: "End Date", value: w?.endDate as string },
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
        <FinalSheetTable
          data={calRows}
          total={total}
          hsdcost={store?.totalAmount || 0}
          safetyAmount={safety?.totalAmount || 0}
          colspans={colSpans}
          deduction={deduction}
          fixed={true}
        />
      )}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
        Contractors Monthly Cost Charged in Profit & Loss for a Financial Year :
      </Typography>
      <Details
        rows={[
          {
            label: "Cost of Previous Month",
            value: "0",
          },
          {
            label: "Cost of the Month",
            value: total.toString(),
          },
          {
            label: "Cost Upto This Month",
            value: "0",
          },
          {
            label: "Cost Of the Previous Year",
            value: "0",
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
      <PrintModal
        contractor={contractor as Contractor}
        date={value}
        open={open}
        // setOpen={setOpen}
        handleClose={handleClose}
      />
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { month, vehicles, contractorId } = context.query;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const contractors = await prisma.contractor.findMany({
    orderBy: { contractorname: "asc" },

    where: {
      servicedetail: "Fixed",
    },
  });

  // const dateRanges = Array.from({ length: 12 }).map((_, index) => {
  //   const currentDate = month ? dayjs(month as string, "MM/YYYY") : dayjs();
  //   const startDate = currentDate
  //     .subtract(index, "month")
  //     .startOf("month")
  //     .format("DD/MM/YYYY");
  //   const endDate = currentDate
  //     .subtract(index, "month")
  //     .endOf("month")
  //     .format("DD/MM/YYYY");
  //   return { startDate, endDate };
  // });

  let contractor =
    contractorId &&
    (await prisma.contractor.findUnique({
      where: {
        contractorId: contractorId as string,
      },

      include: {
        hiredFixedWork: {
          where: {
            month: month as string,
          },
          select: {
            description: true,
            quantity: true,
            rate: true,
            totalAmount: true,
          },
        },
        employee: {
          include: {
            designation: true,
          },
        },
        departments: {
          include: {
            designations: true,
          },
        },
      },
    }));

  if (!contractor) {
    contractor = await prisma.contractor.findFirst({
      orderBy: { contractorname: "asc" },
      include: {
        hiredFixedWork: {
          where: {
            month: month as string,
          },
          select: {
            description: true,
            quantity: true,
            rate: true,
            totalAmount: true,
          },
        },
        employee: {
          include: {
            designation: true,
          },
        },
        departments: {
          include: {
            designations: true,
          },
        },
      },

      where: {
        servicedetail: "Fixed",
      },
    });
  }

  const timekeeper = await prisma.timeKeeper.findMany({
    where: {
      contractorid: contractor?.contractorId,
      attendancedate: {
        contains: (month as string) || dayjs().format("MM/YYYY"),
      },
    },
  });

  console.log(
    contractor?.contractorId,
    (month as string) || dayjs().format("MM/YYYY")
  );

  const safety = await prisma.safety.findFirst({
    where: {
      contractorid: contractor?.contractorId,
      month: (month as string) || dayjs().format("MM/YYYY"),
    },
  });

  console.log(safety);

  const workorders = await prisma.workorder.findMany();

  return {
    props: {
      contractors,
      workorders,
      contractor: contractor,
      timekeeper,
      safety,
    },
  };
};
