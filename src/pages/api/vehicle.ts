import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";

export default async function vehicle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { contractor } = req.query;
    const vehicles = await prisma.vehicle.findMany({
      where: {
        contractorId: contractor as string,
      },
    });
    res.status(200).json(vehicles);
  } else if (req.method === "POST") {
    const { id, contractorId, ...data } = req.body;
    const isExist = await prisma.vehicle.findFirst({
      where: {
        vehicleNo: data.vehicleNo,
      },
    });
    if (isExist && !id) {
      res
        .status(409)
        .json({ message: "Vehicle Number already exists", error: "vehicleNo" });
      return;
    }
    if (id) {
      const vehicle = await prisma.vehicle.update({
        where: {
          id: id,
        },
        data: data,
      });
      res.status(200).json(vehicle);
    } else {
      const contractor = await prisma.contractor.findUnique({
        where: {
          contractorId: contractorId,
        },
      });

      if (!contractor) {
        res
          .status(404)
          .json({ message: "Contractor not found", error: "contractorId" });
        return;
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          id: shortid.generate(),
          contractorId: contractor.contractorId,
          ...data,
        },
      });
      res.status(200).json(vehicle);
    }
  }
}
