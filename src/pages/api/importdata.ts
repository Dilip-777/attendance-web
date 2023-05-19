import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function test (req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        res.status(200).json(process.env.DATABASE_URL)
    }
    const data = req.body
    const { type } = req.query
    if(type === "employee") {
       try {
        const ids = data.map((employee: any) => employee.employeeId)
        const deletedEmployees = await prisma.employee.deleteMany({
            where : {
                employeeId: {
                    in: ids
                }
            }
        })
        const employees = await prisma.employee.createMany({
            data: data,
            skipDuplicates: true
       }) 
    // const employee = await prisma.employee.create({
    //     data: data[0]
    // })
       res.status(200).json({ success: true })
       } catch(error) {
           res.status(400).json({ success: false, error: error })
       }
    }

    else if(type === "contractor") {
        const ids = data.map((contractor: any) => contractor.contractorId)
        const deletedContractors = await prisma.contractor.deleteMany({
            where : {
                contractorId: {
                    in: ids
                }
            }
        })
        const contractors = await prisma.contractor.createMany({
            data: data,
            skipDuplicates: true
        })
        res.status(200).json({ success: true })
    }
    else {

        const timekeepers = await prisma.timeKeeper.createMany({
            data: data,
            skipDuplicates: true
        })

        const employees = await prisma.employee.findMany({
            where: {
                gender: "Female"
            },
            select: {
                employeeId: true
            }
        })

        const updatedTimekeepers = await prisma.timeKeeper.updateMany({
           data: {
             gender: "Female"
           },
           where: {
            employeeid: {
                in: employees.map((employee) => employee.employeeId)
            }
           }
        })
        // const timeKeeper = await prisma.timeKeeper.create({
        //    data: data[0]
        // })
        
        res.status(200).json({ success: true })
    }
}
