import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { projectId, boqId, BOQItems } = req.body;
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const boqs = await prisma.qcsBoq.findMany({
      where: {
        boqId: boqId,
      },
    });

    await Promise.all(
      boqs.map(async (boq) => {
        await prisma.qcsBoqItem.createMany({
          data: BOQItems.map((item: any) => {
            return {
              boqId: boq.id,
              extra: true,
              ...item,
            };
          }),
        });
      })
    );

    await prisma.bOQItem.createMany({
      data: BOQItems.map((item: any) => {
        return {
          boqId,
          extra: true,
          ...item,
        };
      }),
    });

    res.status(200).json({ message: "Extra BOQ Items added successfully" });
  }
}
