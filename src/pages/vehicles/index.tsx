import * as React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Vehicle } from "@prisma/client";
import _ from "lodash";
import CustomTable from "@/components/Table/Table";

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

const headCells1 = [
  createHeadCells("contractorId", "Contractor Code", false, false),
  createHeadCells("contractor.contractorname", "Contractor Name", false, false),
  createHeadCells("vehicleNo", "Vehicle Number", false, false),
  createHeadCells("vehicleType", "Vehicle Type", false, false),
  createHeadCells("mileage", "Mileage", true, false),
  createHeadCells("charges", "Charges", true, false),
  createHeadCells("paymentMode", "Payment Mode", false, false),
  createHeadCells("shiftduraion", "Shift Duration", false, false),
  createHeadCells("mainenanceTime", "Maintenance Time", false, false),
  createHeadCells("deployment", "Deployment", false, false),
  createHeadCells("eligibleForOvertime", "Eligible For Overtime", false, false),
  createHeadCells("hsdProvidedBy", "HSD Provided By", false, false),
  createHeadCells("gst", "GST", true, false),
];

export default function Vehicles({ vehicles }: { vehicles: Vehicle[] }) {
  const [filterName, setFilterName] = React.useState("");
  const [orderby, setOrderby] = React.useState("vehicleNo");

  const handleClickReport = () => {
    const tableRows = [
      [
        "Vehicle Number",
        "Vehicle Type",
        "Mileage",
        "Charges",
        "Payment Mode",
        "Shift Duration",
        "Maintenance Time",
        "Deployment",
        "Eligible For Overtime",
        "HSD Provided By",
        "GST",
      ],
    ];
    vehicles
      .filter((vehicle) =>
        _.get(vehicle, orderby, "vehicleNo")
          .toString()
          .toLowerCase()
          .includes(filterName.toLowerCase())
      )
      .forEach((item) => {
        tableRows.push([
          item.vehicleNo.toString(),
          item.vehicleType,
          item.mileage?.toString() || "-",
          item.charges?.toString() || "-",
          item.paymentMode || "-",
          item.shiftduraion.toString() || "-",
          item.mainenanceTime || "-",
          item.deployment || "-",
          item.eligibleForOvertime ? "Yes" : "No",
          item.hsdProvidedBy || "-",
          item.gst?.toString() || "-",
        ]);
      });
    const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Vehicles.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CustomTable
      headcells={headCells1}
      rows={vehicles.filter((vehicle) =>
        _.get(vehicle, orderby, "vehicleNo")
          .toString()
          .toLowerCase()
          .includes(filterName.toLowerCase())
      )}
      filterName={filterName}
      setFilterName={setFilterName}
      editLink="/vehicles"
      // upload={
      //   <ImportData
      //     departments={departments}
      //     designations={designations}
      //     contractors={contractors}
      //   />
      // }
      orderby={orderby}
      setOrderby={setOrderby}
      handleClickReport={handleClickReport}
    />
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
  const vehicles = await prisma.vehicle.findMany({
    include: {
      contractor: true,
    },
  });
  return {
    props: {
      vehicles,
    },
  };
};
