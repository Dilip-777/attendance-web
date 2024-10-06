import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { month } = req.query;
    const contractors = await prisma.contractor.findMany({
      where: {
        servicedetail: {
          notIn: ['Civil', 'Fixed', 'Equipment / Vehicle Hiring'],
        },
      },
      include: {
        fixedValues: {
          where: {
            month: month as string,
          },
          include: {
            designations: true,
          },
        },
      },
    });
  }
}
