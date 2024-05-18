import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function measurement(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { contractorId: id } = req.query;
    if (id) {
      const measurement = await prisma.measurement.findMany({
        where: {
          contractorid: id as string,
        },
        include: {
          contractor: true,
          measurementItems: true,
        },
        orderBy: {
          itemcode: "asc",
        },
      });
      res.status(200).json(measurement);
      return;
    }
    const measurement = await prisma.measurement.findMany({
      include: {
        contractor: true,
        measurementItems: true,
      },
    });
    res.status(200).json(measurement);
  }

  if (req.method === "POST") {
    const { measurementItem, totalAmount } = req.body;

    const workItem1 = await prisma.measurementItem.create({
      data: {
        ...measurementItem,
      },
      include: {
        measurement: true,
      },
    });

    const measurement = await prisma.measurement.update({
      where: {
        id: workItem1.measurementId,
      },
      data: {
        totalAmount: workItem1.measurement.totalAmount + totalAmount,
        totalQuantity: workItem1.measurement.totalQuantity + workItem1.quantity,
      },
    });

    res.status(200).json(measurement);
  }

  if (req.method === "PUT") {
    const { measurementItem, totalAmount } = req.body;

    const workItem1 = await prisma.measurementItem.update({
      where: {
        id: measurementItem.id,
      },
      data: {
        ...measurementItem,
      },
      include: {
        measurement: true,
      },
    });

    const measurement = await prisma.measurement.update({
      where: {
        id: workItem1.measurementId,
      },
      data: {
        totalAmount: workItem1.measurement.totalAmount + totalAmount,
      },
    });

    res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    await prisma.measurementItem.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ success: true });
  }
}
