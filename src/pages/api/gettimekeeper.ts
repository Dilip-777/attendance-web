import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function gettimekeeper (req: NextApiRequest, res: NextApiResponse) {
    const { month, contractor , department } = req.query

    if(!contractor) {
        const timekeepers = await prisma.timeKeeper.findMany({
            where: {
                attendancedate: {
                    endsWith: month as string
                },
                attendance: "1",
                approvedByTimekeeper: true
            }
        })
        res.status(200).json(timekeepers)
        return
    }
    
    const timekeepers = await prisma.timeKeeper.findMany({
        where: {
            attendancedate: {
                endsWith: month as string
            },
            contractorid: contractor as string,
            department: department as string,
            attendance: "1",
            approvedByTimekeeper: true
            
        }
    })
    res.status(200).json(timekeepers)
            
}