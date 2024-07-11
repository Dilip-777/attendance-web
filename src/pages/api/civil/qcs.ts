import prisma from "@/lib/prisma";
import { BOQItem } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { projectId, contractorid, description, boqs } = req.body;
    const qcs = await prisma.qcs.create({
      data: {
        projectId,
        contractorid,
        description,
      },
    });

    // await Promise.all(
    //   boqs.map(async (boq: any) => {
    //     await Promise.all(
    //       boq.BOQItems.map(async (boqItem: any) => {
    //         // await prisma.bOQItem.update({
    //         //   where: {
    //         //     id: boqItem.id,
    //         //   },
    //         //   data: {
    //         //     ...boqItem,
    //         //   },
    //         // });
    //         await prisma.qcsBoqItem.create({
    //           data: {
    //             qcsId: qcs.id,
    //             boqItemId: boqItem.id,
    //           }
    //         })
    //       })
    //     );
    //   })
    // );

    await Promise.all(
      boqs.map(async (boq: any) => {
        await prisma.qcsBoq.create({
          data: {
            qcsId: qcs.id,

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
      boqs.map(async (boq: any) => {
        await Promise.all(
          boq.BOQItems.map(async (boqItem: any) => {
            await prisma.bOQItem.update({
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
