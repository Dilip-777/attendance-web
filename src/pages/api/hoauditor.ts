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
          uploadDoc1 : body.uploadDoc1 || null,
          uploadDoc2 : body.uploadDoc2 || null,
          uploadDoc3 : body.uploadDoc3 || null,
          uploadDoc4 : body.uploadDoc4 || null,
          uploadDoc5 : body.uploadDoc5 || null,
          uploadDoc6 : body.uploadDoc6 || null
        },
      });
      res.status(200).json(ho);
   
  }
  
}
