import prisma from "@/lib/prisma";
import FormSelect from "@/ui-component/FormSelect";
import MonthSelect from "@/ui-component/MonthSelect";
import getTotalAmountAndRows from "@/utils/get8hr";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Contractor,
  Department,
  Designations,
  Safety,
  Stores,
  TimeKeeper,
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
import PrintPdf from "@/components/pdfPrint/print";

export default function FinalSheet({
  contractors,
  workorders,
  departments,
  designations,
}: {
  contractors: Contractor[];
  workorders: Workorder[];
  departments: Department[];
  designations: Designations[];
}) {
  const [value, setValue] = useState<string>(dayjs().format("MM/YYYY"));
  const [selectedContractor, setSelectedContractor] = useState<string>(
    contractors.length > 0 && contractors[0].contractorId
      ? contractors[0]?.contractorId
      : ""
  );
  const [rows, setRows] = useState<any[]>([]);
  const [timekeepers, setTimekeepers] = useState<TimeKeeper[]>([]);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [department, setDepartment] = useState<string>(
    departments?.length > 0 ? departments[0].department : ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [store, setStore] = useState<Stores | null>(null);
  const [safety, setSafety] = useState<Safety | null>(null);
  const [details, setDetails] = useState<any>(null);
  const f = contractors.find((c) => c.contractorId === selectedContractor);

  const fetchStoreAndSafety = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/stores?contractorid=${selectedContractor}&month=${value}`
    );
    setStore(res.data);
    const res1 = await axios.get(
      `/api/safety?contractorid=${selectedContractor}&month=${value}`
    );
    setSafety(res1.data);
    setLoading(false);
  };

  const fetchTimekeepers = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/gettimekeeper?contractor=${selectedContractor}&month=${value}&department=${department}`
    );

    const { rows1, totalnetPayable } = getTotalAmountAndRows(
      res.data,
      dayjs(value, "MM/YYYY").month() + 1,
      dayjs(value, "MM/YYYY").year(),
      designations.filter((d) => d.departmentname === department),
      departments.find((d) => d.department === department)
    );
    setRows(rows1);

    setTotalPayable(totalnetPayable);
    setTimekeepers(res.data);
    setLoading(false);
  };

  const fetchPayouts = async () => {
    const res = await axios.get(
      `/api/payouttracker?contractorid=${selectedContractor}&month=${value}`
    );

    setDetails(res.data);
  };

  const fetchAll = async () => {
    setLoading(true);
    await fetchTimekeepers();
    await fetchStoreAndSafety();
    await fetchPayouts();
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [selectedContractor, value, department]);

  // console.log(timekeepers, rows, totalPayable, loading);

  const handlePrint = async () => {
    print(
      rows,
      totalPayable,
      departments.find((d) => d.department === department),
      f as Contractor,
      workorders.find(
        (w) => w.contractorId === f?.id && w.startDate.includes(value)
      ) as Workorder,
      value,
      store,
      safety,
      details.payoutracker,
      details.prevMonthAmount,
      details.prevprevMonthAmount,
      details.prevYearAmount,
      designations
    );
  };

  const onChange = (value: Dayjs | null) =>
    setValue(value?.format("MM/YYYY") || "");

  const w = workorders.find(
    (c) => c.contractorId === f?.id && c.startDate.includes(value)
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <FormSelect
              value={selectedContractor}
              handleChange={(value) => setSelectedContractor(value as string)}
              options={contractors.map((c) => ({
                value: c.contractorId || "",
                label: c.contractorname,
              }))}
              label="Contractor"
            />
            <MonthSelect
              label="Select Date"
              value={dayjs(value, "MM/YYYY")}
              onChange={onChange}
            />
            <FormSelect
              value={department}
              handleChange={(value) => setDepartment(value as string)}
              options={departments.map((d) => ({
                value: d.department,
                label: d.department,
              }))}
              label="Department"
            />
          </Stack>

          <Button
            variant="contained"
            sx={{
              ml: "auto",
              width: "7rem",
              alignSelf: "flex-end",
              justifySelf: "space-between",
              mb: 2,
            }}
            onClick={() => handlePrint()}
          >
            Print
          </Button>
          {/* <PrintPdf
            designations={designations}
            department={
              departments.find((d) => d.department === department) as Department
            }
            totalnetPayable={totalPayable}
            rows1={rows}
            store={store}
            safety={safety}
            details={details}
          /> */}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h4" sx={{ mb: 4, my: 2 }}>
          Contractor Details :
        </Typography>
        <Details
          rows={[
            { label: "Contractor Id", value: selectedContractor.toString() },
            { label: "Contractor Name", value: f?.contractorname as string },
            { label: "Mobile Number", value: f?.mobilenumber as string },
            { label: "Office Address", value: f?.officeaddress as string },
            { label: "Pan Number", value: f?.pancardno as string },
            { label: "Area of Work", value: f?.areaofwork as string },
            {
              label: "Type of Contractor",
              value: f?.typeofcontractor as string,
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
        <FinalSheetta
          rows={rows}
          total={totalPayable}
          department={departments.find((d) => d.department === department)}
          storededuction={store?.totalAmount || 0}
          safetydeduction={safety?.totalAmount || 0}
          designations={designations}
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
            value: (details?.prevMonthAmount || 0)?.toString(),
          },
          {
            label: "Cost of the Month",
            value: (details?.prevprevMonthAmount || 0)?.toString(),
          },
          { label: "Cost Upto This Month", value: totalPayable?.toString() },
          {
            label: "Cost Of the Previous Year",
            value: (details?.prevYearAmount || 0)?.toString(),
          },
        ]}
      />

      <Divider sx={{ my: 2 }} />
      <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
        Bank Account Information :
      </Typography>
      <Details
        rows={[
          { label: "Beneficial Name", value: f?.beneficialname as string },
          { label: "Account Number", value: f?.bankaccountnumber as string },
          { label: "IFSC Code", value: f?.ifscno as string },
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
            value: details?.payoutracker?.actualpaidoutmoney || "-",
          },
        ]}
      />
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

  if (!(session.user?.role === "Corporate")) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const contractors = await prisma.contractor.findMany();
  const workorders = await prisma.workorder.findMany();
  const departments = await prisma.department.findMany();
  const designations = await prisma.designations.findMany();

  return {
    props: { contractors, workorders, departments, designations },
  };
};
