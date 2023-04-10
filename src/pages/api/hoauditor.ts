import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function hoauditor(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = req.body;
   
      const ho = await prisma.hOAuditor.create({
        data:{
          ...body,
          uploadDoc1 : body.uploadDoc1.newFilename,
          uploadDoc2 : body.uploadDoc2.newFilename,
          uploadDoc3 : body.uploadDoc3.newFilename,
          uploadDoc4 : body.uploadDoc4.newFilename,
          uploadDoc5 : body.uploadDoc5.newFilename,
          uploadDoc6 : body.uploadDoc6.newFilename
        },
      });
      res.status(200).json(ho);
   
  }
}
