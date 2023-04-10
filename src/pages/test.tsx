import { useState } from "react";
import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";
import * as xlsx from "xlsx";
import axios from "axios";

const prisma = new PrismaClient();

type Props = {
  message?: string;
};

export default function ImportData({ message }: Props) {
  const [items, setItems] = useState([]);

  const handleImport = async (data) => {
    const timekeepers = data.map((d) => ({
      contractorid: d.contractor_id?.toString(),
      contractorname: d.contractor_name,
      employeeid: d.employee_id?.toString(),
      employeename: d.employee_name,
      designation: "",
      attendancedate: d.attendanceDate?.toString() || "",
      machineInTime: d.machineInTime?.toString() || "",
      machineOutTime: d.machineOutTime?.toString() || "",
      machineshift: d.shift?.toString() || "",
      attendance: d.attendence?.toString() || "0",
      department: d.department?.toString() || "",
      overtime: d.overtime?.toString() || "",
      eleave: d.eleave || "0",
    }));

    const res = await axios.post("/api/test", timekeepers);

    console.log(res);
  };

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = async (e) => {
        const bufferArray = e.target?.result;

        const wb = xlsx.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = xlsx.utils.sheet_to_json(ws);

        console.log(data);

        await handleImport(data);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
    });
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          if (e?.target?.files[0]) {
            const file = e.target.files[0];
            readExcel(file);
          }
        }}
      />

      <table className="table container">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d, i) => (
            <tr key={i}>
              <th>dsifh</th>
              <td>sdfkjs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await prisma.$connect();
  const users = await prisma.user.findMany();
  await prisma.$disconnect();
  return { props: { message: `Found ${users.length} users` } };
};
