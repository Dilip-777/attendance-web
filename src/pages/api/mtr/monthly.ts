import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { months } = req.query;

    const contractors = await prisma.contractor.findMany({
      include: {
        fixedValues: {
          where: {
            month: {
              in: (months as string)?.split(',') || [],
            },
          },
        },
        safety: {
          where: {
            month: {
              in: (months as string)?.split(',') || [],
            },
          },
        },
        stores: {
          where: {
            month: {
              in: (months as string)?.split(',') || [],
            },
          },
        },

        deductions: {
          where: {
            month: {
              in: (months as string)?.split(',') || [],
            },
          },
        },
      },
    });
    res.status(200).json({ contractors });
  }
}
