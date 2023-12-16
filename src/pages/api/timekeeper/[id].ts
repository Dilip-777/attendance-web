import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function gettimekeeper(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, role } = req.query;
  if (req.method === "GET") {
    try {
      const timekeeper = await prisma.timeKeeper.findUnique({
        where: {
          id: id as string,
        },
      });
      res.status(200).json(timekeeper);
    } catch (error) {
      res
        .status(500)
        .json({ success: "false", message: "Something went wrong" });
    }
  } else if (req.method === "PUT") {
    const { status, comment, userId, userName, role } = req.body;

    const savedTimekeeper = await prisma.saveTimekeeper.findUnique({
      where: {
        id: id as string,
      },
    });

    await prisma.timeKeeper.update({
      where: {
        id: id as string,
      },
      data: {
        status: status,
      },
    });

    if (savedTimekeeper) {
      if (comment) {
        await prisma.comment.create({
          data: {
            comment: comment,
            timekeeperId: id as string,
            userId: userId,
            userName: userName,
            role: role,
          },
        });
      }
      if (status === "Approved") {
        const formattedDate = new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        await prisma.timeKeeper.update({
          where: {
            id: id as string,
          },
          data: {
            ...savedTimekeeper,
            status: status,
            hrdatetime: formattedDate,
          },
        });
      } else if (status === "Rejected") {
        await prisma.timeKeeper.update({
          where: {
            id: id as string,
          },
          data: {
            status: "Rejected",
          },
        });
      }
      await prisma.saveTimekeeper.delete({
        where: {
          id: id as string,
        },
      });
    }
    res.status(200).json({ success: "true", message: "Timekeeper Approved" });
  } else if (req.method === "DELETE") {
    const { ids } = req.body;
    // await prisma.timeKeeper.deleteMany({
    //     where: {
    //         id: {
    //             in: ids
    //         }
    //     }
    // })

    res
      .status(200)
      .json({ success: "true", message: "Timekeeper Deleted Succuessfully" });
  } else {
    res.status(405).json({ name: "Method Not Allowed" });
  }
}
