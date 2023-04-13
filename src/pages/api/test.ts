import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function test (req: NextApiRequest, res: NextApiResponse) {
    const data = req.body
    // console.log(data);
    

    // const timekeepers = await prisma.timeKeeper.createMany({
    //     data: data,
    //     skipDuplicates: true    
    // })
    const timekeepers = await prisma.timeKeeper.createMany({
        data: data,
        skipDuplicates: true
    })

    res.status(200).json({ success: true })
}
