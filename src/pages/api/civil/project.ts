import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, type, place, contractorId } = req.body;
    const project = await prisma.project.create({
      data: {
        name,
        type,
        place,
        contractorId,
      },
    });
    res.status(200).json(project);
  } else if (req.method === "PUT") {
    const { id, name, type, place, contractorId } = req.body;
    const project = await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        name,
        type,
        place,
        contractorId,
      },
    });
    res.status(200).json(project);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
