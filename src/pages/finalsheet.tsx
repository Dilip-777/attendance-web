import prisma from "@/lib/prisma";
import FormSelect from "@/ui-component/FormSelect";
import MonthSelect from "@/ui-component/MonthSelect";
import getTotalAmountAndRows from "@/utils/get8hr";
import getColony from "@/utils/getColony";
import { render } from "redocx";
import {
  column8HR,
  columnccm,
  columncolony,
  columnlrf,
} from "@/utils/getColumns";
import getCCM from "@/utils/getccm";
import getLRF from "@/utils/getlrf";
import { print8HR, printOther } from "@/utils/printfinalreport";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  Contractor,
  Department,
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

interface Column {
  id:
    | "date"
    | "m8"
    | "f8"
    | "m20"
    | "f20"
    | "dm"
    | "qc"
    | "store"
    | "k7m"
    | "k7f"
    | "rmhs"
    | "ps"
    | "hk"
    | "svr"
    | "total";
  label: string;
  border?: boolean;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: "date",
    label: "",
    minWidth: 80,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "m8",
    label: "M",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "f8",
    label: "F",
    minWidth: 50,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "m20",
    label: "M",
    minWidth: 50,
    align: "center",

    format: (value: number) => value.toString(),
  },
  {
    id: "f20",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "dm",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "qc",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "store",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "k7m",
    label: "M",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "k7f",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "rmhs",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "ps",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "hk",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "svr",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "total",
    label: "",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
];

export default function FinalSheet({
  contractors,
  workorders,
  departments,
}: {
  contractors: Contractor[];
  workorders: Workorder[];
  departments: Department[];
}) {
  const [value, setValue] = useState<string>(dayjs().format("MM/YYYY"));
  const [selectedContractor, setSelectedContractor] = useState<number>(
    contractors.length > 0 && contractors[0].contractorId
      ? contractors[0]?.contractorId
      : 0
  );
  const [rows, setRows] = useState<any[]>([]);
  const [timekeepers, setTimekeepers] = useState<TimeKeeper[]>([]);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [department, setDepartment] = useState<string>("8HR");
  const [loading, setLoading] = useState<boolean>(false);
  const [store, setStore] = useState<Stores | null>(null);
  const [safety, setSafety] = useState<Safety | null>(null);
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
    console.log(res.data, "data");

    if (department === "8HR" || department === "12HR") {
      const { rows1, totalnetPayable } = getTotalAmountAndRows(
        res.data,
        dayjs(value, "MM/YYYY").month() + 1,
        dayjs(value, "MM/YYYY").year()
      );

      setRows(rows1);
      setTotalPayable(totalnetPayable);
    } else if (department === "CCM") {
      const { rows1, totalnetPayable } = getCCM(
        res.data,
        dayjs(value, "MM/YYYY").month() + 1,
        dayjs(value, "MM/YYYY").year()
      );

      setRows(rows1);
      setTotalPayable(totalnetPayable);
    } else if (department === "LRF") {
      const { rows1, totalnetPayable } = getLRF(
        res.data,
        dayjs(value, "MM/YYYY").month() + 1,
        dayjs(value, "MM/YYYY").year()
      );

      setRows(rows1);
      setTotalPayable(totalnetPayable);
    } else {
      const { rows1, totalnetPayable } = getColony(
        res.data,
        dayjs(value, "MM/YYYY").month() + 1,
        dayjs(value, "MM/YYYY").year()
      );

      setRows(rows1);
      setTotalPayable(totalnetPayable);
    }
    setTimekeepers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTimekeepers();
    fetchStoreAndSafety();
  }, [selectedContractor, value, department]);

  // console.log(timekeepers, rows, totalPayable, loading);

  const handlePrint = () => {
    print(
      rows,
      totalPayable,
      department,
      f as Contractor,
      workorders.find(
        (w) => w.contractorId === f?.id && w.startDate.includes(value)
      ) as Workorder,
      value,
      store,
      safety
    );
    // const c = contractors.find((c) => c.contractorId === selectedContractor);
    // const w = workorders.find(
    //   (w) => w.contractorId === f?.id && w.startDate.includes(value)
    // );
    // if (department === "8HR" || department === "12HR") {
    //   print8HR(rows, c, w, department, totalPayable);
    // } else {
    //   printOther(rows, c, w, department, totalPayable);
    // }
  };

  console.log(rows);

  const onChange = (value: Dayjs | null) =>
    setValue(value?.format("MM/YYYY") || "");

  return (
    <Paper sx={{ p: 3 }}>
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
              handleChange={(value) => setSelectedContractor(value as number)}
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
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h4" sx={{ mb: 4, my: 2 }}>
          Contractor Details :
        </Typography>
        <Box display="flex" flexWrap={"wrap"}>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Contractor Id :{" "}
            <span style={{ fontWeight: "500" }}>{selectedContractor}</span>
          </Typography>

          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Contractor Name :{" "}
            <span style={{ fontWeight: "500" }}>
              {
                contractors.find((c) => c.contractorId === selectedContractor)
                  ?.contractorname
              }
            </span>
          </Typography>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Mobile Number :{" "}
            <span style={{ fontWeight: "500" }}>
              {
                contractors.find((c) => c.contractorId === selectedContractor)
                  ?.mobilenumber
              }
            </span>
          </Typography>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Office Address :{" "}
            <span style={{ fontWeight: "500" }}>
              {
                contractors.find((c) => c.contractorId === selectedContractor)
                  ?.officeaddress
              }
            </span>
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
          Service Details :
        </Typography>
        <Box display="flex" flexWrap={"wrap"}>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Workorderid :{" "}
            <span style={{ fontWeight: "500" }}>
              {workorders.find(
                (c) => c.contractorId === f?.id && c.startDate.includes(value)
              )?.id || "-"}
            </span>
          </Typography>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Nature of Work :{" "}
            <span style={{ fontWeight: "500" }}>
              {workorders.find(
                (c) => c.contractorId === f?.id && c.startDate.includes(value)
              )?.nature || "-"}
            </span>
          </Typography>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Location :{" "}
            <span style={{ fontWeight: "500" }}>
              {workorders.find(
                (c) => c.contractorId === f?.id && c.startDate.includes(value)
              )?.location || "-"}
            </span>
          </Typography>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Invoice Month : <span style={{ fontWeight: "500" }}>{value}</span>
          </Typography>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Start Date :{" "}
            <span style={{ fontWeight: "500" }}>
              {workorders.find(
                (c) => c.contractorId === f?.id && c.startDate.includes(value)
              )?.startDate || "-"}
            </span>
          </Typography>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            End Date :{" "}
            <span style={{ fontWeight: "500" }}>
              {workorders.find(
                (c) => c.contractorId === f?.id && c.startDate.includes(value)
              )?.endDate || "-"}
            </span>
          </Typography>
        </Box>
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
          department={department}
        />
      )}
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const contractors = await prisma.contractor.findMany();
  const workorders = await prisma.workorder.findMany();
  const departments = await prisma.department.findMany();

  return {
    props: { contractors, workorders, departments },
  };
};
