import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function contractors (req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {
         const contractors = await prisma.contractor.findMany();
         res.status(200).json(contractors)
    }

    if(req.method === "POST") {
         const data = req.body
            
            const contractor = await prisma.contractor.create({
                data: {
                    ...data,
                    businessdetaildocument: data.businessdetaildocument.newFilename,
                    uploadutilitybill: data.uploadutilitybill.newFilename,
                    memorandam_of_associate: data.memorandam_of_associate.newFilename,
                    listofdirector: data.listofdirector.newFilename,
                    profileofkeyperson : data.profileofkeyperson.newFilename,
                    uploadbranchdetail: data.uploadbranchdetail.newFilename,
                    uploadreturndetail: data.uploadreturndetail.newFilename,
                    upload_registration_cert : data.upload_registration_cert.newFilename,
                    upload_licence1 : data.upload_licence1.newFilename,
                    upload_licence2 : data.upload_licence2.newFilename,
                    upload_list_ofclientele : data.upload_list_ofclientele.newFilename,
                    upload_certificate_services : data.upload_certificate_services.newFilename,
                    upload_doc1: data.upload_doc1.newFilename,
                    upload_doc2: data.upload_doc2.newFilename,
                }
            })
            res.status(200).json(contractor)
    }

    if(req.method === "PUT") {
         const {id, ...data} = req.body
         
            const contractorexists = await prisma.contractor.findUnique({
                where: {
                    id: id
                }
            })
            if(!contractorexists) {
                res.status(404).json({message: "Contractor not found"})
            }

        const contractor = await prisma.contractor.update({
            where: {
                id: id
            },
            data: data
        })
        res.status(200).json(contractor)
    }
    
    if(req.method === "DELETE") {
        const {id} = req.body
        const contractorexists = await prisma.contractor.findUnique({
            where: {
                id: id
            }
        })
        if(!contractorexists) {
            res.status(404).json({message: "Contractor not found"})
        }

        const contractor = await prisma.contractor.delete({
            where: {
                id: id
            }
        })
        res.status(200).json(contractor)
    }
}