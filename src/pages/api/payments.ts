import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { contractorId, month } = req.query;
    if (contractorId && month) {
      const payments = await prisma.payments.findFirst({
        where: {
          contractorId: contractorId as string,
          month: month as string,
        },
      });
      res.status(200).json(payments);
      return;
    }
    const payments = await prisma.payments.findMany();
    res.status(200).json(payments);
  } else if (req.method === 'POST') {
    const data = req.body;
    const payment = await prisma.payments.create({
      data,
    });
    res.status(200).json(payment);
  } else if (req.method === 'PUT') {
    const { id, ...data } = req.body;
    const payment = await prisma.payments.update({
      where: {
        id: id as string,
      },
      data,
    });
    res.status(200).json(payment);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Id is required' });
    }
    const payment = await prisma.payments.delete({
      where: {
        id: id as string,
      },
    });
    res.status(200).json({ message: 'Payment deleted' });
  }
}
