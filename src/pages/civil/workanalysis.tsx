import dynamic from "next/dynamic";
import React from "react";
const LineChart = dynamic(() => import("../../components/Civil/LineChart"), {
  ssr: false,
});

import prisma from "@/lib/prisma";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import {
  BarBending,
  BarBendingItem,
  Contractor,
  Measurement,
  MeasurementItem,
  Project,
  Qcs,
  QcsBoq,
  QcsBoqItem,
} from "@prisma/client";
import axios from "axios";
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
  contractor,
  project,
}: {
  contractors: Contractor[];
  contractor: Contractor & {
    Qcs: (Qcs & { project: Project })[];
  };

  project: Project;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const [boqs, setBoqs] = useState<Boq[]>([]);

  const [boq, setBoq] = useState<Boq | null>(null);

  const router = useRouter();

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

  const { series, xaxis } = useMemo(
    () =>
      getAnalysisSeries({
        boq,
      }),
    [boq]
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

  let project = contractor.Qcs.find((p) => p.projectId === projectId)?.project;

  if (!project) {
    project = contractor.Qcs[0].project;
  }

  return {
    props: {
      contractors,
      contractor: contractor,
      project,
    },
  };
};
