import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Stores(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { contractorid, month } = req.query;
    if(contractorid && month) {
      const store = await prisma.stores.findFirst({
        where: {
          contractorid: parseInt(contractorid as string),
          month: month as string,
        },
      });
      res.status(200).json(store);
      return;
    }
    const stores = await prisma.stores.findMany();
    res.status(200).json(stores);
  }
  if (req.method === "POST") {
    const { id } = req.body;
    const isExist = await prisma.stores.findUnique({
      where: {
        id: id ,
      },
    });
    if (isExist) {
      const store = await prisma.stores.update({
        where: {
          id: id ,
        },
        data: req.body,
      });
      res.status(200).json(store);
    } else {
      const store = await prisma.stores.create({
        data: req.body,
      });
      res.status(200).json(store);
    }
  }
}
