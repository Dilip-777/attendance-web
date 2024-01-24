import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { month, contractorname, dates } = req.body;
    if (contractorname === "all") {
      const timekeeper = await prisma.timeKeeper.updateMany({
        where: {
          attendancedate: {
            in: dates,
          },
        },
        data: {
          approvedByTimekeeper: true,
        },
      });
      res.status(200).json(timekeeper);
      return;
    }
    const timekeeper = await prisma.timeKeeper.updateMany({
      where: {
        contractorid: contractorname,
        attendancedate: {
          in: dates,
        },
      },
      data: {
        approvedByTimekeeper: true,
      },
    });

    res.status(200).json(timekeeper);
  }
}
