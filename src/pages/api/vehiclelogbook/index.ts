import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function vehiclelogbook(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { month, contractor } = req.query;

  const workorder = await prisma.workorder.findFirst({
    where: {
      startDate: {
        endsWith: month as string,
      },
      contractorId: contractor as string,
    },
  });

  if (req.method === 'GET') {
    const automobiles = await prisma.automobile.findMany({
      where: {
        contractorId: contractor as string,
        workorderId: workorder?.id,
        date: {
          endsWith: month as string,
        },
      },
    });
    const saveAutomobiles = await prisma.saveAutomobile.findMany({
      where: {
        contractorId: contractor as string,
        workorderId: workorder?.id,
        date: {
          endsWith: month as string,
        },
      },
    });
    res.status(200).json([...saveAutomobiles, ...automobiles]);
  } else if (req.method === 'POST') {
    const { changes, month, contractorId } = req.body;
    const workorder = await prisma.workorder.findFirst({
      where: {
        contractorId: contractorId?.toString(),
        startDate: {
          endsWith: month,
        },
      },
    });
    changes?.map(async (change: any) => {
      const isExist = await prisma.saveAutomobile.findFirst({
        where: {
          contractorId: change.contractorId,
          date: change.date,
          vehicleId: change.vehicleId,
        },
      });

      const { freeze, ...rest } = change;
      if (isExist) {
        await prisma.saveAutomobile.update({
          where: {
            id: isExist.id,
          },
          data: {
            ...rest,
            status: 'Pending',
            workoderId: workorder?.id,
          },
        });
      } else {
        await prisma.saveAutomobile.create({
          data: {
            ...rest,
            status: 'Pending',
            workorderId: workorder?.id,
          },
        });
      }
    });
    res.status(200).json({ success: true, message: 'Successfully Updated' });
  } else if (req.method === 'PUT') {
    const data = req.body;

    const workorder = await prisma.workorder.findFirst({
      where: {
        contractorId: data.contractorId,
        startDate: {
          endsWith: data.month,
        },
      },
    });

    console.log(data);

    const saveAutomobile = await prisma.saveAutomobile.findUnique({
      where: {
        id: data.id,
      },
    });

    const automobile = await prisma.automobile.findUnique({
      where: {
        id: saveAutomobile?.id,
      },
    });

    if (saveAutomobile) {
      await prisma.saveAutomobile.delete({
        where: {
          id: data.id,
        },
      });
      if (data.status === 'Rejected') {
        if (automobile) {
          await prisma.automobile.update({
            where: {
              id: automobile?.id,
            },
            data: {
              status: 'Rejected',
            },
          });
        }
      } else {
        if (automobile) {
          await prisma.automobile.update({
            where: {
              id: automobile?.id,
            },
            data: {
              ...data,
              workorderId: workorder?.id,
              status: data.status,
            },
          });
        } else {
          await prisma.automobile.create({
            data: {
              ...data,
              workorderId: workorder?.id,
            },
          });
        }
      }
    }

    res.status(200).json({ success: true });
  }
}
