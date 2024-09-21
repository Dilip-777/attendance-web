import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { contractorId, month, fixedValues, designations } = req.body;

    await prisma.timeKeeper.updateMany({
      where: {
        contractorid: contractorId,
        attendancedate: {
          endsWith: month,
        },
      },
      data: {
        freezed: true,
      },
    });

    await prisma.fixedValues.create({
      data: {
        contractorId: contractorId,
        month: month,
        designations: {
          createMany: {
            data: designations,
          },
        },
        serviceDetail: fixedValues.servicedetail,
        areaOfWork: fixedValues.areaofwork,
        gst: fixedValues.gst,
        tds: fixedValues.tds,
        servicechargeRate: fixedValues.servicecharge,
        minManpower: fixedValues.minManpower,
        minHeadcount: fixedValues.minHeadcount,
        deployment: fixedValues.deployment,
        basicamount: Math.round(fixedValues.basicamount),
        gstValue: Math.round(fixedValues.gstValue),
        tdsValue: Math.round(fixedValues.gstValue),
        billamount: Math.round(fixedValues.billamount),
        cost: Math.round(fixedValues.cost),
      },
    });

    res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const { contractorId, month } = req.query;

    await prisma.timeKeeper.updateMany({
      where: {
        contractorid: contractorId as string,
        attendancedate: {
          contains: month as string,
        },
      },
      data: {
        freezed: false,
      },
    });

    await prisma.fixedValues.delete({
      where: {
        month_contractorId: {
          month: month as string,
          contractorId: contractorId as string,
        },
      },
    });

    res.status(200).json({ success: true });
  }
}
