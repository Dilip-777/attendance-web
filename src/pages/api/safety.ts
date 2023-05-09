import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Stores(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { contractorid, month } = req.query;
    if(contractorid && month) {
      const safety = await prisma.safety.findFirst({
        where: {
          contractorid: contractorid as string,
          month: month as string,
        },
      });
      res.status(200).json(safety);
      return;
    }
    const safety = await prisma.safety.findMany();
    res.status(200).json(safety);
  }
  if (req.method === "POST") {
    const { id, safetyItems, ...data } = req.body;
    const isExist = await prisma.safety.findUnique({
      where: {
        id: id,
      },
    });
    if (isExist) {

      const safety = await prisma.safety.update({
        where: {
          id: id,
        },
        data: {
          id: id,
          ...data,
        },
      });
      res.status(200).json(safety);
    } else {
      const safety = await prisma.safety.create({
        data: {
          id: id,
          ...data,
        },
      });

      const safetyItemsData = await prisma.safetyItem.createMany({
        data: safetyItems,
        skipDuplicates: true,
      });

      res.status(200).json(safety);
    }
  }
  else if(req.method === "DELETE") {
    const { id } = req.body;
    const safety = await prisma.safety.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(safety);
  }
}
