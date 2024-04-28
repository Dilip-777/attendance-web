import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Shifts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, code } = req.body;

    const isExist = await prisma.shift.findFirst({
      where: {
        OR: [
          {
            name,
          },
          {
            code,
          },
        ],
      },
    });

    if (isExist) {
      return res.status(400).json({ message: "Shift already exists" });
    }

    await prisma.shift.create({
      data: {
        name,
        code,
      },
    });

    res.status(200).json({ message: "Shift created successfully" });
  } else if (req.method === "PUT") {
    const { id, name, code } = req.body;
    await prisma.shift.update({
      where: {
        id,
      },
      data: {
        name,
        code,
      },
    });
    res.status(200).json({ message: "Shift updated successfully" });
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    await prisma.shift.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Shift deleted successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
