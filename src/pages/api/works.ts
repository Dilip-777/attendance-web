import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function works(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "GET") {
        const { contractorid: id} = req.query
        if(id) {
            const works = await prisma.works.findMany({
                where: {
                    contractorid: id as string
                },
                include: {
                    contractor: true,
                    workItems: true
                }
            })
            res.status(200).json(works)
            return
        }
        const works = await prisma.works.findMany({
            include: {
                contractor: true,
                workItems: true
            }
        })
        res.status(200).json(works)
    }

    if(req.method === "POST") {
        const { workItems, ...rest } = req.body

        let workitems: any[] = []

           const workids = workItems.map((item: any) => item.referenceWorkId || "jhj")

        const works = await prisma.works.findMany({
            where: {
                id: {
                    in : workids
                }
            }
        })

         workItems.forEach(async(workItem: any) => {
            if(workItem.referenceWorkId) {
                 const work = works.find((item) => item.id === workItem.referenceWorkId)
                 if(work) {
                    const quantity = parseFloat((work.totalQuantity).toFixed(3));
                    const valueofcurrentBill = parseFloat((quantity * workItem.unitrate).toFixed(3));
                    // return {
                    //     ...barBendingItem,
                    //     quantity,
                    //     valueofcurrentBill,
                    //     totalQuantity: quantity,
                    //     valueofTotalBill: valueofcurrentBill
                    // }
                    workitems.push({
                        ...workItem,
                        quantity,
                        valueofcurrentBill,
                        totalQuantity: quantity,
                        valueofTotalBill: valueofcurrentBill
                    })
                 } else {
                    console.log("work not found");
                    
                 }
            } else {
                workitems.push(workItem)
            }
        })
        
        // let workitems1 = await workItems.map( async (barBendingItem: any) => {
        //     if(barBendingItem.referenceWorkId) {
        //          const work = await prisma.works.findUnique({
        //             where: {
        //                 id: barBendingItem.referenceWorkId
        //             }
        //          })
        //          if(work) {
        //             const quantity = work.totalAmount;
        //             const valueofcurrentBill = parseFloat((quantity * barBendingItem.workItem.unitrate).toFixed(3));
        //             return {
        //                 ...barBendingItem,
        //                 quantity,
        //                 valueofcurrentBill,
        //                 totalQuantity: quantity,
        //                 valueofTotalBill: valueofcurrentBill
        //             }
        //          }
        //     }
        //     return barBendingItem

        // })

       const totalAmount = workitems.reduce((acc, item) => {
            return acc + item.valueofcurrentBill
        }, 0)

        const totalQuantity  = workitems.reduce((acc, item) => {
            return acc + item.quantity
        }, 0)
        

        const work = await prisma.works.create({
            data: {
                ...rest,
                totalAmount,
                totalQuantity,
                workItems: {
                    createMany: {
                        data: workitems
                    }
                }
            }
        })

        res.status(200).json(work)
    }

    if(req.method === "PUT") {
        const { workItems, ...rest } = req.body

        await prisma.workItem.deleteMany({
            where: {
                workId: rest.id
            }
        })

        const workids = workItems.map((item: any) => item.referenceWorkId || "slfj")

        const works = await prisma.works.findMany({
            where: {
                id: {
                    in : workids
                }
            }
        })


        let workitems: any[] = []

       workItems.forEach((workItem: any) => {
            if(workItem.referenceWorkId) {
                 const work = works.find((item) => item.id === workItem.referenceWorkId)
                 if(work) {
                    console.log(work);
                    
                    const quantity = work.totalQuantity;
                    const valueofcurrentBill = parseFloat((quantity * workItem.unitrate).toFixed(3));
                    // return {
                    //     ...barBendingItem,
                    //     quantity,
                    //     valueofcurrentBill,
                    //     totalQuantity: quantity,
                    //     valueofTotalBill: valueofcurrentBill
                    // }
                    console.log(quantity, valueofcurrentBill);
                    
                    workitems.push({
                        ...workItem,
                        quantity,
                        valueofcurrentBill,
                        totalQuantity: quantity,
                        valueofTotalBill: valueofcurrentBill
                    })
                    console.log({...workItem,
                        quantity,
                        valueofcurrentBill,
                        totalQuantity: quantity,
                        valueofTotalBill: valueofcurrentBill});
                    
                 } else {
                    console.log("work not found");
                    
                 }
            } else {
                workitems.push(workItem)
            }
        })

        const totalAmount = workitems.reduce((acc, item) => {
            return acc + item.valueofcurrentBill
        }, 0)

        const totalQuantity  = workitems.reduce((acc, item) => {
            return acc + item.quantity
        }, 0)
        
        const work = await prisma.works.update({
            where: {
                id: rest.id
            },
            data: {
                ...rest,
                totalAmount: parseFloat(totalAmount.toFixed(3)),
                totalQuantity: parseFloat(totalQuantity.toFixed(3)),
                workItems: {
                    createMany: {
                        data: workitems
                    }
                }
            }
        })

        console.log(totalAmount, workitems);
        

        console.log("lsjdflskjfkl");
        

        res.status(200).json({success: true})

        // workItems.forEach(async (workItem) => {
        //     if(workItem.id) {

        // const { workItem, description, contractorid, id } = req.body
        // if(description && contractorid) {

        //     await prisma.works.update({
        //         where: {
        //             id: id
        //         },
        //         data: {
        //             description,
        //             contractorid,
        //         }
        //     })
        // } 

        // if(workItem) {
            
        
        //     await prisma.workItem.update({
        //         where: {
        //             id: workItem.id
        //         }, 
        //         data: workItem,
        //     })
        // }

        //  await prisma.workItem.createMany({
        //     data: workItems,
        //     skipDuplicates: true
        // })

        // res.status(200).json({ success: true })
    }
}