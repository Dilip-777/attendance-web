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
      // try {
        const isExist = await prisma.department.findUnique({
          where: {
            id: req.body.id || "",
          }
        })
        
        if (isExist) {
          await prisma.department.update({
            where: {
              id: isExist.id,
            },
            data: {
              department: req.body.department,
            }
          })
          res.status(200).json({ success: true });
          return;
        }
        const department1 = await prisma.department.create({
          data: {
            id: shortid.generate(),
            department: req.body.department,
          },
        });
        res.status(201).json(department1);
      // } catch (error) {
      //   res.status(400).json({ success: false });
      // }
      break;
    case 'PUT':
      try {
        const { id, designations } = req.body;
        
        const department =  await prisma.department.update({
          where: {
            id: id,
          },
          data: {
            designations: designations
          }
        })
        
                res.status(200).json({ success: true });
      }
      catch (error) {
        res.status(400).json({ success: false });
      }
      break;
      case 'DELETE':
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