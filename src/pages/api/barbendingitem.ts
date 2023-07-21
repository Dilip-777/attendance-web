import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function barbending(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "GET") {
        const { contractorid: id} = req.query
        if(id) {
            const barBending = await prisma.barBending.findMany({
                where: {
                    contractorid: id as string
                },
                include: {
                    contractor: true,
                    barbendingItems: true
                }
            })
            res.status(200).json(barBending)
            return
        }
        const barBending = await prisma.barBending.findMany({
            include: {
                contractor: true,
                barbendingItems: true
            }
        })
        res.status(200).json(barBending)
    }

    if(req.method === "POST") {
        const { barBendingItem, totalAmount } = req.body

        const barBendingItem1 = await prisma.barBendingItem.create({
            data: {
                ...barBendingItem
            }, include: {
                barBending: true
            }
        })

        const barBending = await prisma.barBending.update({
            where: {
                id: barBendingItem1.barBendingId
            },
            data: {
                totalAmount: barBendingItem1.barBending.totalAmount + totalAmount,
            }
        })

        res.status(200).json(barBending)
    }

    if(req.method === "PUT") {
        const { barBendingItem, totalAmount } = req.body

       const barBendingItem1 =  await prisma.barBendingItem.update({
            where: {
                id: barBendingItem.id
            },
            data: {
                ...barBendingItem
            }, 
            include: {
                barBending: true
            }
        })
        
        const barBending = await prisma.barBending.update({
            where: {
                id: barBendingItem1.barBendingId
            },
            data: {
                totalAmount: barBendingItem1.barBending.totalAmount + totalAmount,
            }
        })


        res.status(200).json({success: true})
    }

    else if(req.method === "DELETE") {
        const { id } = req.body

        await prisma.barBendingItem.delete({
            where: {
                id: id
            }
        })

        res.status(200).json({success: true})
    }
}