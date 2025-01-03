import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function Stores(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { contractorid, month } = req.query;
    let where: any = {};
    if (contractorid && contractorid !== 'undefined') {
      where.contractorid = contractorid as string;
    }
    if (month) {
      where.month = month as string;
    }
    const safety = await prisma.safety.findMany({
      where: where,
      include: {
        safetyItems: true,
        unsafeActs: true,
      },
    });
    res.status(200).json(safety);
  }
  if (req.method === 'POST') {
    const { id, safetyItems, unsafeActs, ...data } = req.body;
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
      await prisma.safetyItem.deleteMany({
        where: {
          safetyId: id,
        },
      });
      await prisma.unsafeActs.deleteMany({
        where: {
          safetyId: id,
        },
      });
      await prisma.safetyItem.createMany({
        data: safetyItems,
        skipDuplicates: true,
      });

      await prisma.unsafeActs.createMany({
        data: unsafeActs,
        skipDuplicates: true,
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

      const unsafeActsData = await prisma.unsafeActs.createMany({
        data: unsafeActs,
        skipDuplicates: true,
      });

      res.status(200).json(safety);
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const safety = await prisma.safety.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(safety);
  }
}
