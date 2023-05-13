import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";


export default async function contractors (req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {
         const contractors = await prisma.contractor.findMany();
         res.status(200).json(contractors)
    }

    if(req.method === "POST") {
         const data = req.body
         const isExist = await prisma.contractor.findUnique({
            where: {
                contractorId: data.contractorId
            }
         })

         if(isExist) {
                res.status(409).json({message: "Contractor already exists", error: "contractorId"})
                return;
         }
            
            const contractor = await prisma.contractor.create({
                data: {
                    id: shortid.generate(),
                    ...data,
                    businessdetaildocument: data.businessdetaildocument || null,
                    uploadutilitybill: data.uploadutilitybill || null,
                    memorandam_of_associate: data.memorandam_of_associate || null,
                    listofdirector: data.listofdirector || null,
                    profileofkeyperson : data.profileofkeyperson || null,
                    uploadbranchdetail: data.uploadbranchdetail || null,
                    uploadreturndetail: data.uploadreturndetail || null,
                    upload_registration_cert : data.upload_registration_cert || null,
                    upload_licence1 : data.upload_licence1 || null,
                    upload_licence2 : data.upload_licence2 || null,
                    upload_list_ofclientele : data.upload_list_ofclientele || null,
                    upload_certificate_services : data.upload_certificate_services || null,
                    upload_doc1: data.upload_doc1 || null,
                    upload_doc2: data.upload_doc2 || null,
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