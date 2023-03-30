import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function editUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, name, mobileNumber, role } = req.body;
  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      name,
      mobileNumber,
      role,
    },
  });

  res.status(200).json(user);
}
