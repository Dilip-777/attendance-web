import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";




export default async function employee (req: NextApiRequest, res: NextApiResponse) {
   
    if(req.method === "POST") {
        const {id,contractorId, ...data} = req.body
        const isExist = await prisma.employee.findFirst({
            where: {
                employeeId: data.employeeId.toString(),
            }
        })
        if(isExist) {
            res.status(409).json({message: "Employee already exists", error: "employeeId"})
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
                    id: contractorId
                }
            })

            const employee = await prisma.employee.create({
                data: {
                    id: shortid.generate(),
                    contractorname: contractor?.contractorname || "",
                    contractorId: contractorId,
                    ...data
                }
            })
            res.status(200).json(employee)
        }
    }
}