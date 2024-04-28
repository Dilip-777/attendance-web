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
      role,
      page,
      rowsPerPage,
      contractorname,
      dateArray,
      attendance,
      orderBy,
      filter,
    } = req.query;
    // await prisma.timeKeeper.deleteMany();

    const wh: any = {};
    // if (month) {
    //   wh.attendancedate = {
    //     contains: month as string,
    //   };
    // }

    if (contractorname !== "all") {
      wh.contractorid = contractorname;
    }

    if (dateArray) {
      wh.attendancedate = {
        in: (dateArray as string).split(","),
      };
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

    const fullattendance =
      attendance === "0.5"
        ? 0
        : await prisma.timeKeeper.count({
            where: {
              attendance: "1",
              ...wh,
            },
          });

    const halfattendance =
      attendance === "1"
        ? 0
        : await prisma.timeKeeper.count({
            where: {
              attendance: "0.5",
              ...wh,
            },
          });

    if (attendance) {
      if (attendance === "1.5") {
        wh.attendance = {
          in: ["1", "0.5"],
        };
      } else if (attendance === "all") {
        wh.attendance = {
          in: ["1", "0.5", "0"],
        };
      } else {
        wh.attendance = attendance as string;
      }
    }

    // if (role !== "HR" && role !== "TimeKeeper") {
    //   wh.approvedByTimekeeper = true;
    // }

    // if (orderBy && filter) {
    //   wh[orderBy as string] = {
    //     contains: filter,
    //     mode: "insensitive",
    //   };
    // }

    const overtime = await prisma.timeKeeper.aggregate({
      where: {
        NOT: {
          manualovertime: null,
        },
        ...wh,
      },
      _sum: {
        manualovertime: true,
      },
    });

    const machineOvertime = await prisma.timeKeeper.aggregate({
      where: {
        ...wh,
        manualovertime: null,
      },
      _sum: {
        overtime: true,
      },
    });

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

    if (role === "HR") {
      const savedTimekeeper = await prisma.saveTimekeeper.findMany(obj);
      const timekeepers =
        savedTimekeeper.length < Number(rowsPerPage) || !rowsPerPage
          ? await prisma.timeKeeper.findMany({
              ...obj,
              include: {
                comment: true,
              },
            })
          : [];
      res.status(200).json({
        data: [...savedTimekeeper, ...timekeepers],
        count,
        overtime:
          (overtime._sum.manualovertime || 0) +
          (machineOvertime._sum.overtime || 0),
        attendance: fullattendance + halfattendance / 2,
      });
    } else {
      if (role !== "HR" && role !== "TimeKeeper") {
        wh.approvedByTimekeeper = true;
        obj["where"] = wh;
      }

      const timekeepers = await prisma.timeKeeper.findMany({
        ...obj,
        // where: {
        //   attendancedate: {
        //     in: (dateArray as string).split(","),
        //   },
        // },
        orderBy: [
          {
            employeeid: "asc",
          },
          {
            attendancedate: "asc",
          },
        ],
        include: {
          comment: true,
        },
      });
      res.status(200).json({
        data: timekeepers,
        count,
        overtime:
          (overtime._sum.manualovertime || 0) +
          (machineOvertime._sum.overtime || 0),
        attendance:
          attendance === "0" ? 0 : fullattendance + halfattendance / 2,
      });
    }
  }
}
