import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function getdocument  (req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        const { id } = req.query
        const upload = await prisma.upload.findMany({
            where : {
                timekeeperId: id as string
            }
        })

        res.status(200).json(upload)
    }
}