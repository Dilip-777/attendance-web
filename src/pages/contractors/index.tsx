import Head from "next/head";
import * as React from "react";
import {
  Backdrop,
  Button,
  Fade,
  FormControl,
  FormLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import { Contractor } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import CustomTable from "@/components/Table/TablePagination";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const options = [
  { link: "/pc8hr", label: "8HR" },
  { link: "/pc12hr", label: "12HR" },
  { link: "plccm", label: "CCM" },
  { link: "pclrf", label: "LRF" },
  { link: "colony", label: "Colony" },
];

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

const headCells = [
  createHeadCells("contractorId", "Contractor ID", false, false),
  createHeadCells("contractorname", "Contractor Name", false, false),
  createHeadCells("servicedetail", "Service Detail", true, false),
  createHeadCells("supplierdetail", "Supplier Detail", true, false),
  createHeadCells("telephonenumber", "telephone Number", true, false),
  createHeadCells("emailid", "Email", false, false),
  createHeadCells("mobilenumber", "Mobile Number", true, false),
  createHeadCells("officeaddress", "Office Address", false, false),
  createHeadCells("website", "Website", false, false),
  createHeadCells("organisationtype", "Organisation Type", false, false),
  createHeadCells("isocertified", "Is Certified", false, false),
  createHeadCells("uniquenumber", "Unique Number", false, false),
  createHeadCells("registration_number", "Registration Number", true, false),
  createHeadCells(
    "first_registration_number",
    "First Registration Number",
    false,
    false
  ),
  createHeadCells("delivery_procedure", "Delivery Procedure", false, false),
];

export default function Contractors({
  contractors,
}: {
  contractors: Contractor[];
}) {
  const [filterName, setFilterName] = React.useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const [contractorId, setContractorId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    setContractorId("");
  };

  const headcell1 = createHeadCells(
    "attendance",
    "View Attendance",
    false,
    true
  );
  const headcell2 = createHeadCells(
    "hoform",
    "Ho Commercial Form",
    false,
    true
  );

  const extraHeadCells =
    session?.user?.role !== "HR"
      ? session?.user?.role === "HoCommercialAuditor"
        ? [headcell1, headcell2]
        : [headcell1]
      : [];

  return (
    <Box sx={{ width: "100%" }}>
      <CustomTable
        rows={contractors.filter((c) =>
          c.contractorname.toLowerCase().includes(filterName.toLowerCase())
        )}
        editLink="/contractors"
        filterName={filterName}
        setFilterName={setFilterName}
        headcells={[...headCells, ...extraHeadCells]}
        setContractorId={setContractorId}
        setOpen={setOpen}
      />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Select the Designation</FormLabel>
                <Select
                  placeholder="Select the designation"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                >
                  {options?.map((option) => (
                    <MenuItem value={option.link}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                disabled={Boolean(!value)}
                onClick={() => router.push(`/${value}/${contractorId}`)}
              >
                View Attendance
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const contractors = await prisma.contractor.findMany();
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  if (user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  return {
    props: {
      contractors,
    },
  };
};

// <Head>
//   <title>Attendance</title>
//   <meta name="description" content="Generated by create next app" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <link rel="icon" href="/favicon.ico" />
// </Head>
