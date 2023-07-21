import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function works(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "GET") {
        const { contractorid: id} = req.query
        if(id) {
            const works = await prisma.works.findMany({
                where: {
                    contractorid: id as string
                },
                include: {
                    contractor: true,
                    workItems: true
                }
            })
            res.status(200).json(works)
            return
        }
        const works = await prisma.works.findMany({
            include: {
                contractor: true,
                workItems: true
            }
        })
        res.status(200).json(works)
    }

    if(req.method === "POST") {
        const { workItem, totalAmount } = req.body

        const workItem1 = await prisma.workItem.create({
            data: {
                ...workItem
            }, include: {
                work: true
            }
        })

        const work = await prisma.works.update({
            where: {
                id: workItem1.workId
            },
            data: {
                totalAmount: workItem1.work.totalAmount + totalAmount,
            }
        })

        res.status(200).json(work)
    }

    if(req.method === "PUT") {
        const { workItem, totalAmount } = req.body

       const workItem1 =  await prisma.workItem.update({
            where: {
                id: workItem.id
            },
            data: {
                ...workItem
            }, 
            include: {
                work: true
            }
        })
        
        const work = await prisma.works.update({
            where: {
                id: workItem1.workId
            },
            data: {
                totalAmount: workItem1.work.totalAmount + totalAmount,
            }
        })


        res.status(200).json({success: true})
    }

    else if(req.method === "DELETE") {
        const { id } = req.body

        await prisma.workItem.delete({
            where: {
                id: id
            }
        })

        res.status(200).json({success: true})
    }
}