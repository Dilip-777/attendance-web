import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function workorder (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        
        const {  contractorId, ...rest } = req.body
        const contractor = await prisma.contractor.findUnique({
            where : {
                id: contractorId
            }
        })
        if(!contractor) {
            res.status(404).json({message: "Contractor not found"})
        }
        const body = {
            contractorId: contractor?.id,
            contractorName: contractor?.contractorname,
            ...rest,
            amendmentDocument: rest.amendmentDocument.newFilename,
            addendumDocument: rest.addendumDocument.newFilename,
            uploadDocument: rest.uploadDocument.newFilename,
        }
        const workorder = await prisma.workorder.create({
            data: body
        })
        res.status(200).json(workorder);
    }
}