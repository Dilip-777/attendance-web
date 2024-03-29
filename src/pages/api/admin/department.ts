import prisma from "@/lib/prisma";
import { Contractor } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";

export default async function department(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      const { contractorId } = req.query;
      let where: any = {};
      if (contractorId) {
        where.contractors = {
          some: {
            contractorId: contractorId as string,
          },
        };
      }
      try {
        const departments = await prisma.department.findMany({
          include: {
            contractors: true,
          },
          where: where,
        });
        res.status(200).json(departments);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      // try {

      const { department, salaryduration, contractors } = req.body;

      const isExist = await prisma.department.findUnique({
        where: {
          id: req.body.id || "",
        },
        include: {
          contractors: true,
        },
      });

      if (isExist) {
        console.log(isExist);

        await prisma.department.update({
          where: {
            id: isExist.id,
          },
          data: {
            department: department,
            basicsalary_in_duration: salaryduration,
            contractors: {
              disconnect: isExist.contractors.map((contractor) => ({
                id: contractor.id,
              })),
              connect: contractors.map((contractor: Contractor) => ({
                id: contractor.id,
              })),
            },
          },
        });
        res.status(200).json({ success: true });
        return;
      }
      const d = await prisma.department.findUnique({
        where: {
          department: department,
        },
      });
      if (d) {
        res
          .status(400)
          .json({ success: "false", message: "Department Already Exists" });
        return;
      }
      const department1 = await prisma.department.create({
        data: {
          id: shortid.generate(),
          department: req.body.department,
          basicsalary_in_duration: req.body.salaryduration,
          contractors: {
            connect: contractors.map((contractor: Contractor) => ({
              id: contractor.id,
            })),
          },
        },
      });
      res.status(201).json(department1);
      // } catch (error) {
      //   res.status(400).json({ success: false });
      // }
      break;
    case "PUT":
      try {
        const { id, designations } = req.body;

        const department = await prisma.department.update({
          where: {
            id: id,
          },
          data: {
            designations: designations,
          },
        });

        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.body;
        const department = await prisma.department.delete({
          where: {
            id: id,
          },
        });
        res.status(200).json(department);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
