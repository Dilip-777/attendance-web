import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";



export default async function payouttracker(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
         const data = req.body 

         const store = await prisma.stores.findFirst({
            where: {
                contractorid: data.contractorId,
                month: data.month
            }
         })

         const safety = await prisma.safety.findFirst({
            where: {
                contractorid: data.contractorId,
                month: data.month
            }
         })

         const { finalpayableamount, ...rest } = data

         const isexist = await prisma.payoutTracker.findFirst({
            where : {
                contractorId: data.contractorId,
                month: data.month,
            }
         })

            if(isexist) {
                const payouttracker = await prisma.payoutTracker.update({
                    where: {
                        id: isexist.id
                    },
                    data: {
                        ...rest,
                        finalpayableamount: finalpayableamount - (store?.chargeableamount || 0) - (safety?.netchargeableamount|| 0)
                    }
                })
                res.status(200).json(payouttracker)
                return
            }
         const payouttracker = await prisma.payoutTracker.create({
            data: {
                id: shortid.generate(),
                ...rest,
                finalpayableamount: finalpayableamount - (store?.chargeableamount || 0) - (safety?.netchargeableamount|| 0)
            }
         })
        res.status(200).json(payouttracker)
    }

    if(req.method === "PUT") {
        const {id, ...data} = req.body

        const payouttracker = await prisma.payoutTracker.update({
            where: {
                id: id
            },
            data: data
        })

        res.status(200).json(payouttracker)
    }
    
    if(req.method === "GET") {
        const { month, contractorid} = req.query
        if(!month) {
            const payoutrackers = await prisma.payoutTracker.findMany()
            res.status(200).json(payoutrackers)
            return
        }
        if(!contractorid) {
            const payoutrackers = await prisma.payoutTracker.findMany({
                where: {
                    month: month as string
                }
            })
            res.status(200).json(payoutrackers)
            return
        }

          const date = dayjs(month as string, "MM/YYYY");
    const prevMonth = date.subtract(1, "month");
    const prevprevMonth = prevMonth.subtract(1, "month");
    const prevMonthString = prevMonth.format("MM/YYYY");
    const prevprevMonthString = prevprevMonth.format("MM/YYYY");
    const prevYear = date.subtract(1, "year").format("YYYY");

    const prevYearAmount = await prisma.payoutTracker.aggregate({
        where: {
            month: {
                contains: prevYear,
            },
            contractorId: parseInt(contractorid as string),
        },
        _sum: {
            finalpayableamount: true,
        }
    })

    const prevPayout = await prisma.payoutTracker.findFirst({
        where: {
            month: prevMonthString,
            contractorId: parseInt(contractorid as string),
        }
    })

    const prevprevPayout = await prisma.payoutTracker.findFirst({
        where: {
            month: prevprevMonthString,
            contractorId: parseInt(contractorid as string),
        }
    })

    const currentpayout = await prisma.payoutTracker.findFirst({
        where: {
            month: month as string,
            contractorId: parseInt(contractorid as string),
        }
    })



        const payoutracker = await prisma.payoutTracker.findFirst({
            where: {
                month: prevMonthString as string,
                contractorId: parseInt(contractorid as string)
            }
        })

        res.status(200).json({ currentpayout, payoutracker, prevMonthAmount: prevPayout?.finalpayableamount, prevprevMonthAmount: prevprevPayout?.finalpayableamount, prevYearAmount: prevYearAmount._sum.finalpayableamount })
    }
}