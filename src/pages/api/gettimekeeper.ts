import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function gettimekeeper(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { month, contractor, department, departments } = req.query;

  // await prisma.timeKeeper.deleteMany()

  if (!contractor) {
    const timekeepers = await prisma.timeKeeper.findMany({
      where: {
        attendancedate: {
          endsWith: month as string,
        },
        attendance: {
          not: "0",
        },

        approvedByTimekeeper: true,
      },
    });
    res.status(200).json(timekeepers);
    return;
  }

  // const departments = (department as string)?.split(",")

  // console.log(departments, "departments");

  if (department) {
    const timekeepers = await prisma.timeKeeper.findMany({
      where: {
        attendancedate: {
          endsWith: month as string,
        },
        contractorid: contractor as string,
        // department: {
        //     in: departments
        // },
        department: department as string,
        attendance: {
          not: "0",
        },
        approvedByTimekeeper: true,
      },
    });

    res.status(200).json(timekeepers);
    return;
  }

  if (departments) {
    const timekeepers = await prisma.timeKeeper.findMany({
      where: {
        attendancedate: {
          endsWith: month as string,
        },
        contractorid: contractor as string,
        // department: {
        //     in: departments
        // },
        department: {
          in: (departments as string).split(","),
        },
        attendance: {
          not: "0",
        },
        approvedByTimekeeper: true,
      },
    });

    res.status(200).json(timekeepers);
    return;
  }

  const timekeepers = await prisma.timeKeeper.findMany({
    where: {
      attendancedate: {
        endsWith: month as string,
      },
      contractorid: contractor as string,
      // department: {
      //     in: departments
      // },
      attendance: {
        in: ["1", "0.5"],
      },

      approvedByTimekeeper: true,
    },
  });

  res.status(200).json(timekeepers);
}
