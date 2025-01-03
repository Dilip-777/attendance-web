

import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { boqId, status } = req.body;    

    await prisma.bOQ.update({
        where: {
            id: boqId,
        },
        data: {
            status: status,
        }
    })
    res.status(200).json({ message: "BOQ Approved" });
  }  else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
