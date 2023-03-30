import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function getcomment  (req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        const { id } = req.query
        const comment = await prisma.comment.findMany({
            where : {
                timekeeperId: id as string
            }
        })

        res.status(200).json(comment)
    }
}