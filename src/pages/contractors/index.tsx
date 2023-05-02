import Head from "next/head";
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { Contractor, Department } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import CustomTable from "@/components/Table/Table";
import ImportData from "@/components/importContractors";
import axios from "axios";

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
  { link: "pcccm", label: "CCM" },
  { link: "pclrf", label: "LRF" },
  { link: "pccolony", label: "Colony" },
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
  createHeadCells("expirationDate", "Expiration Date", false, false),
  createHeadCells("servicecharge", "Service Charge", true, false),
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
  departments,
}: {
  contractors: Contractor[];
  departments: Department[];
}) {
  const [filterName, setFilterName] = React.useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const [contractorId, setContractorId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const fetchContractors = async () => {
    const res = await axios.get("/api/hr/contractors");
    console.log(res.data);
  };

  React.useEffect(() => {
    fetchContractors();
  }, []);

  // React.useEffect(() => {
  //   const user = session?.user;
  //   if(user) {
  //     user.role = "TimeKeeper";
  //     session.user = user;
  //     await session.s
  //   }
  // })
  const options = departments.map((d) => ({
    link: `pc${d.department.toLowerCase()}`,
    label: d.department,
  }));

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

  const getHeadCells = () => {
    if (session?.user?.role === "HR") return [];
    else if (session?.user?.role === "PlantCommercial") return [headcell1];
    else if (session?.user?.role === "HoCommercialAuditor")
      return [headcell1, headcell2];
    else return [headcell1];
  };

  const extraHeadCells = getHeadCells();

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
        type="contractor"
        handleClickReport={handleClickReport}
        upload={<ImportData />}
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
                    <MenuItem value={option.label}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                disabled={Boolean(!value)}
                onClick={() =>
                  router.push(
                    `plantcommercial?department=${value}&contractorid=${contractorId}`
                  )
                }
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

  const departments = await prisma.department.findMany();

  const contractors = await prisma.contractor.findMany();
  return {
    props: {
      contractors,
      departments,
    },
  };
};

// <Head>
//   <title>Attendance</title>
//   <meta name="description" content="Generated by create next app" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <link rel="icon" href="/favicon.ico" />
// </Head>
