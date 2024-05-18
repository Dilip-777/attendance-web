import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { projectId, contractorid, description } = req.body;
    const qcs = await prisma.qcs.create({
      data: {
        projectId,
        contractorid,
        description,
      },
    });
    res.status(200).json(qcs);
  } else if (req.method === "PUT") {
    const { id, ...rest } = req.body;
    const qcs = await prisma.qcs.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
      },
    });
    res.status(200).json(qcs);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
