import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function vehiclelogbook (req: NextApiRequest, res: NextApiResponse) {
    const { month, contractor } = req.query

    const workorder = await prisma.workorder.findFirst({
        where: {
            startDate: {
                endsWith: month as string
            },
            contractorId: contractor as string
        }
    })

    if(req.method === "GET") {

        
        const automobiles = await prisma.automobile.findMany({
            where: {
                contractorId: contractor as string,
                workorderId: workorder?.id,
                date: {
                    endsWith: month as string
                },
            }
        })
        res.status(200).json(automobiles)
    }
    else if(req.method === "POST") {
        const data = req.body

      const workorder = await prisma.workorder.findFirst({
        where: {
            contractorId: data.contractorId,
            startDate: {
                endsWith: data.month
            }
        }
      })
     
      const automobile = await prisma.automobile.create({
         data: {
            workorderId: workorder?.id,
            ...data
         }
      })

        res.status(200).json(automobile)

        
    }

            
}