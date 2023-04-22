import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function gettimekeeper (req: NextApiRequest, res: NextApiResponse) {
    const { month, contractor , department } = req.query
    
    const timekeepers = await prisma.timeKeeper.findMany({
        where: {
            attendancedate: {
                contains: month as string
            },
            contractorid: contractor as string,
            department: department as string,
            attendance: "1",
            approvedByTimekeeper: true
            
        }
    })
    res.status(200).json(timekeepers)
            
}