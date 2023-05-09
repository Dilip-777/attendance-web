import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";




export default async function employee (req: NextApiRequest, res: NextApiResponse) {
   
    if(req.method === "POST") {
        const {id,contractorId, ...data} = req.body
        const isExist = await prisma.employee.findFirst({
            where: {
                employeeId: data.employeeId,
            }
        })
        if(isExist && !id) {
            res.status(409).json({message: "Employee Id already exists", error: "employeeId"})
            return;
        }
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
                    contractorId: contractorId
                }
            })

            if(!contractor) {
                res.status(404).json({message: "Contractor not found", error: "contractorId"})
                return;
            }

            const employee = await prisma.employee.create({
                data: {
                    id: shortid.generate(),
                    contractorname: contractor.contractorname,
                    contractorId: contractor.contractorId,
                    ...data
                }
            })
            res.status(200).json(employee)
        }
    }
}