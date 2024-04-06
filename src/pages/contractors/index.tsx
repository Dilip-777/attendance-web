import * as React from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { Contractor, Department } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import CustomTable from "@/components/Table/Table";
import dynamic from "next/dynamic";
const ImportData = dynamic(() => import("@/components/importContractors"));
const ContractorModal = dynamic(() => import("@/components/contractors/modal"));
// import ImportData from "@/components/importContractors";
import _ from "lodash";
import PersonaliseColumns from "@/components/Timekeeper/PersonaliseColumn";
import DeleteModal from "@/ui-component/DeleteModal";
import axios from "axios";
// import ContractorModal from "@/components/contractors/modal";

interface Column {
  id: string;
  label: string;
  numeric: boolean;
  included: boolean;
  selected: boolean;
  order: number;
}

const createHeadCells = (
  id: string,
  label: string,
  numeric: boolean,
  included: boolean,
  selected: boolean,
  order: number
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
    selected: selected,
    order: order,
  };
};

const headCells = [
  createHeadCells("contractorId", "Contractor ID", false, false, false, 0),
  createHeadCells("contractorname", "Contractor Name", false, false, false, 1),
  createHeadCells("servicedetail", "Service Detail", true, false, false, 2),
  createHeadCells("supplierdetail", "Supplier Detail", true, false, false, 3),
  createHeadCells("telephonenumber", "telephone Number", true, false, false, 4),
  createHeadCells("emailid", "Email", false, false, false, 5),
  createHeadCells("mobilenumber", "Mobile Number", true, false, false, 5),
  createHeadCells("officeaddress", "Office Address", false, false, false, 6),
  createHeadCells("website", "Website", false, false, false, 7),
  createHeadCells("expirationDate", "Expiration Date", false, false, false, 8),
  createHeadCells("servicecharge", "Service Charge", true, false, false, 9),
  createHeadCells(
    "organisationtype",
    "Organisation Type",
    false,
    false,
    false,
    10
  ),
  createHeadCells("isocertified", "Is Certified", false, false, false, 11),
  createHeadCells("uniquenumber", "Unique Number", false, false, false, 12),
  createHeadCells(
    "registration_number",
    "Registration Number",
    true,
    false,
    false,
    13
  ),
  createHeadCells(
    "first_registration_number",
    "First Registration Number",
    false,
    false,
    false,
    14
  ),
  createHeadCells(
    "delivery_procedure",
    "Delivery Procedure",
    false,
    false,
    false,
    15
  ),
];

interface ContractorDepartment extends Contractor {
  departments: Department[];
}

export default function Contractors({
  contractors, // departments,
}: {
  contractors: ContractorDepartment[];
  departments: Department[];
}) {
  const [filterName, setFilterName] = React.useState("");
  const [orderby, setOrderby] = React.useState("contractorId");
  const [selectedColumn, setSelectedColumn] = React.useState(
    headCells.filter((h) => h.order >= 0)
  );
  const [available, setAvailable] = React.useState(
    headCells.filter((h) => h.order === -1)
  );
  const [openColumn, setOpenColumn] = React.useState(false);
  const { data: session } = useSession();
  const [contractorId, setContractorId] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [contractor, setContractor] = React.useState<Contractor | null>(null);
  const [open1, setOpen1] = React.useState(false);
  const router = useRouter();

  const [departments, setDepartments] = React.useState<Department[]>([]);

  // React.useEffect(() => {
  //   const user = session?.user;
  //   if(user) {
  //     user.role = "TimeKeeper";
  //     session.user = user;
  //     await session.s
  //   }
  // })

  const handleClose = () => {
    setOpen(false);
    setContractorId("");
  };

  const headcell1 = createHeadCells(
    "attendance",
    "View Attendance",
    false,
    true,
    false,
    16
  );
  const headcell2 = createHeadCells(
    "hoform",
    "Ho Commercial Form",
    false,
    true,
    false,
    17
  );

  const getHeadCells = () => {
    if (session?.user?.role === "HR") return [];
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

  const handleOpen = (contractor: ContractorDepartment) => {
    setDepartments(contractor.departments || []);
    setOpen(true);
  };

  const updateColumns = ({
    selectedC,
    available,
  }: {
    selectedC: Column[];
    available: Column[];
  }) => {
    setSelectedColumn(selectedC);
    setAvailable(available);
    localStorage.setItem("selectedColumn1", JSON.stringify(selectedC));
    localStorage.setItem("availableColumn1", JSON.stringify(available));
  };

  const handleReset = () => {
    setSelectedColumn(headCells.filter((h) => h.order >= 0));
    setAvailable(headCells.filter((h) => h.order === -1));
    localStorage.setItem(
      "selectedColumn1",
      JSON.stringify(headCells.filter((h) => h.order >= 0))
    );
    localStorage.setItem(
      "availableColumn1",
      JSON.stringify(headCells.filter((h) => h.order === -1))
    );
    setOpenColumn(false);
  };

  React.useEffect(() => {
    const selected = localStorage.getItem("selectedColumn1");
    const available = localStorage.getItem("availableColumn1");
    if (selected && available) {
      setSelectedColumn(JSON.parse(selected));
      setAvailable(JSON.parse(available));
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <CustomTable
        rows={contractors.filter((contractor) =>
          _.get(contractor, orderby, "contractorname")
            .toString()
            .toLowerCase()
            .includes(filterName.toLowerCase())
        )}
        editLink="/contractors"
        filterName={filterName}
        setFilterName={setFilterName}
        headcells={[...selectedColumn, ...extraHeadCells]}
        setContractorId={setContractorId}
        handleOpen={handleOpen}
        type="contractor"
        handleClickReport={handleClickReport}
        upload={<ImportData />}
        orderby={orderby}
        setOrderby={setOrderby}
        handleOpen1={() => setOpenColumn(true)}
        handleDelete={
          session?.user?.role === "Corporate"
            ? (row) => {
                setContractor(row);
              }
            : undefined
        }
      />

      <ContractorModal
        open={open}
        handleClose={handleClose}
        contractorId={contractorId}
        options={departments}
      />
      <PersonaliseColumns
        availableColumns={available}
        selectedColumns={selectedColumn}
        handleClose={() => setOpenColumn(false)}
        open={openColumn}
        updateColumns={updateColumns}
        handleReset={handleReset}
      />
      <DeleteModal
        openModal={contractor !== null}
        title="Delete Contractor"
        message={`Are you sure you want to delete ${contractor?.contractorname} ?`}
        cancelText="Cancel"
        confirmText="Delete"
        deleteApi={`/api/hr/contractors?contractorId=${contractor?.contractorId}`}
        snackbarMessage="Contractor Deleted Successfully"
        onClose={() => setContractor(null)}
        fetchData={() => router.replace(router.asPath)}
      />
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

  const contractors = await prisma.contractor.findMany({
    include: {
      departments: true,
    },
  });
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
