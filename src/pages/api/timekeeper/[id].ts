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

        const { status } = req.body

        const savedTimekeeper = await prisma.saveTimekeeper.findUnique({
            where : {
                id: id as string
            }
        })

        

        if(savedTimekeeper) {
            if(status === "Approved") {
            await prisma.timeKeeper.update({
                where: {
                  id: id as string,
                }, 
                data: {
                    ...savedTimekeeper,
                    status: status
                }
            })
        } else if(status === "Rejected") {
             await prisma.timeKeeper.update({
            where: {
                id: id as string
            }, 
            data: {
                status: 'Rejected'
            }
        })
        }
       await prisma.saveTimekeeper.delete({
        where: {
            id: id as string
        }
       })
    } 
    res.status(200).json({success: "true", message: "Timekeeper Approved"})
}
    else if( req.method === "DELETE") {
        const { ids } = req.body
        // await prisma.timeKeeper.deleteMany({
        //     where: {
        //         id: {
        //             in: ids
        //         }
        //     }
        // })
        console.log(ids, "ids");
        
        res.status(200).json({success: "true", message: "Timekeeper Deleted Succuessfully"})
    }
    else {
        res.status(405).json({ name: "Method Not Allowed" });
    }
}