import prisma from "@/lib/prisma";
import FormSelect from "@/ui-component/FormSelect";
import MonthSelect from "@/ui-component/MonthSelect";
import getTotalAmountAndRows from "@/utils/getmonthlycount";
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
  Hsd,
  Safety,
  SeperateSalary,
  Shifts,
  Stores,
  TimeKeeper,
  Vehicle,
  Workorder,
} from "@prisma/client";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FinalSheetta from "@/components/Table/finalsheet";
import { print } from "@/components/PrintFinalSheet";
import Details from "@/components/Table/details";
// import PrintModal from "@/components/PrintFinalSheet/PrintModal";
import dynamic from "next/dynamic";
import {
  Autocomplete,
  Chip,
  FormControl,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import { gethourlycount } from "@/utils/getfinalhourlycount";
import { HourlyPrint } from "@/components/PrintFinalSheet/printhourlyexcel";
import { printMonthly } from "@/components/PrintFinalSheet/printmonthly";
import { getAutomobileFinalSheet } from "@/utils/getautomobilefinalsheet";
import AutoComplete from "@/ui-component/Autocomplete";
import FinalSheetTable from "@/components/Automobile/FinalSheetTable";
import { handleAutomobileprint } from "@/components/PrintFinalSheet/printAutomobile";
import { useRouter } from "next/router";

const headcells = [
  { id: "vehicleNo", label: "Vehicle No", cell: (row: any) => row.vehicleNo },
  {
    id: "vehicleType",
    label: "Vehicle Type",
    cell: (row: any) => row.vehicleType,
  },
  { id: "charges", label: "Vehicle Charges", cell: (row: any) => row.charges },
  {
    id: "paymentMode",
    label: "Payment Calculate Structure",
    cell: (row: any) => row.paymentStructure,
  },
  {
    id: "paymentMode",
    label: "Payment Mode",
    cell: (row: any) => row.paymentMode,
  },
  {
    id: "running",
    label: "Running (Duration/Distance)",
    cell: (row: any) => (
      <Grid container columnSpacing={4}>
        {(row.running.hrs || row.running.hrs === 0) && (
          <>
            <Grid item xs={6}>
              HRS
            </Grid>
            <Grid item xs={6}>
              {row.running.hrs}
            </Grid>
          </>
        )}
        <Grid item xs={6}>
          Days
        </Grid>
        <Grid item xs={6}>
          {row.running.days}
        </Grid>
        {(row.running.kms || row.running.kms === 0) && (
          <>
            <Grid item xs={6}>
              KMS
            </Grid>
            <Grid item xs={6}>
              {row.running.kms}
            </Grid>
          </>
        )}
        {(row.running.trips || row.running.trips === 0) && (
          <>
            <Grid item xs={6}>
              Trips
            </Grid>
            <Grid item xs={6}>
              {row.running.trips}
            </Grid>
          </>
        )}
      </Grid>
    ),
  },
  { id: "taxable", label: "Taxable Amount", cell: (row: any) => row.taxable },
  { id: "gst", label: "GST", cell: (row: any) => row.gst },
  {
    id: "billamount",
    label: "Bill Amount",
    cell: (row: any) => row.billamount,
  },
  { id: "tds", label: "TDS", cell: (row: any) => row.tds },
  { id: "netamount", label: "Net Amount", cell: (row: any) => row.netamount },
];

const headcells1 = [
  { id: "vehicleNo", label: "Vehicle No", cell: (row: any) => row.vehicleNo },
  {
    id: "hsdIssuedOrConsumed",
    label: "HSD Issued/Consumed",
    cell: (row: any) => row.hsdIssuedOrConsumed,
  },
  {
    id: "mileagefortheMonth",
    label: "Mileage for the Month",
    cell: (row: any) => row.mileagefortheMonth,
  },
  { id: "mileage", label: "Mileage", cell: (row: any) => row.mileage },
  {
    id: "hsdOverAbove",
    label: "HSD Over Above",
    cell: (row: any) => row.hsdOverAbove,
  },
  { id: "hsdrate", label: "HSD Rate", cell: (row: any) => row.hsdrate },
  { id: "hsdCost", label: "HSD Cost", cell: (row: any) => row.hsdCost },
  {
    id: "idealStandingDays",
    label: "Ideal Standing Days",
    cell: (row: any) => row.idealStandingDays,
  },
  {
    id: "actualWorkingDays",
    label: "Actual Working Days",
    cell: (row: any) => row.actualWorkingDays,
  },
  {
    id: "breakDownDaysCounted",
    label: "Break Down Days Counted",
    cell: (row: any) => row.breakDownDaysCounted,
  },
  {
    id: "avgMileage",
    label: "Average Mileage",
    cell: (row: any) => row.avgMileage,
  },
];

const headcells2 = [
  { id: "vehicleNo", label: "Vehicle No", cell: (row: any) => row.vehicleNo },
  {
    id: "vehicleType",
    label: "Vehicle Type",
    cell: (row: any) => row.vehicleType,
  },
  { id: "charges", label: "Vehicle Charges", cell: (row: any) => row.charges },
  {
    id: "workingDays",
    label: "Working Days",
    cell: (row: any) => row.workingDays,
  },
  {
    id: "overtime",
    label: "Overtime",
    cell: (row: any) => row.overtime,
  },
  {
    id: "workingAmount",
    label: "Working Amount",
    cell: (row: any) => row.workingAmount,
  },
  {
    id: "overtimeAmount",
    label: "Overtime Amount",
    cell: (row: any) => row.overtimeAmount,
  },
  {
    id: "totalAmount",
    label: "Total Amount",
    cell: (row: any) => row.totalAmount,
  },
  { id: "gst", label: "GST", cell: (row: any) => row.gst },
  {
    id: "billamount",
    label: "Bill Amount",
    cell: (row: any) => row.billamount,
  },
  { id: "tds", label: "TDS", cell: (row: any) => row.tds },
  { id: "netamount", label: "Net Amount", cell: (row: any) => row.netamount },
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
}: {
  contractors: Contractor[];
  workorders: Workorder[];
  contractor: ContractorwithVehicle;
}) {
  const [value, setValue] = useState<string>(dayjs().format("MM/YYYY"));
  const [selectedContractor, setSelectedContractor] = useState<string>(
    contractor.contractorId
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [hsdcost, setHsdCost] = useState(0);
  const [calRows, setCalRows] = useState<
    { heading: string; headcells: any[]; data: any[] }[]
  >([]);
  const [vehicles, setVehicles] = useState<
    (Vehicle & {
      automobile: Automobile[];
    })[]
  >([]);
  const [selectedVehicles, setSelectedVehicles] = useState<
    (Vehicle & {
      automobile: Automobile[];
    })[]
  >([]);
  const router = useRouter();
  const { month } = router.query;

  useEffect(() => {
    if (contractor?.vehicle) {
      const { data, kpidata, overtimedata, totals, total, hsdcost } =
        getAutomobileFinalSheet(selectedVehicles, contractor?.hsd[0], value);
      setTotal(total);
      setHsdCost(hsdcost);
      setCalRows([
        { heading: "Billing Information", headcells, data },
        { heading: "Over Time Information", headcells, data: overtimedata },
        { heading: "KPI Information", headcells: headcells1, data: kpidata },
        { heading: "Total Information", headcells: headcells2, data: totals },
      ]);
    }
  }, [selectedContractor, value, selectedVehicles]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (contractor?.vehicle) {
      setVehicles(contractor?.vehicle);
      setSelectedVehicles(contractor?.vehicle);
    }
  }, [selectedContractor]);

  const fetchPayouts = async () => {
    const res = await axios.get(
      `/api/payouttracker?contractorid=${selectedContractor}&month=${value}`
    );

    setDetails(res.data);
  };

  const onChange = (value: Dayjs | null) =>
    router.push(
      `/automobile-finalsheet?month=${value?.format("MM/YYYY")}&contractorId=${
        contractor.contractorId
      }`
    );

  const w = workorders.find(
    (c) =>
      c.contractorId === contractor?.contractorId && c.startDate.includes(value)
  );

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
                  `/automobile-finalsheet?month=${
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
            <AutoComplete
              label="Select Vehicle"
              value={""}
              setValue={(value) => {
                const v = selectedVehicles.find((d) => d.vehicleNo === value);
                if (!v) {
                  const d = vehicles.find((d) => d.vehicleNo === value);

                  if (d) {
                    setSelectedVehicles([...selectedVehicles, d]);
                  }
                }
              }}
              options={vehicles.map((d) => ({
                label: d.vehicleNo,
                value: d.vehicleNo,
              }))}
            />
          </Stack>
          {/* <Button
            variant="contained"
            color="secondary"
            sx={{ height: "fit-content" }}
          >
            Freeze
          </Button> */}

          <Button
            variant="contained"
            onClick={() =>
              handleAutomobileprint({
                calRows,
                contractor: contractor as Contractor,
                month: value,
                total: total,
                workorder: w,
              })
            }
            color="secondary"
          >
            Print
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2} rowGap={2} flexWrap="wrap">
          {selectedVehicles.map((d) => (
            <Chip
              key={d.vehicleNo}
              label={d.vehicleNo + " - " + d.vehicleType}
              onDelete={() =>
                setSelectedVehicles(
                  selectedVehicles.filter(
                    (vehicle) => vehicle.vehicleNo !== d.vehicleNo
                  )
                )
              }
            />
          ))}
        </Stack>
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
        <FinalSheetTable data={calRows} total={total} hsdcost={hsdcost} />
      )}
      <Divider sx={{ my: 2 }} />

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

  // if (!(session.user?.role === "Corporate")) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  const contractors = await prisma.contractor.findMany({
    orderBy: { contractorname: "asc" },
    // include: {
    //   vehicle: {
    //     where: {
    //       vehicleNo: {
    //         in: (vehicles as string)?.split(","),
    //       },
    //     },
    //     include: {
    //       automobile: {
    //         where: {
    //           date: {
    //             contains: (month as string) || dayjs().format("MM/YYYY"),
    //           },
    //         },
    //       },
    //     },
    //   },
    //   hsd: true,
    // },
    where: {
      servicedetail: "Equipment / Vehicle Hiring",
    },
  });

  let contractor =
    contractorId &&
    (await prisma.contractor.findUnique({
      where: {
        contractorId: contractorId as string,
      },
      include: {
        vehicle: {
          include: {
            automobile: {
              where: {
                date: {
                  contains: (month as string) || dayjs().format("MM/YYYY"),
                },
              },
            },
          },
        },
        hsd: true,
      },
    }));

  if (!contractor) {
    contractor = await prisma.contractor.findFirst({
      orderBy: { contractorname: "asc" },
      include: {
        vehicle: {
          where: {
            vehicleNo: {
              in: (vehicles as string)?.split(","),
            },
          },
          include: {
            automobile: {
              where: {
                date: {
                  contains: (month as string) || dayjs().format("MM/YYYY"),
                },
              },
            },
          },
        },
        hsd: true,
      },
      where: {
        servicedetail: "Equipment / Vehicle Hiring",
      },
    });
  }

  const workorders = await prisma.workorder.findMany();

  return {
    props: { contractors, workorders, contractor: contractor },
  };
};
