import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Manager(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { contractorId1, dates1, status1 } = req.body;

      await prisma.timeKeeper.deleteMany({
        where: {
          contractorid: contractorId1,
          attendancedate: {
            in: dates1,
          },
          status: status1,
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
