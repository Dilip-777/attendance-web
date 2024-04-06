import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function works(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { contractorid: id } = req.query;
    if (id) {
      const works = await prisma.works.findMany({
        where: {
          contractorid: id as string,
        },
        include: {
          contractor: true,
          workItems: true,
        },
      });
      res.status(200).json(works);
      return;
    }
    const works = await prisma.works.findMany({
      include: {
        contractor: true,
        workItems: true,
      },
    });
    res.status(200).json(works);
  }

  if (req.method === "POST") {
    const {
      contractorId,
      deployment,
      minManpower,
      minHeadcount,
      workorderhighlights,
      fixedworks,
    } = req.body;
    if (contractorId)
      await prisma.fixedWork.deleteMany({
        where: {
          contractorid: contractorId,
        },
      });

    await prisma.contractor.update({
      where: {
        contractorId: contractorId,
      },
      data: {
        deployment,
        minManpower,
        minHeadcount,
        workorderhighlights,
        fixedworks: {
          createMany: {
            data: fixedworks,
          },
        },
      },
    });

    res.status(200).json({ success: true });
  }

  if (req.method === "PUT") {
    const { contractorId, month, fixedworks } = req.body;
    if (!contractorId || !month) {
      return res
        .status(400)
        .json({ error: "contractorId and month are required" });
    }
    // await prisma.hiredFixedWork.deleteMany({
    //   where: {
    //     contractorid: contractorId,
    //     month: month,
    //   },
    // });

    await Promise.all(
      await fixedworks.map(async (work: any) => {
        const saveHiredFixedWork = await prisma.saveHiredFixedWork.findFirst({
          where: {
            contractorid: contractorId,
            month: month,
            description: work.description,
          },
        });
        if (saveHiredFixedWork) {
          await prisma.hiredFixedWork.update({
            where: {
              id: saveHiredFixedWork.id,
            },
            data: {
              contractorid: contractorId,
              month: month,
              description: work.description,
              rate: work.rate,
              quantity: work.quantity,
              totalAmount: work.totalAmount,
            },
          });
        }
      })
    );

    await prisma.saveHiredFixedWork.createMany({
      data: fixedworks.map((work: any) => ({
        contractorid: contractorId,
        month: month,
        description: work.description,
        rate: work.rate,
        quantity: work.quantity,
        totalAmount: work.totalAmount,
        status: "Pending",
      })),
    });

    res.status(200).json({ success: true });
  }
}
