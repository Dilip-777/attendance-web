import * as React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Project, Qcs } from "@prisma/client";
import _ from "lodash";
import { Box, Button, IconButton, Paper, Stack, Toolbar } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import CustomTable from "@/ui-component/CustomTable";
import Add from "@mui/icons-material/Add";
import AutoComplete from "@/ui-component/Autocomplete";

interface QCsContractor extends Qcs {
  contractor: Contractor;
  project: Project;
}

export default function Projects({
  qcs,
  projectId,
  projects,
}: {
  qcs: (Qcs & { contractor: Contractor; project: Project })[];
  projectId: string;
  projects: Project[];
}) {
  const [filterName, setFilterName] = React.useState("");
  const [orderby, setOrderby] = React.useState("name");
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const router = useRouter();

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
              value={projectId}
              options={
                projects.map((q) => ({
                  label: q.name,
                  value: q.id,
                })) || []
              }
              setValue={(value) => {
                // console.log(value);

                router.push("/qcs?projectId=" + value);
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

  let { projectId } = context.query;

  const projects = (
    await prisma.project.findMany({
      include: {
        Qcs: {
          take: 1,
        },
      },
    })
  ).filter((p) => p.Qcs.length > 0);

  if (projects.length === 0) {
    return {
      redirect: {
        destination: "/qcs/add",
        permanent: false,
      },
    };
  }

  if (!projectId) {
    projectId = projects[0].id;
  }

  const qcs = await prisma.qcs.findMany({
    where: {
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
      projects,
      projectId,
    },
  };
};
