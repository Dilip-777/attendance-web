import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getTimeKeeper(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ name: "Method Not Allowed" });
  } else {
    const {
      month,
      role,
      page,
      rowsPerPage,
      contractorname,
      attendancedate,
      orderBy,
      filter,
    } = req.query;
    // await prisma.timeKeeper.deleteMany();

    const wh: any = {};

    wh.attendancedate = {
      contains: month as string,
    };

    if (contractorname !== "all") {
      wh.contractorname = contractorname;
    }

    if (attendancedate) {
      wh.attendancedate = attendancedate;
    }

    if (role !== "HR" && role !== "TimeKeeper") {
      wh.approvedByTimekeeper = true;
    }

    if (orderBy && filter) {
      wh[orderBy as string] = {
        contains: filter,
        mode: "insensitive",
      };
    }

    const count = await prisma.timeKeeper.count({
      where: wh,
    });

    console.log(wh);

    if (role === "HR") {
      const savedTimekeeper = await prisma.saveTimekeeper.findMany({
        where: wh,
        take: Number(rowsPerPage),
        skip: Number(page) * Number(rowsPerPage),
      });
      const timekeepers =
        savedTimekeeper.length >= Number(rowsPerPage)
          ? await prisma.timeKeeper.findMany({
              where: wh,
              take: Number(rowsPerPage) - savedTimekeeper.length,
              skip: Number(page) * Number(rowsPerPage),
            })
          : [];
      res
        .status(200)
        .json({ data: [...savedTimekeeper, ...timekeepers], count });
    } else {
      const timekeepers = await prisma.timeKeeper.findMany({
        where: wh,
        take: Number(rowsPerPage),
        skip: Number(page) * Number(rowsPerPage),
      });
      res.status(200).json({ data: timekeepers, count });
    }
  }
}
