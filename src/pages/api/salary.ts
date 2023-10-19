import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function salary(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { contractorId, designationId } = req.query;
    if (contractorId && designationId) {
      const seperateSalary = await prisma.seperateSalary.findFirst({
        where: {
          contractorId: contractorId as string,
          designationId: designationId as string,
        },
      });

      res.status(200).json(seperateSalary);
      return;
    }
  } else if (req.method === 'POST') {
    const { contractorId, designationId, salary } = req.body;
    const isExist = await prisma.seperateSalary.findFirst({
      where: {
        contractorId: contractorId,
        designationId: designationId,
      },
    });
    if (isExist) {
      await prisma.seperateSalary.update({
        where: {
          id: isExist.id,
        },
        data: {
          salary: salary,
        },
      });
      res.status(200).json({ message: 'Salary updated successfully' });
      return;
    } else {
      await prisma.seperateSalary.create({
        data: {
          contractorId: contractorId,
          designationId: designationId,
          salary: salary,
        },
      });
      res.status(200).json({ message: 'Salary created successfully' });
      return;
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
