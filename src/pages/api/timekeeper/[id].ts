import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function gettimekeeper(req: NextApiRequest, res: NextApiResponse) {
    const { id, role } = req.query
    if(req.method === "GET") {
       
        try {

            const timekeeper = await prisma.timeKeeper.findUnique({
                where: {
                    id: id as string
                }
            })
            res.status(200).json(timekeeper)
        }
        catch (error) {
            res.status(500).json({success: "false", message: "Something went wrong"})
        }



    }
    else if(req.method === "PUT") {

        const savedTimekeeper = await prisma.saveTimekeeper.findUnique({
            where : {
                id: id as string
            }
        })

        

        if(savedTimekeeper) {
            await prisma.timeKeeper.update({
                where: {
                  id: id as string,
                }, 
                data: {
                    ...savedTimekeeper,
                    status: "Approved"
                }
            })
       await prisma.saveTimekeeper.delete({
        where: {
            id: id as string
        }
       })
    } 
    res.status(200).json({success: "true", message: "Timekeeper Approved"})
}
    else if( req.method === "DELETE") {
        await prisma.saveTimekeeper.delete({
            where: {
                id: id as string
            }
        })
        await prisma.timeKeeper.update({
            where: {
                id: id as string
            }, 
            data: {
                status: 'Rejected'
            }
        })
        res.status(200).json({success: "true", message: "Timekeeper Rejected"})
    }
    else {
        res.status(405).json({ name: "Method Not Allowed" });
    }
}