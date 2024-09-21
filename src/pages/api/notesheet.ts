import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { contractorId, month } = req.query;
    if (!contractorId || !month) {
      return res
        .status(400)
        .json({ message: 'Contractor ID and Month are required' });
    }
    const fixedData = await prisma.fixedValues.findUnique({
      where: {
        month_contractorId: {
          contractorId: contractorId as string,
          month: month as string,
        },
      },
    });

    console.log(month);

    const hoCommercial = await prisma.hOAuditor.findFirst({
      where: {
        contractorId: contractorId as string,
        monthOfInvoice: {
          endsWith: month as string,
        },
      },
      include: {
        debitNotes: true,
        otherAdditions: true,
        otherDeductions: true,
      },
    });
    res.status(200).json({ fixedData, hoCommercial });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
