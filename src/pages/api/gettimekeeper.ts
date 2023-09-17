import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function gettimekeeper (req: NextApiRequest, res: NextApiResponse) {
    const { month, contractor , department } = req.query

    // await prisma.timeKeeper.deleteMany()

    if(!contractor) {
        const timekeepers = await prisma.timeKeeper.findMany({
            where: {
                attendancedate: {
                    endsWith: month as string
                },
                attendance: {
                    not: "0"
                },
                approvedByTimekeeper: true
            }
        })
        res.status(200).json(timekeepers)
        return
    }

    // const departments = (department as string)?.split(",")

    // console.log(departments, "departments");
    
    
    
    const timekeepers = await prisma.timeKeeper.findMany({
        where: {
            attendancedate: {
                endsWith: month as string
            },
            contractorid: contractor as string,
            // department: {
            //     in: departments
            // },
            attendance: {
                not: "0"
                },
            approvedByTimekeeper: true
            
        }
    })
    
    res.status(200).json(timekeepers)
            
}