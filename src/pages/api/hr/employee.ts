import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";




export default async function employee (req: NextApiRequest, res: NextApiResponse) {
   
    if(req.method === "POST") {
        const {id,contractorId, ...data} = req.body
        if(id) {
            const employee = await prisma.employee.update({
                where: {
                    id: id
                },
                data: data
            })
            res.status(200).json(employee)
        }
        else {

            const contractor = await prisma.contractor.findUnique({
                where: {
                    id: contractorId
                }
            })

            const employee = await prisma.employee.create({
                data: {
                    contractorname: contractor?.contractorname || "",
                    contractorId: contractorId,
                    ...data
                }
            })
            res.status(200).json(employee)
        }
    }
}