import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Manager(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { contractorId, dates, status } = req.query;

      const count = await prisma.timeKeeper.count({
        where: {
          contractorid: contractorId as string,
          attendancedate: {
            in: (dates as string).split(","),
          },
          status: status as "Approved" | "Rejected" | "NoChanges",
        },
      });
      res.status(200).json({ message: "success", count });
    } catch (error) {
      res.status(400).json({ message: "error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { contractorId, dates, status } = req.body;

      await prisma.timeKeeper.deleteMany({
        where: {
          contractorid: contractorId,
          attendancedate: {
            in: dates,
          },
          status: status,
        },
      });
      res.status(200).json({ message: "success" });
    } catch (error) {
      res.status(400).json({ message: "error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
