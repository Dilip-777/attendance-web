import prisma from "@/lib/prisma";
import { SaveTimekeeper, TimeKeeper } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { number } from "yup";


export default async function getTimeKeeper(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== "GET") {
      res.status(405).json({ name: "Method Not Allowed" });
    }
    else {
      const { month } = req.query
      const timekeepers = await prisma.timeKeeper.findMany({
        where: {
          attendancedate: {
            contains: month as string
          },
          NOT: {
            status: "Pending"
          }
        }
      })
  //        const data: TimeKeeper[] = await prisma.$queryRaw`
  //   SELECT * FROM "public"."TimeKeeper" WHERE DATE_PART('month', TO_DATE(attendancedate, 'DD/MM/YYYY')) = ${parseInt(month as string)}
  // `;
  // const timekeepers = data?.filter((t) => t.status !== "Pending")
  
  //   const savedTimekeeper: SaveTimekeeper[] = await prisma.$queryRaw`
  //   SELECT * FROM "public"."SaveTimekeeper" WHERE DATE_PART('month', TO_DATE(attendancedate, 'DD/MM/YYYY')) = ${parseInt(month as string)}
  // `;
    const savedTimekeeper = await prisma.saveTimekeeper.findMany({
      where: {
        attendancedate: {
            contains: month as string
          },
      }
    })

        res.status(200).json([ ...savedTimekeeper, ...timekeepers])
    }
}
