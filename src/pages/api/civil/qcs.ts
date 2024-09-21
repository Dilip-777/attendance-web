import prisma from "@/lib/prisma";
import { BOQItem } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { projectId, contractorid, description, boqs } = req.body;
    const isExist = await prisma.qcs.findFirst({
      where: {
        projectId,
        contractorid,
      },
    });
    let qcs: any;
    if (isExist) {
      qcs = await prisma.qcs.update({
        where: {
          id: isExist.id,
        },
        data: {
          description,
        },
      });
    } else
      qcs = await prisma.qcs.create({
        data: {
          projectId,
          contractorid,
          description,
        },
      });

    if (isExist) {
      await prisma.qcsBoqItem.deleteMany({
        where: {
          BOQ: {
            qcsId: qcs.id,
          },
        },
      });
      await prisma.qcsBoq.deleteMany({
        where: {
          qcsId: qcs.id,
        },
      });
    }

    await Promise.all(
      boqs.map(async (boq: any) => {
        await prisma.qcsBoq.create({
          data: {
            qcsId: qcs.id,
            startDate: boq.startDate,
            endDate: boq.endDate,
            boqId: boq.id,
            description: boq.description,
            totalQuantity: boq.totalQuantity,
            totalAmount: boq.totalAmount,
            // itemcode: boq.itemcode,
            BOQItems: {
              createMany: {
                data: boq.BOQItems.map((boqItem: BOQItem) => {
                  const { boqId, id, ...rest } = boqItem;
                  return rest;
                }),
              },
            },
          },
        });
      })
    );

    res.status(200).json(qcs);
  } else if (req.method === "PUT") {
    const { id, boqs, ...rest } = req.body;
    const qcs = await prisma.qcs.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
      },
    });

    await Promise.all(
      await boqs.map(async (boq: any) => {
        await Promise.all(
          await boq.BOQItems.map(async (boqItem: any) => {
            await prisma.qcsBoqItem.update({
              where: {
                id: boqItem.id,
              },
              data: {
                ...boqItem,
              },
            });
          })
        );
      })
    );
    res.status(200).json(qcs);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
