import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // const { name, type, place,  } = req.body;
    const project = await prisma.project.create({
      data: req.body,
    });
    res.status(200).json(project);
  } else if (req.method === "PUT") {
    const { id, ...rest } = req.body;
    const project = await prisma.project.update({
      where: {
        id: id,
      },
      data: rest,
    });
    res.status(200).json(project);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
