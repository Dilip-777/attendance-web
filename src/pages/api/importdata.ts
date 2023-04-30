import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function test (req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        res.status(200).json(process.env.DATABASE_URL)
    }
    const data = req.body
    const { type } = req.query
    if(type === "employee") {
       const employees = await prisma.employee.createMany({
            data: data,
            skipDuplicates: true
       }) 
       res.status(200).json({ success: true })
    }

    else if(type === "contractor") {
        await prisma.employee.deleteMany()
        const contractors = await prisma.contractor.createMany({
            data: data,
            skipDuplicates: true
        })
        res.status(200).json({ success: true })
    }
    else {

        const timekeepers = await prisma.timeKeeper.createMany({
            data: data,
            skipDuplicates: true
        })
        // const timeKeeper = await prisma.timeKeeper.create({
        //    data: data[0]
        // })
        
        res.status(200).json({ success: true })
    }
}
