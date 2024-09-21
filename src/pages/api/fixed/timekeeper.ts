import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { contractorId, month } = req.query;
    const timekeeper = await prisma.timeKeeper.findMany({
      where: {
        contractorid: contractorId as string,
        attendancedate: {
          contains: month as string,
        },
      },
    });
    res.status(200).json({ success: true, data: timekeeper });
  }
}
