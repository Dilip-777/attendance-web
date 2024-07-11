import dynamic from "next/dynamic";
import React from "react";
const LineChart = dynamic(() => import("../../components/Civil/LineChart"), {
  ssr: false,
});

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
import AutoComplete from "@/ui-component/Autocomplete";
import { useRouter } from "next/router";

import { getBoqFinalSheet } from "@/utils/getboqfinalsheet";
import { getAnalysisSeries } from "@/utils/civil/getAnalysis";

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
  const [boq, setBoq] = useState<Boq | null>(null);

  const router = useRouter();
  const [month, setMonth] = useState<string | null>(dayjs().format("MM/YYYY"));
  const [endMonth, setEndMonth] = useState<string | null>(
    dayjs().format("MM/YYYY")
  );

  const fetchBoqs = async () => {
    const res = await axios.get(
      "/api/civil/abstract?contractorId=" +
        contractor?.contractorId +
        "&projectId=" +
        project.id
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

  const { series, xaxis } = useMemo(
    () =>
      getAnalysisSeries({
        boq,
        month: month as string,
      }),
    [boq, month]
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
            router.push(`/civil/workanalysis?contractorId=${value}`)
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
              `/civil/workanalysis?contractorId=${contractor.contractorId}&projectId=${value}`
            )
          }
          options={contractor.Qcs.map((c) => ({
            value: c.projectId || "",
            label: c.project.name,
          }))}
        />
        <MonthSelect
          label="Select Month"
          value={dayjs(month as string, "MM/YYYY")}
          onChange={(value: Dayjs | null) => {
            if (value) setMonth(value?.format("MM/YYYY"));
            if (value) setMonth(value?.format("MM/YYYY"));
          }}
        />

        <AutoComplete
          label="Select BOQ"
          value={boq?.id || ""}
          setValue={(value) => {
            const boq = boqs.find((b) => b.id === value);
            setBoq(boq ?? null);
          }}
          options={boqs.map((c) => ({
            value: c.id || "",
            label: c.description,
          }))}
        />
      </Stack>

      <Box
        sx={{
          my: "24px",
        }}
      >
        <LineChart xaxis={xaxis} series={series} />
      </Box>
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

  let project = contractor.Qcs.find((p) => p.id === projectId)?.project;

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
