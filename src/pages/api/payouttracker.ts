import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function payouttracker(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
         const data = req.body 

         const isexist = await prisma.payoutTracker.findFirst({
            where : {
                contractorId: data.contractorId,
                month: data.month,
            }
         })

            if(isexist) {
                res.status(200).json({message: "Already Exist"})
                return
            }

         const payouttracker = await prisma.payoutTracker.create({
            data: data
         })

        res.status(200).json(payouttracker)
    }

    if(req.method === "PUT") {
        const {id, ...data} = req.body

        const payouttracker = await prisma.payoutTracker.update({
            where: {
                id: id
            },
            data: data
        })

        res.status(200).json(payouttracker)
    }
}