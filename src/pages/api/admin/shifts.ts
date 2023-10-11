import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";

export default async function designations(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const designations = await prisma.shifts.findMany();
    res.status(200).json(designations);
  } else if (req.method === "POST") {
    const data = req.body;

    const shifts = await prisma.shifts.create({
        data: data
    })

    res.status(200).json(shifts);
  } else if (req.method === "PUT") {
    const data = req.body;
    
    const shifts = await prisma.shifts.update({
        where: {
            id: data?.id
        },
        data: data
    })

    res.status(200).json(shifts);
  } else if (req.method === "DELETE") {
    const data = req.body;

    const shifts = await prisma.shifts.delete({
      where: {
        id: data?.id,
      },
    });

    res.status(200).json(shifts);
  }
}
