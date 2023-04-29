import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";

export default async function designations(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const designations = await prisma.designations.findMany();
    res.status(200).json(designations);
  } else if (req.method === "POST") {
    const data = req.body;

    let id = data.designation;
    id = id.replace(/\s+/g, "").toLowerCase();
    if (data?.gender === "Male") {
      id = "m" + id;
    } else if (data?.gender === "Female") id = "f" + id;

    const isExist = await prisma.designations.findFirst({
      where: {
        designationid: id,
        departmentname: data?.departmentname,
      },
    });
    if (isExist)
      return res.status(400).json({ error: "Designation already exist" });

    const designation = await prisma.designations.create({
      data: {
        id: shortid.generate(),
        designationid: id,
        ...data,
      },
    });

    res.status(200).json(designation);
  } else if (req.method === "PUT") {
    const data = req.body;
    let id = data.designation;
    id = id.replace(/\s+/g, "").toLowerCase();
    if (data?.gender === "Male") {
      id = "m" + id;
    } else if (data?.gender === "Female") id = "f" + id;
    const designation = await prisma.designations.update({
      where: {
        id: data?.id,
      },
      data: {
        designationid: id,
        ...data,
      },
    });

    res.status(200).json(designation);
  } else if (req.method === "DELETE") {
    const data = req.body;

    const designation = await prisma.designations.delete({
      where: {
        id: data?.id,
      },
    });

    res.status(200).json(designation);
  }
}
