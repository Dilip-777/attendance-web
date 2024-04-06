import prisma from "@/lib/prisma";
import _ from "lodash";
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
    const { month, contractorId, description, status } = req.body;

    if (!contractorId || !month) {
      return res
        .status(400)
        .json({ error: "contractorId and month are required" });
    }

    const saveHiredFixedWork = await prisma.saveHiredFixedWork.findFirst({
      where: {
        contractorid: contractorId,
        month: month,
        description: description,
      },
    });

    if (!saveHiredFixedWork) {
      return res.status(400).json({ error: "No fixed work found" });
    }

    const fixedwork = await prisma.hiredFixedWork.findFirst({
      where: {
        contractorid: contractorId,
        month: month,
        description: description,
      },
    });

    if (!fixedwork && status === "Approved") {
      await prisma.hiredFixedWork.create({
        data: {
          contractorid: saveHiredFixedWork.contractorid,
          month: saveHiredFixedWork.month,
          description: saveHiredFixedWork.description,
          rate: saveHiredFixedWork.rate,
          quantity: saveHiredFixedWork.quantity,
          totalAmount: saveHiredFixedWork.totalAmount,
          status: status,
        },
      });
    } else if (fixedwork && status === "Approved") {
      await prisma.hiredFixedWork.update({
        where: {
          id: fixedwork.id,
        },
        data: {
          contractorid: saveHiredFixedWork.contractorid,
          month: saveHiredFixedWork.month,
          description: saveHiredFixedWork.description,
          rate: saveHiredFixedWork.rate,
          quantity: saveHiredFixedWork.quantity,
          totalAmount: saveHiredFixedWork.totalAmount,
          status: status,
        },
      });
    } else if (status === "Rejected") {
      await prisma.saveHiredFixedWork.delete({
        where: {
          id: saveHiredFixedWork.id,
        },
      });
      if (fixedwork) {
        await prisma.hiredFixedWork.update({
          where: {
            id: fixedwork.id,
          },
          data: {
            status: status,
          },
        });
      }
    }

    await prisma.saveHiredFixedWork.delete({
      where: {
        id: saveHiredFixedWork.id,
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
