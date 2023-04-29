import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === "PUT") {
    const {month,contractorname } = req.body;
    const timekeeper = await prisma.timeKeeper.updateMany({
        where: {
            contractorname: contractorname,
            attendancedate : {
                contains: month
            }
        }, 
        data: {
           approvedByTimekeeper: true
        }
    })
    
    res.status(200).json(timekeeper)
  }
}
