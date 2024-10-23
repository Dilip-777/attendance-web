import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function hoauditor(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { contractorId, month } = req.query;
    if (contractorId) {
      if (month) {
        const ho = await prisma.hOAuditor.findFirst({
          where: {
            contractorId: contractorId as string,
            monthOfInvoice: {
              contains: month as string,
            },
          },
        });
        res.json(ho);
      } else {
        const ho = await prisma.hOAuditor.findFirst({
          where: {
            contractorId: contractorId as string,
          },
        });
        res.json(ho);
      }
    } else if (month) {
      const ho = await prisma.hOAuditor.findMany({
        where: {
          monthOfInvoice: {
            contains: month as string,
          },
        },
      });
      res.json(ho);
    } else {
      const ho = await prisma.hOAuditor.findFirst({
        where: {
          contractorId: contractorId as string,
        },
      });
      res.json(ho);
    }
  } else if (req.method === 'POST') {
    const { debitNotes, otherDeductions, otherAdditions, ...body } = req.body;

    const ho = await prisma.hOAuditor.create({
      data: {
        ...body,
        debitNotes: {
          createMany: {
            data: debitNotes,
          },
        },
        otherDeductions: {
          createMany: {
            data: otherDeductions,
          },
        },
        otherAdditions: {
          createMany: {
            data: otherAdditions,
          },
        },
        uploadDoc1: body.uploadDoc1 || null,
        uploadDoc2: body.uploadDoc2 || null,
        uploadDoc3: body.uploadDoc3 || null,
        uploadDoc4: body.uploadDoc4 || null,
        uploadDoc5: body.uploadDoc5 || null,
        uploadDoc6: body.uploadDoc6 || null,
      },
    });
    res.status(200).json(ho);
  } else if (req.method === 'PUT') {
    const { id, debitNotes, otherDeductions, otherAdditions, ...body } =
      req.body;

    await prisma.debitNote.deleteMany({
      where: {
        hoAuditorId: id,
      },
    });

    await prisma.otherDeduction.deleteMany({
      where: {
        hoAuditorId: id,
      },
    });

    await prisma.otherAddition.deleteMany({
      where: {
        hoAuditorId: id,
      },
    });

    const ho = await prisma.hOAuditor.update({
      where: {
        id: id,
      },
      data: {
        ...body,
        debitNotes: {
          createMany: {
            data: debitNotes,
          },
        },
        otherDeductions: {
          createMany: {
            data: otherDeductions,
          },
        },
        otherAdditions: {
          createMany: {
            data: otherAdditions,
          },
        },
        uploadDoc1: body.uploadDoc1 || null,
        uploadDoc2: body.uploadDoc2 || null,
        uploadDoc3: body.uploadDoc3 || null,
        uploadDoc4: body.uploadDoc4 || null,
        uploadDoc5: body.uploadDoc5 || null,
        uploadDoc6: body.uploadDoc6 || null,
      },
    });
    res.status(200).json(ho);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const ho = await prisma.hOAuditor.delete({
      where: {
        id: id as string,
      },
    });
    if (!ho) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ message: 'Success' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
