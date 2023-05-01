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
    const {  storeItems, ...rest } = req.body;
      const store = await prisma.stores.create({
        data: {
          ...rest,
        },
      });
         
      const storeItemsData = await prisma.storeItem.createMany({
        data: storeItems,
        skipDuplicates: true,
      });

      res.status(200).json({  success: true });
    
  }
  else if(req.method === "DELETE") {
    const { id } = req.body;
    const store = await prisma.stores.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(store);
  }
}
