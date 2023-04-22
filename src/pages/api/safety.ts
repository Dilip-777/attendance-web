import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Stores(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const safety = await prisma.safety.findMany();
    res.status(200).json(safety);
  }
  if (req.method === "POST") {
    const { id } = req.body;
    const isExist = await prisma.safety.findUnique({
      where: {
        id: id,
      },
    });
    if (isExist) {
      const safety = await prisma.safety.update({
        where: {
          id: id,
        },
        data: req.body,
      });
      res.status(200).json(safety);
    } else {
      const safety = await prisma.safety.create({
        data: req.body,
      });
      res.status(200).json(safety);
    }
  }
}
