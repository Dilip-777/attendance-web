import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { months } = req.query;

    const functions = await prisma.department.findMany({
      where: {
        department: {
          not: 'testing',
        },
      },
      include: {
        contractors: {
          include: {
            fixedValues: {
              where: {
                month: {
                  in: months?.toString().split(',') || [],
                },
              },
              include: {
                departments: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ functions });
  }
}
