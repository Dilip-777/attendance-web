import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import shortid from "shortid";

export default async function contractors(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let where: any = {};
    const { page } = req.query;
    const session = await getSession({ req });
    if (page === "home") {
      if (
        session?.user?.role === "TimeKeeper" ||
        session?.user?.role === "HR"
      ) {
        where = {
          servicedetail: {
            not: "Equipment / Vehicle Hiring",
          },
        };
      }
      const contractors = await prisma.contractor.findMany({
        include: {
          departments: true,
          employee: {
            take: 1,
          },
        },

        where,

        orderBy: {
          contractorname: "asc",
        },
      });
      res.status(200).json(contractors.filter((c) => c.employee.length > 0));
    } else {
      if (
        session?.user?.role === "TimeKeeper" ||
        session?.user?.role === "HR"
      ) {
        where = {
          servicedetail: {
            not: "Equipment / Vehicle Hiring",
          },
        };
      }
      const contractors = await prisma.contractor.findMany({
        include: {
          departments: true,
        },
        where,
        orderBy: {
          contractorname: "asc",
        },
      });
      res.status(200).json(contractors);
    }
  }

  if (req.method === "POST") {
    const data = req.body;
    const isExist = await prisma.contractor.findUnique({
      where: {
        contractorId: data.contractorId,
      },
    });

    if (isExist) {
      res
        .status(409)
        .json({ message: "Contractor already exists", error: "contractorId" });
      return;
    }

    const contractor = await prisma.contractor.create({
      data: {
        id: shortid.generate(),
        ...data,
        businessdetaildocument: data.businessdetaildocument || null,
        uploadutilitybill: data.uploadutilitybill || null,
        memorandam_of_associate: data.memorandam_of_associate || null,
        listofdirector: data.listofdirector || null,
        profileofkeyperson: data.profileofkeyperson || null,
        uploadbranchdetail: data.uploadbranchdetail || null,
        uploadreturndetail: data.uploadreturndetail || null,
        upload_registration_cert: data.upload_registration_cert || null,
        upload_licence1: data.upload_licence1 || null,
        upload_licence2: data.upload_licence2 || null,
        upload_list_ofclientele: data.upload_list_ofclientele || null,
        upload_certificate_services: data.upload_certificate_services || null,
        upload_doc1: data.upload_doc1 || null,
        upload_doc2: data.upload_doc2 || null,
      },
    });
    res.status(200).json(contractor);
  }

  if (req.method === "PUT") {
    const { id, ...data } = req.body;

    const contractorexists = await prisma.contractor.findUnique({
      where: {
        id: id,
      },
    });
    if (!contractorexists) {
      res.status(404).json({ message: "Contractor not found" });
    }

    const contractor = await prisma.contractor.update({
      where: {
        id: id,
      },
      data: data,
    });
    res.status(200).json(contractor);
  }

  if (req.method === "DELETE") {
    const { contractorId } = req.query;
    const session = await getSession({ req });
    console.log(session);

    if (!session || session.user?.role !== "Corporate") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const contractorexists = await prisma.contractor.findUnique({
      where: {
        contractorId: contractorId as string,
      },
    });
    if (!contractorexists) {
      res.status(404).json({ message: "Contractor not found" });
    }

    const contractor = await prisma.contractor.delete({
      where: {
        contractorId: contractorId as string,
      },
    });
    res.status(200).json(contractor);
  }
}
