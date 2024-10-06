import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { contractorId, month } = req.query;
    if (contractorId && month) {
      const safety = await prisma.safety.findFirst({
        where: {
          contractorid: contractorId as string,
          month: month as string,
        },
      });
      const deductions = await prisma.deductions.findFirst({
        where: {
          contractorId: contractorId as string,
          month: month as string,
        },
      });
      const fixedvalues = await prisma.fixedValues.findFirst({
        where: {
          contractorId: contractorId as string,
          month: month as string,
        },
      });

      const finalCalculations = await prisma.finalCalculations.findFirst({
        where: {
          contractorId: contractorId as string,
          month: month as string,
        },
      });

      return res
        .status(200)
        .json({ safety, deductions, fixedvalues, finalCalculations });
    }

    const payments = await prisma.payments.findMany();
    res.status(200).json(payments);
  }
}
