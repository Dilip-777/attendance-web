import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function report(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type, contractor, department, designation } = req.query;

  if (type === "worker") {
    const employees = await prisma.employee.findMany({
      where: {
        contractorId: parseInt(contractor as string),
      },
    });
    res.status(200).json(employees);
  }

  if (type === "department" || type === "manpower") {
    const employees = await prisma.employee.findMany({
      where: {
        department: department as string,
      },
    });
    if(type === "manpower") {
        res.status(200).json(employees);
        return;
    }
    const contractorids = employees.map((employee) => employee.contractorId);
    const contractors = await prisma.contractor.findMany({
      where: {
        contractorId: {
          in: contractorids,
        },
      },
    });

    res.status(200).json(contractors);
  }
  if(type === "designation") {
    const employees = await prisma.employee.findMany({
        where: {
             designation: designation as string,
        } 
    })
    res.status(200).json(employees);
  }
  if( type === "salary") {
    const payouttrackers = await prisma.payoutTracker.findMany({
        where: {
          contractorName: contractor as string 
        },
    })
    res.status(200).json(payouttrackers)
  }
}
