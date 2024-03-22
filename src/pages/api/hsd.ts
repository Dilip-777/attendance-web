import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";

export default async function hsd(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { contractor } = req.query;
    const hsds = await prisma.hsd.findMany({
      where: {
        contractorId: contractor as string,
      },
    });
    res.status(200).json(hsds);
  } else if (req.method === "POST") {
    const { id, contractorId, ...data } = req.body;
    const isExist = await prisma.hsd.findFirst({
      where: {
        month: data.month,
        contractorId: contractorId,
      },
    });
    if (isExist && !id) {
      res.status(409).json({
        message: "Hsd entry for this month already exists",
        error: "month",
      });
      return;
    }
    if (id) {
      const hsd = await prisma.hsd.update({
        where: {
          id: id,
        },
        data: data,
      });
      res.status(200).json(hsd);
    } else {
      const contractor = await prisma.contractor.findUnique({
        where: {
          contractorId: contractorId,
        },
      });

      if (!contractor) {
        res
          .status(404)
          .json({ message: "Contractor not found", error: "contractorId" });
        return;
      }

      const hsd = await prisma.hsd.create({
        data: {
          id: shortid.generate(),
          contractorId: contractor.contractorId,
          ...data,
        },
      });
      res.status(200).json(hsd);
    }
  }
}
