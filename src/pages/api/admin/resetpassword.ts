import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function resetPassword (req: NextApiRequest, res: NextApiResponse)  {
    const { id, password } = req.body
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    if(!user) {
        res.status(404).json({
            message: "User not found"
        })
        return
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            password: hashedPassword
        }
    })
    res.status(200).json({
        message: "Password reset successfully",
        hashedPassword: hashedPassword
    })
}