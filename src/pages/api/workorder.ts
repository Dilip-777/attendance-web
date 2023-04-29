import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from 'shortid'


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
            id: shortid.generate(),
            contractorId: contractor?.contractorId.toString(),
            contractorName: contractor?.contractorname,
            ...rest,
            amendmentDocument: rest.amendmentDocument?.newFilename || null,
            addendumDocument: rest.addendumDocument?.newFilename || null,
            uploadDocument: rest.uploadDocument?.newFilename || null,
        }
        const workorder = await prisma.workorder.create({
            data: body
        })
        res.status(200).json(workorder);
    }
    else if(req.method === "PUT") {
        const { id, contractorId, ...rest } = req.body
        const contractor = await prisma.contractor.findUnique({
            where : {
                id: contractorId
            }
        })
        if(!contractor) {
            res.status(404).json({message: "Contractor not found"})
        }
        const body = {
            id: id,
            contractorId: contractor?.contractorId.toString(),
            contractorName: contractor?.contractorname,
            ...rest,
            amendmentDocument: rest.amendmentDocument?.newFilename || null,
            addendumDocument: rest.addendumDocument?.newFilename || null,
            uploadDocument: rest.uploadDocument?.newFilename || null,
        }
        const workorder = await prisma.workorder.update({
            where: {
                id: id
            },
            data: body
        })
        res.status(200).json(workorder);
    }
    else if(req.method === "DELETE") {
        const { id } = req.body
        
        const workorder = await prisma.workorder.delete({
            where: {
                id: id
            }
        })
        res.status(200).json(workorder);
    }
}