import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { comment, uploadDocument, id, userId, userName, role, ...body } =
      req.body;

    if (role !== "TimeKeeper") {
      const timekeeper = await prisma.timeKeeper.update({
        where: {
          id: id,
        },
        data: body,
      });
    } else {
      const timekeeper = await prisma.timeKeeper.update({
        where: {
          id: id,
        },
        data: {
          status: "Pending",
        },
      });
      await prisma.saveTimekeeper.create({
        data: {
          id: id,
          contractorid: timekeeper.contractorid,
          contractorname: timekeeper.contractorname,
          employeeid: timekeeper.employeeid,
          employeename: timekeeper.employeename,
          ...body,
        },
      });
    }

    const iscommented = await prisma.comment.findMany({
      where: {
        timekeeperId: id,
        userId: userId,
      },
    });
    iscommented.length > 0
      ? await prisma.comment.update({
          where: {
            id: iscommented[0].id,
          },
          data: {
            comment: comment,
          },
        })
      : await prisma.comment.create({
          data: {
            comment: comment,
            userId: userId,
            userName: userName,
            role: role,
            timekeeperId: id,
          },
        });
    if (uploadDocument) {
      const isDocumentUploaded = await prisma.upload.findMany({
        where: {
          timekeeperId: id,
          userId: userId,
        },
      });
      isDocumentUploaded.length > 0
        ? await prisma.upload.update({
            where: {
              id: isDocumentUploaded[0].id,
            },
            data: {
              document: uploadDocument,
            },
          })
        : await prisma.upload.create({
            data: {
              document: uploadDocument,
              userId: userId,
              userName: userName,
              role: role,
              timekeeperId: id,
            },
          });
    }
    res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const { ids } = req.body;
    if (ids) {
      await prisma.timeKeeper.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } else {
      await prisma.timeKeeper.deleteMany();
    }
    res.status(200).json({ success: true });
  }
}
