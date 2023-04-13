import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function test (req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        res.status(200).json(process.env.DATABASE_URL)
    }
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
