import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import shortid from "shortid";


export default async function department(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const departments = await prisma.department.findMany();
        res.status(200).json(departments);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const isExist = await prisma.department.findFirst({
          where: {
            department: req.body.department,
          }
        })
        if (isExist) {
          await prisma.department.update({
            where: {
              id: isExist.id,
            },
            data: {
              ...req.body,
            }
          })
          res.status(200).json({ success: true });
          return;
        }
        const department = await prisma.department.create({
          data: {
            id: shortid.generate(),
            ...req.body,
          },
        });
        res.status(201).json(department);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      // try {
        const { id, designations } = req.body;
        console.log(designations);
        
        const department =  await prisma.department.update({
          where: {
            id: id,
          },
          data: {
            designations: designations
          }
        })
        console.log(department);
        
                res.status(200).json({ success: true });
      // }
      // catch (error) {
      //   res.status(400).json({ success: false });
      // }
      break;
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}