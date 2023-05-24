import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function bills (req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        const { month } = req.query
        const bills = await prisma.bills.findMany({
            where: {
                month: month as string
            }
        })
        res.status(200).json(bills)
    }
    else if(req.method === "POST") {
        const data = req.body
        const isExist = await prisma.bills.findFirst({
            where: {
                month: data.month,
                contractorId: data.contractorId
            }
        })
        if(isExist) {
            await prisma.bills.update({
                where: {
                    id: isExist.id
                },
                data: data
            })
            res.status(200).json({message: "Updated"})
            return;
        }
        const bill = await prisma.bills.create({
            data
        })
        res.status(200).json(bill)
    }
}