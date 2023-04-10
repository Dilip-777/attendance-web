import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function test (req: NextApiRequest, res: NextApiResponse) {
    const data = req.body

    // const timekeepers = await prisma.timeKeeper.updateMany({
    //     where: {},
    //     data: {
    //         machineInTime: "8:00",
    //         machineOutTime: "17:00",
    //     }
    // })
    const timekeepers = await prisma.timeKeeper.updateMany({
        where: {
           employeeid: { in: ["4100011", "4100012","4100013", "4100014",] }
        },
        data: {
            department: "LRF",
            designation: ""
        }
    })

    res.status(200).json({ success: true })
}
