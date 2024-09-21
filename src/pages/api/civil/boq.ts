import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function bOQ(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { contractorid: id } = req.query;
    if (id) {
      const bOQ = await prisma.bOQ.findMany({
        include: {
          BOQItems: true,
        },
      });
      res.status(200).json(bOQ);
      return;
    }
    const bOQ = await prisma.bOQ.findMany({
      include: {
        BOQItems: true,
      },
    });
    res.status(200).json(bOQ);
  }

  if (req.method === "POST") {
    const { BOQItems, ...rest } = req.body;

    const totalQuantity = BOQItems.reduce((acc: any, item: any) => {
      return acc + item.quantity;
    }, 0);

    const work = await prisma.bOQ.create({
      data: {
        ...rest,
        totalQuantity,
        BOQItems: {
          createMany: {
            data: BOQItems,
          },
        },
      },
    });

    res.status(200).json(work);
  }

  if (req.method === "PUT") {
    const { BOQItems, ...rest } = req.body;

    await Promise.all(
      BOQItems.map(async (item: any) => {
        const isExist = await prisma.bOQItem.findUnique({
          where: {
            id: item.id || "",
          },
        });
        console.log(item);

        if (isExist) {
          await prisma.bOQItem.update({
            where: {
              id: item.id,
            },
            data: {
              ...item,
            },
          });
        } else {
          await prisma.bOQItem.create({
            data: {
              // ...item,
              boqId: rest.id,
              description: item.description,
              quantity: item.quantity,
              unitrate: item.unitrate,
              unit: item.unit,
              breadth: item.breadth,
              height: item.height,
              length: item.length,
              nos: item.nos,
              remarks: item.remarks,
            },
          });
        }
      })
    );

    // await prisma.measurementItem.deleteMany({
    //   where: {
    //     measurementId: rest.id,
    //   },
    // });

    const totalQuantity = BOQItems.reduce((acc: any, item: any) => {
      return acc + item.quantity;
    }, 0);

    const work = await prisma.bOQ.update({
      where: {
        id: rest.id,
      },
      data: {
        ...rest,
        totalQuantity: parseFloat(totalQuantity.toFixed(3)),
        // BOQItems: {
        //   createMany: {
        //     data: BOQItems,
        //   },
        // },
      },
    });

    res.status(200).json({ success: true });
  }
}
