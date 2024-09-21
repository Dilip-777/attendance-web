import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { contractorId, month, months } = req.query;

    if (!contractorId && month) {
      const fixedValues = await prisma.fixedValues.findMany({
        where: {
          month: month as string,
        },
        include: {
          designations: true,
        },
      });

      res.status(200).json(fixedValues);
      return;
    }
    if (!contractorId && !month) {
      const fixedValues = await prisma.fixedValues.findMany({
        where: {
          month: {
            in: (months as string)?.split(",") || [],
          },
        },
      });
      res.status(200).json(fixedValues);
      return;
    }
    const fixedValues = await prisma.fixedValues.findFirst({
      where: {
        contractorId: contractorId as string,
        month: month as string,
      },
      include: {
        designations: true,
      },
    });
    res.status(200).json(fixedValues);
  } else if (req.method === "POST") {
    const {
      contractorId,
      month,
      mandays,
      gst,
      tds,
      servicecharges,
      othrs,
      mandaysamount,
      basicamount,
      total,
      billamount,
      designations,
      fixedvaluesTrack,
      ...rest
    } = req.body;
    const mandays1 = fixedvaluesTrack.reduce((acc: any, curr: any) => {
      return acc + curr.mandays;
    }, 0);
    const amount = fixedvaluesTrack.reduce((acc: any, curr: any) => {
      return acc + curr.amount;
    }, 0);
    const isExist = await prisma.fixedValues.findUnique({
      where: {
        month_contractorId: {
          month: month as string,
          contractorId: contractorId as string,
        },
      },
    });

    const contractor = await prisma.contractor.findUnique({
      where: {
        contractorId: contractorId as string,
      },
    });

    if (isExist) {
      await prisma.fixedDesignations.deleteMany({
        where: {
          fixedValuesId: isExist.id,
        },
      });
      await prisma.fixedValues.update({
        where: {
          id: isExist.id,
        },
        data: {
          designations: {
            createMany: {
              data: designations,
              skipDuplicates: true,
            },
          },
          ...rest,
        },
      });
      res.status(200).json({ message: "Fixed values updated" });
    } else {
      await prisma.fixedValues.create({
        data: {
          contractorId,
          month,
          mandays: mandays1,
          serviceDetail: contractor?.servicedetail || "",
          areaOfWork: contractor?.areaofwork || "",
          cost: Math.round(amount),
          gst: Math.round(gst || 0),
          tds: Math.round(tds || 0),
          servicecharges: Math.round(servicecharges || 0),
          othrs: Math.round(othrs),
          mandaysamount: Math.round(mandaysamount),
          basicamount: Math.round(basicamount),
          billamount: Math.round(billamount),
          gstValue: contractor?.gst || 0,
          tdsValue: contractor?.tds || 0,
          servicechargeRate: contractor?.servicecharge || 0,

          designations: {
            createMany: {
              data: designations,
              skipDuplicates: true,
            },
          },

          departments: {
            createMany: {
              data: fixedvaluesTrack,
              skipDuplicates: true,
            },
          },

          ...rest,
        },
      });
      res.status(200).json({ message: "Fixed values created" });
    }
  } else if (req.method === "DELETE") {
    const { contractorId, month } = req.query;
    await prisma.fixedValues.deleteMany({
      where: {
        contractorId: contractorId as string,
        month: month as string,
      },
    });

    res.status(200).json({ message: "Fixed values deleted" });
  }
}
