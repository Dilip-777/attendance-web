import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function ShiftRole (req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "PUT") {
        const { id, role } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        if(user && user.specialRole) {
            const updatedUser = await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    role: role
                }
            })
            res.status(200).json(updatedUser)
        }
        else {
            res.status(403).json({message: "You do not have permission to do this"})
        }
    }
}