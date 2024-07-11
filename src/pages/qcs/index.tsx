import * as React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Project, Qcs } from "@prisma/client";
import _, { ceil } from "lodash";
import ImportData from "@/components/employeeImport";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Toolbar,
  alpha,
  styled,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import CustomTable from "@/ui-component/CustomTable";
import Add from "@mui/icons-material/Add";
import Download from "@mui/icons-material/Download";
import Search from "@mui/icons-material/Search";
import AutoComplete from "@/ui-component/Autocomplete";

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  marginRight: 30,
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

interface QCsContractor extends Qcs {
  contractor: Contractor;
  project: Project;
}

export default function Projects({
  contractors,
  qcs,
  contractorId,
  projectId,
}: {
  qcs: (Qcs & { contractor: Contractor; project: Project })[];
  contractors: (Contractor & { Qcs: (Qcs & { project: Project })[] })[];
  contractorId: string;
  projectId: string;
}) {
  const [filterName, setFilterName] = React.useState("");
  const [orderby, setOrderby] = React.useState("name");
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const router = useRouter();
  const contractor = React.useMemo(
    () =>
      contractors.find(
        (contractor) => contractor.contractorId === contractorId
      ),
    [contractors, contractorId]
  );
  const headcells = [
    {
      id: "contractor",
      label: "Contractor Name",
      cell: (row: QCsContractor) => row.contractor.contractorname,
    },
    {
      id: "project",
      label: "Project Name",
      cell: (row: QCsContractor) => row.project.name,
    },
    {
      id: "description",
      label: "Bid",
      cell: (row: QCsContractor) => row.description,
    },
    {
      id: "action",
      label: "Action",
      cell: (row: QCsContractor) => {
        return (
          <Stack direction="row" spacing={2}>
            <IconButton onClick={() => router.push("/qcs/" + row.id)}>
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => {
                setSelected(row.id);
                setOpen(true);
              }}
            >
              <Delete />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={2}>
            <AutoComplete
              value={contractorId}
              options={contractors.map((contractor) => ({
                label: contractor.contractorname,
                value: contractor.contractorId,
              }))}
              setValue={(value) => {
                router.push(
                  "/qcs?contractorId=" + value + "&projectId=" + projectId
                );
              }}
            />
            <AutoComplete
              value={projectId}
              options={
                contractor?.Qcs.map((q) => ({
                  label: q.project.name,
                  value: q.projectId,
                })) || []
              }
              setValue={(value) => {
                // console.log(value);

                router.push(
                  "/qcs?contractorId=" + contractorId + "&projectId=" + value
                );
              }}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => router.push("/qcs/add")}
              startIcon={<Add />}
              color="secondary"
            >
              Add QCS
            </Button>
          </Stack>
        </Toolbar>
        <CustomTable headCells={headcells} data={qcs} nocheckbox={false} />
      </Paper>
    </Box>
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

  let { contractorId, projectId } = context.query;

  const contractors = await prisma.contractor.findMany({
    include: {
      Qcs: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!contractorId || !projectId) {
    const contractor = contractors.find(
      (contractor) => contractor.Qcs.length > 0
    );
    contractorId = contractor?.contractorId;
    projectId = contractor?.Qcs[0].projectId;
  }

  const qcs = await prisma.qcs.findMany({
    where: {
      contractorid: contractorId as string,
      projectId: projectId as string,
    },
    include: {
      contractor: true,
      project: true,
    },
  });

  return {
    props: {
      qcs,
      contractors,
      contractorId,
      projectId,
    },
  };
};
