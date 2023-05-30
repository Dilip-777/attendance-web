import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse 
) {
  const { email, password, name, mobileNumber } = req.body;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (isUserExist) {
    return  res.status(400).json({ message: "Email already exist" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      mobileNumber,
    },
  }).then((user) => {
    const u = {...user, mobileNumber: user.mobileNumber?.toString()}
    return res.status(200).json(u);
  }).catch((err) => {
    return res.status(400).json({ message: err.message });
  });
      

  // res.status(200).json(user);
}
