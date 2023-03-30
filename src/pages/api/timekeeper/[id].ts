import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function gettimekeeper(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    if(req.method !== "GET") {
        res.status(405).json({ name: "Method Not Allowed" });
    } else {
       
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
}