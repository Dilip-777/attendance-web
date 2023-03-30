import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   try {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(400).json({ message: "Email doesn't exist" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Password is incorrect" });
  }

  return res.status(200).json({
    message: "success",
    ...user,
    mobileNumber: user?.mobileNumber?.toString(),
  });
}
