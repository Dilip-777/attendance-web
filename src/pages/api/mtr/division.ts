import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { months } = req.query;

    const divisions = await prisma.department.findMany({
      where: {
        department: {
          not: 'testing',
        },
      },
      include: {
        fixedDepartments: {
          where: {
            fixedValues: {
              month: {
                in: months?.toString().split(',') || [],
              },
            },
          },
          include: {
            fixedValues: true,
          },
        },
      },
    });

    res.status(200).json({ divisions });
  }
}
