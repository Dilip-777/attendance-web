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

    // if (role !== "HR" && role !== "TimeKeeper") {
    //   wh.approvedByTimekeeper = true;
    // }

    if (orderBy && filter) {
      wh[orderBy as string] = {
        contains: filter,
        mode: "insensitive",
      };
    }

    const count = await prisma.timeKeeper.count({
      where: wh,
    });

    const obj: any = {
      where: wh,
    };

    if (Number(rowsPerPage) && (Number(page) || Number(page) === 0)) {
      obj["take"] = Number(rowsPerPage);
      obj["skip"] = Number(page) * Number(rowsPerPage);
    }

    console.log(wh);

    if (role === "HR") {
      console.log(obj);

      const savedTimekeeper = await prisma.saveTimekeeper.findMany(obj);
      const timekeepers =
        savedTimekeeper.length < Number(rowsPerPage) || !rowsPerPage
          ? await prisma.timeKeeper.findMany(obj)
          : [];
      res
        .status(200)
        .json({ data: [...savedTimekeeper, ...timekeepers], count });
    } else {
      if (role !== "HR" && role !== "TimeKeeper") {
        wh.approvedByTimekeeper = true;
        obj["where"] = wh;
      }

      const timekeepers = await prisma.timeKeeper.findMany(obj);
      res.status(200).json({ data: timekeepers, count });
    }
  }
}
