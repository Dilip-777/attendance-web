import * as React from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import {
  Contractor,
  Department,
  FixedWork,
  HiredFixedWork,
  Works,
} from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Paper, Stack, Toolbar } from "@mui/material";
import AutoComplete from "@/ui-component/Autocomplete";
import CustomTable from "@/ui-component/CustomTable";

interface FixedWorkWithContractor extends FixedWork {
  contractor: Contractor;
}

interface HeadCell {
  id: string;
  label: string;
  cell: (row: FixedWorkWithContractor) => any;
  numeric?: boolean;
  align?: "left" | "right" | "center";
  colspan?: number;
}

const headCells: HeadCell[] = [
  {
    id: "contratorid",
    label: "Contractor ID",
    cell: (row) => row.contractor.contractorId,
  },
  {
    id: "contractorname",
    label: "Contractor Name",
    cell: (row) => row.contractor.contractorname,
  },
  {
    id: "description",
    label: "Work Description",
    cell: (row) => row.description,
  },
  { id: "rate", label: "Rate", cell: (row) => row.rate },
];

export default function Contractors({
  contractors,
  works,
}: {
  contractors: Contractor[];
  works: FixedWorkWithContractor[];
}) {
  const router = useRouter();

  const handleClickReport = () => {
    const tableRows = [
      [
        "Contractorid",
        "Contractor Name",
        "Service Detail",
        "Supplier Detail",
        "Mobile Number",
        "Office Address",
        "Email",
        "Organisation Type",
        "Date of Incorporation",
        "Competitor Name",
        "ISO Certified",
        "Turnover Last Year",
        "Turnover 2 Year Back",
        "Unique Number",
        "Registration Number",
        "First Registration Number",
        "Latest Month GST1 Filed",
        "Latest Month GST2B Filed",
        "Comply Regulatory",
        "Code of Proprietor",
        "List Major Product",
        "Quality Control Procedure",
        "Value Add Product",
        "Five Strength Points",
        "Weakness",
        "Training Provided",
        "Clientele",
        "Refrence Organisation1",
        "Reference Contact1",
        "Reference Designation1",
        "Period of Service1",
        "Refrence Organisation2",
        "Reference Contact2",
        "Reference Designation2",
        "Period of Service2",
        "Refrence Organisation3",
        "Reference Contact3",
        "Reference Designation3",
        "Period of Service3",
      ],
    ];
    contractors.forEach((item: Contractor) => {
      tableRows.push([
        item.contractorId.toString(),
        item.contractorname,
        item.servicedetail,
        item.supplierdetail,
        item.mobilenumber,
        item.officeaddress || "-",
        (item?.emailid as string) || "-",
        item.organisationtype || "-",
        item.dateofincorporation?.toString() || "-",
        item.competitorname || "-",
        item.isocertified?.toString() || "-",
        item.turnoverlastyear?.toString() || "-",
        item.turnover2yearback || "-",
        item.uniquenumber || "-",
        item.registration_number || "-",
        item.first_registration_number || "-",
        item.latest_mnth_gst1_filed?.toString() || "-",
        item.latest_mnth_gst2b_filed?.toString() || "-",
        item.comply_regulatory.toString() || "-",
        item.code_of_proprietor || "-",
        item.list_major_product || "-",
        item.qualty_control_procedure || "-",
        item.valueadd_product || "-",
        item.five_strength_points || "-",
        item.weakness || "-",
        item.selection_training_method || "-",
        item.clientele || "-",
        item.reference_organistaion_1 || "-",
        item.reference_contact_1 || "-",
        item.reference_designation_1 || "-",
        item.period_of_service_1 || "-",
        item.reference_organistaion_2 || "-",
        item.reference_contact_2 || "-",
        item.reference_designation_2 || "-",
        item.period_of_service_2 || "-",
        item.reference_organistaion_3 || "-",
        item.reference_contact_3 || "-",
        item.reference_designation_3 || "-",
        item.period_of_service_3 || "-",
      ]);
    });
    const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Contractors.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", pb: 2, minHeight: "50vh" }}>
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
              label="Select Contractor"
              value={
                (router.query.contractorId as string) ||
                contractors[0]?.contractorId
              }
              setValue={(contratorId) => {
                router.push(`/works?contractorId=${contratorId}`);
              }}
              options={contractors.map((c) => ({
                value: c.contractorId || "",
                label: c.contractorname,
              }))}
            />
          </Stack>
        </Toolbar>
        <CustomTable headCells={headCells} data={works} />
      </Paper>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  let { contractorId } = context.query;

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

  if (user?.role === "Admin" || user?.role !== "Corporate") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  if (!contractorId) {
    contractorId = await prisma.contractor
      .findFirst({
        where: {
          servicedetail: "Fixed",
        },
      })
      .then((contractor) => contractor?.contractorId);
  }

  const works = await prisma.fixedWork.findMany({
    where: {
      contractorid: contractorId as string,
    },
    include: {
      contractor: true,
    },
  });

  const contractors = await prisma.contractor.findMany({
    where: {
      servicedetail: "Fixed",
    },
  });
  return {
    props: {
      contractors,
      works: JSON.parse(JSON.stringify(works)),
    },
  };
};
