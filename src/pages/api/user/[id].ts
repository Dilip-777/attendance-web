import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';



export  default async function getUser (req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
   if(req.method === "GET") {
     const user = await prisma.user.findUnique({
        where: { id: id as string },
    })
    res.status(200).json(user);
   }
   if(req.method === "PUT") {
       const data = req.body
       const user = await prisma.user.update({
           where: { id: id as string },
           data: data
       })
       res.status(200).json(user);
   }
   if(req.method === "POST") {
      
         const data = req.body
         const currentUser = await prisma.user.findUnique({
            where: { id: id as string },
         })
         if(currentUser) {

             const passwordMatched = await bcrypt.compare(data.currentPassword, currentUser.password);
             if(passwordMatched) {
                 const user = await prisma.user.update({
                    where: {
                          id: id as string
                    },
                     data: {
                        password: await bcrypt.hash(data.password, 12),
                     }
                    })
                    res.status(200).json(user);
                }
                else {
                    res.status(400).json({ message: "Current Password is wrong" });
                }
            }
   }
}