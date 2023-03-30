import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function getTimeKeeper(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== "GET") {
      res.status(405).json({ name: "Method Not Allowed" });
    }
    else {
        const timekeeper = await prisma.timeKeeper.findMany()
        res.status(200).json(timekeeper)
    }
}
