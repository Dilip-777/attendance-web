import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function barBending(req: NextApiRequest, res: NextApiResponse) {
    
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
        const { barbendingItems, ...rest } = req.body
        

        const work = await prisma.barBending.create({
            data: {
                ...rest,
                barbendingItems: {
                    createMany: {
                        data: barbendingItems
                    }
                }
            }
        })

        res.status(200).json(work)
    }

    if(req.method === "PUT") {
        const { barbendingItems, ...rest } = req.body

        await prisma.barBendingItem.deleteMany({
            where: {
                barBendingId: rest.id
            }
        })

        const work = await prisma.barBending.update({
            where: {
                id: rest.id
            },
            data: {
                ...rest,
                barbendingItems: {
                    createMany: {
                        data: barbendingItems
                    }
                }
            }
        })

        res.status(200).json({success: true})

        // barbendingItems.forEach(async (barBendingItem) => {
        //     if(barBendingItem.id) {

        // const { barBendingItem, description, contractorid, id } = req.body
        // if(description && contractorid) {

        //     await prisma.barBending.update({
        //         where: {
        //             id: id
        //         },
        //         data: {
        //             description,
        //             contractorid,
        //         }
        //     })
        // } 

        // if(barBendingItem) {
            
        
        //     await prisma.barBendingItem.update({
        //         where: {
        //             id: barBendingItem.id
        //         }, 
        //         data: barBendingItem,
        //     })
        // }

        //  await prisma.barBendingItem.createMany({
        //     data: barbendingItems,
        //     skipDuplicates: true
        // })

        // res.status(200).json({ success: true })
    }
}