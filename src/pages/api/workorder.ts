import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";

export default async function workorder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { contractorId, month } = req.query;
    let where = {};
    if (contractorId && contractorId !== "undefined") {
      where = {
        contractorId: contractorId,
      };
    }
    const workorders = await prisma.workorder.findMany({
      where,
    });
    res.status(200).json(workorders);
  } else if (req.method === "POST") {
    const { contractorId, ...rest } = req.body;
    const contractor = await prisma.contractor.findUnique({
      where: {
        contractorId: contractorId,
      },
    });
    if (!contractor) {
      res.status(400).json({ message: "Contractor not found" });
      return;
    }
    const body = {
      id: shortid.generate(),
      contractorId: contractor?.contractorId.toString(),
      contractorName: contractor?.contractorname,
      ...rest,
      amendmentDocument: rest.amendmentDocument || null,
      addendumDocument: rest.addendumDocument || null,
      uploadDocument: rest.uploadDocument || null,
    };
    const workorder = await prisma.workorder.create({
      data: body,
    });
    res.status(200).json(workorder);
  } else if (req.method === "PUT") {
    const { id, contractorId, ...rest } = req.body;
    const contractor = await prisma.contractor.findUnique({
      where: {
        contractorId: contractorId,
      },
    });
    if (!contractor) {
      res.status(400).json({ message: "Contractor not found" });
      return;
    }
    const body = {
      id: id,
      contractorId: contractor?.contractorId.toString(),
      contractorName: contractor?.contractorname,
      ...rest,
      amendmentDocument: rest.amendmentDocument || null,
      addendumDocument: rest.addendumDocument || null,
      uploadDocument: rest.uploadDocument || null,
    };
    const workorder = await prisma.workorder.update({
      where: {
        id: id,
      },
      data: body,
    });
    res.status(200).json(workorder);
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    const workorder = await prisma.workorder.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(workorder);
  }
}
