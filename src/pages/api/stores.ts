import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function Stores(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { contractorid, month } = req.query;
    console.log('contractorid', contractorid, month, 'month');
    if (contractorid && month) {
      const store = await prisma.stores.findFirst({
        where: {
          contractorid: contractorid as string,
          month: month as string,
        },
      });

      res.status(200).json(store);
      return;
    }
    const stores = await prisma.stores.findMany();
    res.status(200).json(stores);
  }
  if (req.method === 'POST') {
    const { storeItems, ...rest } = req.body;
    const isExist = await prisma.stores.findUnique({
      where: {
        id: rest.id,
      },
    });
    if (isExist) {
      await prisma.storeItem.deleteMany({
        where: {
          storeId: isExist.id,
        },
      });
      await prisma.stores.update({
        where: {
          id: isExist.id,
        },
        data: {
          storeItems: {
            createMany: {
              data: storeItems,
              skipDuplicates: true,
            },
          },
          ...rest,
        },
      });
    } else {
      await prisma.stores.create({
        data: {
          storeItems: {
            createMany: {
              data: storeItems,
              skipDuplicates: true,
            },
          },
          ...rest,
        },
      });
    }
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const store = await prisma.stores.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(store);
  }
}
