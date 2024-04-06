import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      contractorId,
      month,
      hiringCharged,
      hsdCost,
      hsdConsumed,
      hsdRateCharged,
      totalCost,
    } = req.body;
    const finalCalculation = await prisma.finalCalculations.findUnique({
      where: {
        month_contractorId: {
          month,
          contractorId,
        },
      },
    });
    if (finalCalculation) {
      await prisma.finalCalculations.update({
        where: {
          month_contractorId: {
            month,
            contractorId,
          },
        },
        data: {
          hiringCharged,
          hsdCost,
          hsdConsumed,
          hsdRateCharged,
          totalCost,
        },
      });
    } else {
      await prisma.finalCalculations.create({
        data: {
          contractorId,
          month,
          hiringCharged,
          hsdCost,
          hsdConsumed,
          hsdRateCharged,
          totalCost,
        },
      });
    }
    res.status(200).json({ message: "Success" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
