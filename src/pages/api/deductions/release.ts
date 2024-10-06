import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { contractorId, date } = req.query;
    if (!contractorId && !date) {
      const deductions = await prisma.gstRelease.findMany({
        include: {
          contractor: true,
        },
      });
      res.status(200).json(deductions);
      return;
    }
    const deduction = await prisma.gstRelease.findFirst({
      where: {
        contractorId: contractorId as string,
        month: date as string,
      },
    });
    res.status(200).json(deduction);
  } else if (req.method === 'POST') {
    const { contractorId, month, ...rest } = req.body;
    const isExist = await prisma.gstRelease.findFirst({
      where: {
        contractorId,
        month,
      },
    });
    const isExistContractor = await prisma.contractor.findUnique({
      where: {
        contractorId: contractorId,
      },
    });
    if (isExist) {
      const deduction = await prisma.gstRelease.update({
        where: {
          id: isExist.id,
        },
        data: {
          contractorName: isExistContractor?.contractorname,
          ...rest,
        },
      });
      res.status(200).json(deduction);
    } else {
      const deduction = await prisma.gstRelease.create({
        data: {
          contractorId,
          month,
          contractorName: isExistContractor?.contractorname,
          ...rest,
        },
      });
      res.status(200).json(deduction);
    }
  }
}
